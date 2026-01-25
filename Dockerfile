# =============================================================================
# Dockerfile Unificado - Adventury Gaming
# =============================================================================
# Este Dockerfile suporta dois modos de build:
#
# 1. MODO CLONE (Infra - Padrão):
#    Clona o repositório dentro do Docker usando um token GitHub.
#    docker build --build-arg REPO_URL=https://token@github.com/user/repo.git .
#
# 2. MODO CONTEXT (Desenvolvimento):
#    Usa o contexto local do Docker (arquivos no diretório).
#    docker build --build-arg USE_LOCAL_CONTEXT=true .
#
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base com ferramentas de build
# -----------------------------------------------------------------------------
FROM node:20-bookworm-slim AS base
WORKDIR /app

# Instalar git (necessário para clone e algumas dependências npm)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------------------------------------
# Stage 2: Source - Obter código fonte (clone ou context)
# -----------------------------------------------------------------------------
FROM base AS source

# Argumentos de build
ARG REPO_URL=""
ARG USE_LOCAL_CONTEXT="false"
ARG CACHE_BUST=""

# Se CACHE_BUST for fornecido, criar arquivo para invalidar cache
RUN if [ -n "$CACHE_BUST" ]; then echo "$CACHE_BUST" > /tmp/cache-bust.txt; fi

# Copiar código fonte - prioriza clone se REPO_URL for fornecido
# Caso contrário, usa contexto local
COPY . /tmp/context/

RUN if [ -n "$REPO_URL" ] && [ "$USE_LOCAL_CONTEXT" != "true" ]; then \
        echo ">>> Clonando repositório..." && \
        git clone --depth 1 "$REPO_URL" /app && \
        rm -rf /app/.git && \
        echo ">>> Clone concluído e .git removido"; \
    else \
        echo ">>> Usando contexto local..." && \
        cp -r /tmp/context/. /app/ && \
        rm -rf /app/.git 2>/dev/null || true; \
    fi

# Limpar contexto temporário
RUN rm -rf /tmp/context

# -----------------------------------------------------------------------------
# Stage 3: Dependencies - Instalar dependências
# -----------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

# Copiar apenas arquivos de dependências primeiro (para cache)
COPY --from=source /app/package*.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci

# -----------------------------------------------------------------------------
# Stage 4: Build - Gerar build de produção
# -----------------------------------------------------------------------------
FROM base AS build
WORKDIR /app

# Definir ambiente de build para Docker (usa adapter Node)
ENV BUILD_TARGET=docker
ENV NODE_ENV=production

# Copiar dependências instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY --from=source /app ./

# Executar build
RUN npm run build

# Verificar se o build gerou os arquivos esperados
RUN test -f ./dist/server/entry.mjs || (echo "ERROR: dist/server/entry.mjs not found!" && exit 1)
RUN test -d ./dist/client || (echo "ERROR: dist/client directory not found!" && exit 1)

# -----------------------------------------------------------------------------
# Stage 5: Production Dependencies - Apenas deps de produção
# -----------------------------------------------------------------------------
FROM base AS prod-deps
WORKDIR /app

COPY --from=source /app/package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --omit=dev

# -----------------------------------------------------------------------------
# Stage 6: Runner - Imagem final de produção
# -----------------------------------------------------------------------------
FROM node:20-bookworm-slim AS runner
WORKDIR /app

# Definir ambiente de produção
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Criar usuário não-root para segurança
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home astro

# Copiar apenas arquivos necessários para runtime
COPY --from=build --chown=astro:nodejs /app/dist ./dist
COPY --from=prod-deps --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=source --chown=astro:nodejs /app/package.json ./package.json

# Mudar para usuário não-root
USER astro

# Expor porta
EXPOSE 4321

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4321/', (r) => process.exit(r.statusCode === 200 || r.statusCode === 302 ? 0 : 1)).on('error', () => process.exit(1))"

# Comando de inicialização
CMD ["node", "./dist/server/entry.mjs"]

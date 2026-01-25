# Adventury Gaming | Website Oficial

Site oficial da **Adventury Gaming** - Divisão especializada da Adventury Corporation, focada em produtos digitais para streamers e criadores de conteúdo (Overlays, Alertas, Kits Completos).

## Sobre o Projeto

Este é o e-commerce da Adventury Gaming, construído com Astro, Vue 3 e TailwindCSS. O site comercializa kits de identidade visual para transmissões ao vivo.

### 🎨 Identidade Visual

- **Cor Principal**: #00A5FA (Azul claro)
- **Cor Secundária**: #003E65 (Azul escuro)
- **Design**: Moderno, limpo e focado em conversão

## Deploy

Este projeto suporta múltiplos ambientes de deployment:

- **Vercel** - Produção (recomendado para edge performance)
- **Docker** - Auto-hospedado ou cloud containers
- **Local** - Desenvolvimento e preview

### Ambientes Suportados

| Ambiente      | Adapter         | Comando                            |
| ------------- | --------------- | ---------------------------------- |
| Development   | N/A             | `npm run dev`                      |
| Vercel        | @astrojs/vercel | Deploy automático                  |
| Docker        | @astrojs/node   | `docker build` + `docker run`      |
| Local Preview | @astrojs/node   | `npm run build && npm run preview` |

---

## 🐳 Deploy com Docker

### Build da Imagem

```bash
# Usando código local (desenvolvimento/CI)
docker build --build-arg USE_LOCAL_CONTEXT=true -t advgaming .

# Usando repositório Git (produção/infra)
docker build \
  --build-arg REPO_URL=https://github.com/seu-usuario/advgaming.git \
  -t advgaming .
```

### Executar Container

```bash
# Executar em produção
docker run -d \
  --name advgaming \
  -p 4321:4321 \
  --restart unless-stopped \
  advgaming

# Com variáveis de ambiente
docker run -d \
  --name advgaming \
  -p 4321:4321 \
  --env-file .env \
  advgaming
```

### Health Check

O container inclui health check automático:

- Endpoint: `http://localhost:4321/`
- Intervalo: 30s
- Timeout: 10s

### Docker Compose (opcional)

```yaml
version: "3.8"
services:
  advgaming:
    build:
      context: .
      args:
        USE_LOCAL_CONTEXT: "true"
    ports:
      - "4321:4321"
    restart: unless-stopped
    env_file:
      - .env
```

---

## ▲ Deploy no Vercel

1. Conecte o repositório no Vercel Dashboard
2. Framework preset: **Astro**
3. Build command: `npm run build` (padrão)
4. Configure as variáveis de ambiente no painel

O arquivo `vercel.json` já está configurado corretamente.

---

## 1. Configuração do .env

Renomeie `env.txt` ou use `.env.example` como base para criar seu arquivo `.env`:

```bash
# Configuração Básica
SITE_URL=http://localhost:4321
WEBSITE_LANGUAGE=pt

# Pagamentos (Stripe)
STRIPE_SECRET_KEY=sk_test_... # Chave secreta do Stripe
STRIPE_WEBHOOK_SECRET=whsec_... # Secret para webhooks

# Newsletter (Opcional)
NEWSLETTER_PROVIDER=mailchimp # ou deixe vazio para desabilitar
MAILCHIMP_API_KEY=...
MAILCHIMP_SERVER_PREFIX=...
MAILCHIMP_LIST_ID=...

# Emails Transacionais (Opcional - escolha um)
POSTMARK_SERVER_TOKEN=... # Para Postmark
# ou
RESEND_API_KEY=... # Para Resend

# Contato
CONTACT_EMAIL=contato@adventurygaming.com
```

### Notas sobre Variáveis

- **STRIPE**: Necessário para processar pagamentos. Em dev, use as chaves de teste.
- **NEWSLETTER**: Se não configurado, o formulário de newsletter não aparecerá no footer.
- **EMAILS**: Usado para confirmações de pedido e contato.

### 2. Configure your Static CMS Backend

Navigate to `src/pages/admin.astro` and provide your Git repository details. You can find a list of all supported Git backends at:
<https://www.staticcms.org/docs/backends-overview>

**_Gitlab Example:_**

```javascript

const config = {
	locale: lang,
	site_url: url,
	logo_url: 'https://starfunnel.unfolding.io/logo.svg',
	local_backend: true,
	backend: {
		name: 'gitlab',
		repo: '/<your-gitlab-repo>',
		auth_type: 'pkce', // Required for pkce
		app_id: 'xxxx', // Application ID from your GitLab settings
		commit_messages: {
			create: 'Create {{collection}} "{{slug}}"',
			update: 'Update {{collection}} "{{slug}}"',
			delete: 'Delete {{collection}} "{{slug}}"',
			uploadMedia: 'Upload "{{path}}"',
			deleteMedia: 'Delete "{{path}}"'
		}
	},
	search: 'true',
    ....
}

```

### 3. Add your site to the astro config and set your adapter (vercel or netlify)

```javascript

export default defineConfig({
	site: 'https://your-website.com',
	output: "hybrid",
  	adapter: vercel(), // vercel() or netlify()

    ....

```

### 4. Install dependencies

```bash
npm install
```

### 🛠️ 5. Start Development server

```bash
npm run dev
```

If you wish to engage the local backend:

```bash
npm run cms-proxy-server
```

Now you can open Static CMS on http&#x3A;//localhost:4321/admin/

## 🛸 Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| -------------------------- | ------------------------------------------------ |
| `npm install`              | Installs dependencies                            |
| `npm run dev`              | Starts local dev server at `localhost:4321`      |
| `npm run cms-proxy-server` | Starts Staticcms proxy server for local-backend  |
| `npm run build`            | Build your production site to `./dist/`          |
| `npm run preview`          | Preview your build locally, before deploying     |
| `npm run astro ...`        | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help`  | Get help using the Astro CLI                     |

## 🐳 Arquitetura Docker

O Dockerfile utiliza multi-stage build otimizado:

```
┌─────────────────────────────────────────────────────────┐
│  Stage 1: base        │ Node 20 Alpine base image       │
│  Stage 2: source      │ Clone repo ou copy local        │
│  Stage 3: deps        │ Install todas dependências      │
│  Stage 4: build       │ Build Astro (BUILD_TARGET=docker)│
│  Stage 5: prod-deps   │ Install apenas produção deps    │
│  Stage 6: runner      │ Runtime com usuário não-root    │
└─────────────────────────────────────────────────────────┘
```

**Características:**

- Imagem final ~200MB
- Usuário não-root (segurança)
- Health check integrado
- Suporte a clone via URL ou código local

## 👀 Want to learn more about Astro?

Check out [Astro documentation](https://docs.astro.build) or jump into Astro's [Discord server](https://astro.build/chat).

## 📚 Tech Stack

- **Astro** - Framework web moderno e rápido
- **Vue 3** - Framework JavaScript progressivo
- **TailwindCSS** - Framework CSS utility-first
- **MDX** - Markdown com componentes JSX
- **Static CMS** - Sistema de gerenciamento de conteúdo

## 🎯 Serviços Apresentados

- Landing Pages
- Sites Institucionais
- Portfolios
- Blogs
- Link-in-Bio
- Bots & Atendimento com IA
- Integrações n8n
- Agendamentos Online
- Dashboards

## 📧 Contato

- **Email**: contato@adventurygaming.com
- **WhatsApp**: +55 (11) 99999-9999

## 🎮 Sobre a Adventury Gaming

A Adventury Gaming é a divisão da **Adventury Corporation** dedicada a impulsionar carreiras de criadores de conteúdo. Nossa missão é oferecer identidade visual de nível broadcast por um preço acessível.

## 🎨 Recursos do Site

- Catálogo de produtos (Kits Basic, Intermediate, Advanced)
- Páginas de produto detalhadas com galeria
- Integração com Stripe para pagamentos
- Blog para dicas de streaming
- Design responsivo e alta performance
- Sistema de newsletter integrado

## 📝 Créditos

Desenvolvido com base no template StarFunnel da [Unfolding.io](https://unfolding.io), completamente customizado para a identidade visual e necessidades da Adventury Network.

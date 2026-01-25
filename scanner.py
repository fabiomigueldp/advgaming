#!/usr/bin/env python3
"""
astro_scanner_v3.py - Snapshot Otimizado para Projetos Astro (Final)

Melhorias v3:
- Exclui arquivos minificados (.min.js, .map) e libs externas pesadas conhecidas.
- Auto-exclusão (não inclui o próprio scanner.py ou arquivos de log/saída).
- Refinamento de ignorados para TypeScript auto-gerado.
"""

import os
import sys
from pathlib import Path
from typing import Set, List, Tuple, Dict

# Tenta importar Pillow para metadados de imagem (Opcional)
try:
    from PIL import Image
    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                             CONFIGURAÇÃO DE FILTROS                          ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Diretórios para ignorar completamente
IGNORE_DIRS: Set[str] = {
    # Node / Javascript
    "node_modules", ".npm", ".yarn", ".pnpm-store", "bower_components",
    # Astro / Build / Frameworks
    ".astro", ".vercel", ".netlify", ".output", "dist", "build", "public/build",
    ".next", ".nuxt", ".svelte-kit",
    # Python / Env
    ".venv", "venv", "env", "__pycache__", ".pytest_cache", ".mypy_cache", 
    ".tox", ".eggs", "*.egg-info",
    # Git / IDE
    ".git", ".svn", ".hg", ".vscode", ".idea", ".vs", ".zed", ".fleet",
    # Logs / Temp / Coverage
    "logs", "*.log", "tmp", "temp", "coverage", ".nyc_output"
}

# Arquivos específicos para ignorar (Ruído)
IGNORE_FILES: Set[str] = {
    # O próprio script e saídas anteriores
    "scanner.py", "astro_scanner.py", "project_context.md", "snapshot.md", 
    "output.txt", "advnetwork_context.md",
    # Locks
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb",
    "poetry.lock", "Pipfile.lock",
    # Sistema
    ".DS_Store", ".AppleDouble", "Thumbs.db", "ehthumbs.db", ".directory",
    # Configs de Git e Linting (muitas vezes irrelevante para contexto de código)
    ".gitignore", ".gitattributes", ".gitmodules", ".prettierignore", ".eslintignore",
    # Segredos (Ignorar o real)
    ".env", ".env.local", ".env.production", ".env.development", ".env.test",
    # Licenças e Logs
    "LICENSE", "LICENSE.md", "npm-debug.log", "yarn-error.log",
    # Arquivos minificados ou de terceiros específicos deste projeto que detectamos
    "scroll-timeline.js", # <--- ADICIONADO: Removemos o polyfill gigante
    "env.d.ts" # <--- ADICIONADO: Geralmente é boilerplate do Astro
}

# Arquivos de ambiente que DEVEMOS incluir (templates)
INCLUDE_ENV_EXAMPLES: Set[str] = {
    ".env.example", ".env.template", ".env.sample", ".env.public", "env.txt"
}

# Extensões consideradas CÓDIGO/TEXTO (serão lidas)
TEXT_EXTENSIONS: Set[str] = {
    # Astro & Frameworks
    ".astro", ".vue", ".svelte", ".jsx", ".tsx",
    # Scripting
    ".ts", ".js", ".mjs", ".cjs", ".py", ".sh",
    # Styles
    ".css", ".scss", ".sass", ".postcss", ".less", ".tailwind.css",
    # Data & Config
    ".json", ".jsonc", ".yaml", ".yml", ".toml", ".xml",
    # Content
    ".md", ".mdx", ".txt", ".html"
}

# Extensões consideradas ASSETS (apenas metadados: resolução/tamanho)
ASSET_EXTENSIONS: Set[str] = {
    # Imagens
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".svg", ".avif", ".bmp", ".tiff",
    # Video/Audio
    ".mp4", ".webm", ".mov", ".mp3", ".wav", ".ogg",
    # Docs Binários / Fontes
    ".pdf", ".zip", ".tar", ".gz", ".rar", ".ttf", ".otf", ".woff", ".woff2", ".eot"
}

MAX_TEXT_SIZE = 200 * 1024  # Reduzi para 200KB. Arquivos de texto maiores que isso geralmente são logs ou minificados.

class AstroScanner:
    def __init__(self, root: Path):
        self.root = root.resolve()
        self.tree_lines: List[str] = []
        self.files_content: List[Tuple[Path, str]] = []
        self.assets_metadata: List[Dict] = []
        self.stats = {"dirs": 0, "files": 0, "assets": 0, "skipped": 0}

    def get_file_type_hint(self, path: Path) -> str:
        name = path.name.lower()
        ext = path.suffix.lower()
        if "tailwind" in name: return "javascript"
        if "astro.config" in name: return "javascript"
        if ext == ".astro": return "astro"
        if ext == ".vue": return "vue"
        if ext in [".ts", ".tsx"]: return "typescript"
        if ext in [".js", ".mjs", ".cjs", ".jsx"]: return "javascript"
        if ext in [".md", ".mdx"]: return "markdown"
        if ext in [".json", ".jsonc"]: return "json"
        if ext in [".css", ".scss", ".sass"]: return "css"
        if ext == ".py": return "python"
        return ""

    def get_image_metadata(self, path: Path) -> str:
        size_bytes = path.stat().st_size
        size_str = f"{size_bytes / 1024:.1f} KB"
        resolution = "-"
        format_detected = path.suffix.upper().replace(".", "")

        if HAS_PILLOW and path.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp', '.bmp'}:
            try:
                with Image.open(path) as img:
                    width, height = img.size
                    resolution = f"{width}x{height}"
                    format_detected = img.format or format_detected
            except Exception:
                pass
        return f"| {path.name} | {format_detected} | {resolution} | {size_str} |"

    def should_ignore(self, path: Path) -> bool:
        # 1. Ignorar arquivos minificados (ex: jquery.min.js)
        if ".min." in path.name:
            return True

        # 2. Ignorar diretórios
        for part in path.parts:
            if part in IGNORE_DIRS:
                return True
        
        # 3. Ignorar arquivos específicos
        if path.name in IGNORE_FILES:
            return True
            
        # 4. Arquivos ocultos (Dotfiles)
        if path.name.startswith("."):
            if path.name in INCLUDE_ENV_EXAMPLES: return False
            whitelisted = [".eslintrc", ".prettierrc", ".npmrc", ".babelrc", ".editorconfig"]
            if not any(path.name.startswith(w) for w in whitelisted):
                return True

        return False

    def scan(self):
        for root, dirs, files in os.walk(self.root):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            dirs.sort()
            files.sort()

            current_dir = Path(root)
            try:
                rel_dir = current_dir.relative_to(self.root)
            except ValueError:
                continue
            
            level = len(rel_dir.parts)
            indent = "    " * level
            if str(rel_dir) != ".":
                self.tree_lines.append(f"{indent}📁 {rel_dir.name}/")
            
            subindent = "    " * (level + 1)
            
            for file in files:
                file_path = current_dir / file
                
                if self.should_ignore(file_path):
                    self.stats["skipped"] += 1
                    continue

                self.stats["files"] += 1
                
                if file_path.suffix.lower() in ASSET_EXTENSIONS:
                    self.stats["assets"] += 1
                    meta = self.get_image_metadata(file_path)
                    rel_path = str(file_path.relative_to(self.root))
                    self.assets_metadata.append({"path": rel_path, "meta": meta})
                    self.tree_lines.append(f"{subindent}🖼️ {file}")
                
                elif file_path.suffix.lower() in TEXT_EXTENSIONS or file_path.name in INCLUDE_ENV_EXAMPLES:
                    self.tree_lines.append(f"{subindent}📄 {file}")
                    # Leitura de conteúdo
                    if file_path.stat().st_size <= MAX_TEXT_SIZE:
                        try:
                            content = file_path.read_text(encoding="utf-8", errors="replace")
                            self.files_content.append((file_path, content))
                        except Exception as e:
                            self.tree_lines.append(f"{subindent}   ⚠️ Erro: {e}")
                    else:
                        self.tree_lines.append(f"{subindent}   ⚠️ [Arquivo grande ignorado: {file_path.stat().st_size/1024:.1f} KB]")
                else:
                    self.tree_lines.append(f"{subindent}⚪ {file}")

    def generate_report(self) -> str:
        report = []
        report.append(f"# Snapshot: {self.root.name}")
        report.append("")
        
        report.append("## 1. Estrutura")
        report.append("```text")
        report.append("\n".join(self.tree_lines))
        report.append("```")
        report.append("")

        if self.assets_metadata:
            report.append("## 2. Assets (Metadados)")
            report.append("| Caminho | Tipo | Resolução | Peso |")
            report.append("|---|---|---|---|")
            for item in self.assets_metadata:
                folder = os.path.dirname(item['path'])
                filename_meta = item['meta']
                clean_meta = filename_meta.strip("|").split("|")
                if len(clean_meta) >= 4:
                    name = clean_meta[0].strip()
                    rest = "|".join(clean_meta[1:])
                    report.append(f"| `{folder}/{name}` | {rest} |")
            report.append("")

        report.append("## 3. Conteúdo")
        for path, content in self.files_content:
            rel_path = path.relative_to(self.root)
            lang = self.get_file_type_hint(path)
            report.append(f"### `{rel_path}`")
            report.append(f"```{lang}")
            report.append(content)
            report.append("```")
            report.append("")
            
        return "\n".join(report)

def copy_to_clipboard(text: str) -> bool:
    import subprocess
    if sys.platform == "darwin":
        try:
            p = subprocess.Popen(["pbcopy"], stdin=subprocess.PIPE)
            p.communicate(text.encode("utf-8"))
            return p.returncode == 0
        except: pass
    elif sys.platform == "win32" or "microsoft" in os.uname().release.lower():
        try:
            p = subprocess.Popen(["clip.exe"], stdin=subprocess.PIPE)
            p.communicate(text.encode("utf-16"))
            return p.returncode == 0
        except: pass
    try:
        p = subprocess.Popen(["xclip", "-selection", "clipboard"], stdin=subprocess.PIPE)
        p.communicate(text.encode("utf-8"))
        if p.returncode == 0: return True
    except: pass
    try:
        p = subprocess.Popen(["wl-copy"], stdin=subprocess.PIPE)
        p.communicate(text.encode("utf-8"))
        if p.returncode == 0: return True
    except: pass
    return False

def main():
    root_path = Path.cwd()
    if len(sys.argv) > 1:
        potential_path = Path(sys.argv[1])
        if potential_path.is_dir():
            root_path = potential_path

    print(f"🚀 Escaneando: {root_path.name} ...")
    scanner = AstroScanner(root_path)
    scanner.scan()
    report = scanner.generate_report()
    
    if copy_to_clipboard(report):
        print(f"\n✅ SUCESSO! Snapshot copiado.")
        print(f"📊 Stats: {scanner.stats['files']} arquivos, {scanner.stats['assets']} assets.")
        print(f"🚫 Ignorados: {scanner.stats['skipped']} (incluindo libs minificadas)")
    else:
        print(f"\n⚠️  Não foi possível copiar.")
        print("   Imprimindo resultado:")
        print(report)

if __name__ == "__main__":
    main()
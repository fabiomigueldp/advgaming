import os
import subprocess
import time
import shutil

# Config
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_FILE = os.path.join(BASE_DIR, "generator.html")
OUTPUT_EN = os.path.join(BASE_DIR, "en")
OUTPUT_PT = os.path.join(BASE_DIR, "pt")

# Ensure output dirs
os.makedirs(OUTPUT_EN, exist_ok=True)
os.makedirs(OUTPUT_PT, exist_ok=True)

# Tasks
TASKS = [
    {"id": "thumb-main", "file": "thumbnail_main.png"},
    {"id": "thumb-colors", "file": "gallery_colors.png"},
    {"id": "thumb-stream", "file": "gallery_stream.png"},
    {"id": "thumb-offline", "file": "gallery_offline.png"},
    {"id": "thumb-waiting", "file": "gallery_waiting.png"},
]

LANGS = ["en", "pt"]

def generate():
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    for lang in LANGS:
        print(f"--- Processing Language: {lang} ---")
        out_dir = OUTPUT_EN if lang == "en" else OUTPUT_PT
        
        for task in TASKS:
            tid = task["id"]
            fname = task["file"]
            print(f"Generating {tid} -> {fname}...")
            
            # Create Temporary HTML with hardcoded values
            # Replace the JS logic lines
            project_root = os.path.dirname(BASE_DIR).replace('\\', '/')
            abs_root = f"file:///{project_root}"
            
            temp_content = content.replace(
                "const params = getHashParams();", 
                f"// Hardcoded build\n        const targetId = '{tid}';\n        const lang = '{lang}';"
            ).replace(
                "const targetId = params.get('id');", 
                "// replaced"
            ).replace(
                "const lang = params.get('lang') || 'en';",
                "// replaced"
            ).replace(
                "../", 
                f"{abs_root}/"
            )
            
            temp_html_name = f"temp_{lang}_{tid}.html"
            temp_html_path = os.path.join(BASE_DIR, temp_html_name)
            
            with open(temp_html_path, "w", encoding="utf-8") as f:
                f.write(temp_content)
            
            # Render
            output_img_path = os.path.join(out_dir, fname)
            file_url = f"file:///{temp_html_path.replace(os.sep, '/')}"
            
            cmd = [
                CHROME_PATH,
                "--headless",
                "--disable-gpu",
                "--window-size=1280,720",
                f"--screenshot={output_img_path}",
                "--virtual-time-budget=5000",
                file_url
            ]
            
            # Run chrome
            subprocess.run(cmd, check=True, capture_output=True)
            
            # Clean up html
            if os.path.exists(temp_html_path):
                os.remove(temp_html_path)

if __name__ == "__main__":
    generate()

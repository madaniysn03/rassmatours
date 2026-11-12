"""Telecharge les polices Google Fonts (sous-ensemble latin) pour les auto-heberger.

Usage : python scripts/fetch-fonts.py  (depuis rassmatours/)
Produit public/fonts/*.woff2 et src/styles/fonts.css. Licence des polices : SIL Open Font License.
"""
import re
import urllib.request
from pathlib import Path

CSS_URL = (
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500"
    "&family=Jost:wght@300;400;500;600&display=swap"
)
# Un navigateur moderne obtient des fichiers woff2 avec unicode-range.
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
KEEP_SUBSETS = {"latin", "latin-ext"}

out_dir = Path("public/fonts")
out_dir.mkdir(parents=True, exist_ok=True)

req = urllib.request.Request(CSS_URL, headers={"User-Agent": UA})
css = urllib.request.urlopen(req, timeout=30).read().decode("utf-8")

blocks = re.findall(r"/\* (\S+) \*/\s*(@font-face \{[^}]+\})", css)
kept = []
for subset, block in blocks:
    if subset not in KEEP_SUBSETS:
        continue
    family = re.search(r"font-family: '([^']+)'", block).group(1)
    style = re.search(r"font-style: (\w+)", block).group(1)
    weight = re.search(r"font-weight: (\d+)", block).group(1)
    url = re.search(r"url\((https://[^)]+)\)", block).group(1)
    name = f"{family.lower().replace(' ', '-')}-{weight}-{style}-{subset}.woff2"
    target = out_dir / name
    if not target.exists():
        data = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30).read()
        target.write_bytes(data)
    block = re.sub(r"url\(https://[^)]+\) format\('woff2'\)", f"url('/fonts/{name}') format('woff2')", block)
    block = block.replace("font-display: swap;", "font-display: swap;")
    kept.append(f"/* {family} {weight} {style} {subset} */\n{block}")

Path("src/styles/fonts.css").write_text(
    "/* Polices auto-hebergees (Google Fonts, licence OFL), sous-ensembles latin et latin-ext. */\n\n"
    + "\n\n".join(kept)
    + "\n",
    encoding="utf-8",
)
print(f"{len(kept)} font faces, {sum(p.stat().st_size for p in out_dir.glob('*.woff2')) // 1024} KB in {out_dir}")

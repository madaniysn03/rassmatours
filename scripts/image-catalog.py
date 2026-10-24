"""Génère research/image-sources.csv et une table Markdown à partir du manifeste d'images.

Usage : python scripts/image-catalog.py (depuis rassmatours/). Nécessite ffprobe.
"""
import csv
import os
import re
import subprocess

CREDITS = {
    "photo-1582919534700-acf2374f10d3": ("raulcachophoto", "atwIEcpyeSM"),
    "photo-1533501747004-381b96042e88": ("raulcachophoto", "2A8ONQWR69g"),
    "photo-1765320020091-966fa75d8901": ("0x0red", "sjniJT-EOiQ"),
    "photo-1763084809612-41c2a9ac5790": ("alezyra", "QZEZcrkr0gw"),
    "photo-1519741641280-af0bfbbb2a31": ("bilalkamal_bk", "NXNYSZSltck"),
    "photo-1749993085932-85074f8c07d6": ("theemanofoth", "OUbNul8HKdo"),
    "photo-1749906940090-90972d591c94": ("theemanofoth", "s__jKE6v7fk"),
    "photo-1749907598647-2c9bf8a52059": ("theemanofoth", "1nqEZ8xFJ1I"),
    "photo-1749993085717-af32f21b20da": ("theemanofoth", "OvKcQnDzww4"),
    "photo-1749993086418-3ab383806327": ("theemanofoth", "JXOxx7unn6o"),
    "photo-1749993086438-8600ed2d6a86": ("theemanofoth", "gcHdZnmUz5E"),
    "photo-1749906940078-017e5fc2d4c9": ("theemanofoth", "m8VDuigR4MQ"),
    "photo-1749993085663-4bbfda699e8d": ("theemanofoth", "skXtZ_OpRNo"),
    "photo-1641734052941-bb57e88f67f2": ("sediri_ayoub", "GaUiN12Rdfc"),
    "photo-1689969936692-fc1a1807ae8b": ("kyllik", "EOn4kwra0qc"),
    "photo-1749993084340-ba0faa17217e": ("theemanofoth", "7mq_MU6_6kg"),
    "photo-1646585468178-d82a6573633a": ("haykad684", "ksdfFSg91i4"),
    "photo-1671518283785-2e43588774b7": ("lsgerbec", "fNtAFyRi7es"),
    "photo-1711971725727-aa6e812eb45d": ("todorandonov", "8kZ3NOlkVe8"),
    "photo-1589278173760-b2f426dc0903": ("leviaripronk", "gux9IsIluW8"),
    "photo-1640397348992-db78f960f688": ("madbillzzz", "7CciILPba68"),
    "photo-1717654855451-9fd9b12c3fbd": ("starkie_pics", "UnzkvCEk1Mg"),
    "photo-1585547392718-f7369480ef5a": ("cosoproductions", "ot-oEnMwjRY"),
    "photo-1771690288512-f913102aa2cd": ("youssmub", "4F_t61uOMBU"),
    "photo-1718247528964-7b42735cec8b": ("helixgames", "KDGpOAyyreg"),
    "photo-1669542872916-cd696767d4f7": ("andri77", "YTpUV9oNjmw"),
    "photo-1749286601978-872f78ec1cc7": ("theemanofoth", "7MRSrSxfUr8"),
    "photo-1654022945053-f61ac2bf839a": ("les_trippers", "dV0iDk1vKaA"),
    "photo-1749906939887-8be26f783207": ("theemanofoth", "PoJ6j3i6DLA"),
    "photo-1569383746724-6f1b882b8f46": ("infinitexplorer", "NncAbldgViA"),
    "photo-1762538190384-c78b301be187": ("find_something_pretty_everyday", "bX9UO5V1tPs"),
    "photo-1538600838042-6a0c694ffab5": ("mohammedlak", "CBfUGtVP0QE"),
    "photo-1564507004663-b6dfb3c824d5": ("koullislp", "CMmgfHQiYsc"),
    "photo-1772531936218-be977c8920b9": ("bethchobanova", "zdulPe3bVNU"),
    "photo-1572271647829-ce364fb5df0b": ("mohammedlak", "g9nVb3AzShA"),
    "photo-1538245951235-eec5ed471724": ("mohammedlak", "jrWBI2FFsbQ"),
    "photo-1592931801419-3d1e3c3bd292": ("abdelhamid_az", "EHSFlap-yvg"),
    "photo-1768913652454-8963c60efc5c": ("theemanofoth", "ILnxcXUxWyk"),
    "photo-1749993086443-93a5a88eb4c2": ("theemanofoth", "Bi_hJh5oEtA"),
    "photo-1749993086204-9d9c1aa3ef36": ("theemanofoth", "ftYjriPMfT0"),
    "photo-1773209927898-a0a7e0a13125": ("altimod", "QFGOSN99_lU"),
    "photo-1758745464235-ccb8c1253074": ("alessionord", "3dVx9j1iepM"),
    "photo-1713607763620-dbfe9c10b3ff": ("packetdiscards", "_n9PLGmJq9Y"),
    "photo-1555758933-42f41c02c82f": ("jonathanpielmayer", "J2pQH8r7WBc"),
    "photo-1574810134700-b6ba48d151a0": ("rachidnl", "VBW7PlDhzWU"),
    "photo-1517314626714-ac1b9a16515e": ("anniespratt", "_V4v7BbG338"),
    "photo-1749993085177-e1360075cc5b": ("theemanofoth", "LiOCTpR7yTc"),
    "photo-1749993085771-b8dccd30317a": ("theemanofoth", "-8VkSI1pgx4"),
    "photo-1674227051125-4b0d5184cf9f": ("sandertraa", "LG88LKa-irA"),
    "photo-1653260137243-2b3daabf9aab": ("rumanamin", "ufPyadx1z_E"),
    "photo-1674227053748-0b0d0ad0b7c9": ("sandertraa", "in1z9WjiSR8"),
}


def main() -> None:
    src = open("src/data/images.ts", encoding="utf-8").read()
    alts = {}
    for m in re.finditer(r"(landscape|portrait)\('([^']+)', '((?:[^'\\]|\\.)*)', '([^']+)'\)", src):
        alts[m.group(2)] = m.group(3).replace("\\u2019", "’")

    rows = []
    total = 0
    for line in open("scripts/image-manifest.txt", encoding="utf-8"):
        if not line.strip():
            continue
        path, _orient, pid = line.split()
        f = f"public/images/{path}.jpg"
        total += os.path.getsize(f)
        dims = subprocess.run(
            ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", f],
            capture_output=True,
            text=True,
        ).stdout.strip().replace(",", "x")
        user, photo_id = CREDITS[pid]
        rows.append(
            {
                "file": f,
                "subject": alts.get(path, ""),
                "source_url": f"https://unsplash.com/photos/{photo_id}",
                "author": "@" + user,
                "license": "Unsplash License",
                "dimensions": dims,
                "status": "OK - remplacement temporaire",
                "consulted_on": "2026-10-20",
            }
        )

    with open("research/image-sources.csv", "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    md = ["| Fichier | Sujet (texte alternatif) | Source | Auteur | Dimensions |", "|---|---|---|---|---|"]
    for r in rows:
        md.append(f"| `{r['file'].replace('public/images/', '')}` | {r['subject']} | {r['source_url']} | {r['author']} | {r['dimensions']} |")
    open("research/_image-table.md", "w", encoding="utf-8").write("\n".join(md) + "\n")
    print(len(rows), "images,", round(total / 1e6, 1), "MB (masters)")


if __name__ == "__main__":
    main()

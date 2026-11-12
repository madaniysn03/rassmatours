#!/usr/bin/env bash
# Installation du site Rassma Tours (frontend + backend-api).
# Idempotent : relançable sans risque. Usage : bash setup.sh [--build]
set -euo pipefail
cd "$(dirname "$0")"

say() { printf '\n\033[1m%s\033[0m\n' "$1"; }

say "1/4  Vérification de Node.js"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js est introuvable. Installez Node.js 22 (LTS) : https://nodejs.org/" >&2
  exit 1
fi
if ! node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>20||(a===20&&b>=19)?0:1)'; then
  echo "Node.js $(node -v) détecté : la version 20.19 ou plus récente est requise (22 recommandée)." >&2
  exit 1
fi
echo "Node.js $(node -v), npm $(npm -v)"

say "2/4  Fichiers d'environnement"
for dir in frontend backend-api; do
  if [ ! -f "$dir/.env" ]; then
    cp "$dir/.env.example" "$dir/.env"
    echo "$dir/.env créé à partir de $dir/.env.example : à compléter."
  else
    echo "$dir/.env déjà présent, conservé."
  fi
done

say "3/4  Dépendances"
if [ -d node_modules ]; then
  npm install --no-audit --no-fund
else
  npm ci --no-audit --no-fund
fi

if [ "${1:-}" = "--build" ]; then
  say "4/4  Build de production"
  npm run build
  (cd frontend && node scripts/seo-audit.mjs)
  echo "Site : frontend/dist/   API : backend-api/dist/   Lancer : npm start (voir docs/deploy.md)"
else
  say "4/4  Prêt"
  echo "Développement : npm run dev   (site http://localhost:5173, API http://localhost:3001)"
  echo "Production :    bash setup.sh --build, puis npm start"
fi

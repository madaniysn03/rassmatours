#!/usr/bin/env bash
# Installation et premier lancement du site Rassma Tours.
# Idempotent : relancable sans risque. Usage : bash setup.sh [--build]
set -euo pipefail
cd "$(dirname "$0")"

say() { printf '\n\033[1m%s\033[0m\n' "$1"; }

say "1/4  Verification de Node.js"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js est introuvable. Installez Node.js 20 ou plus recent : https://nodejs.org/" >&2
  exit 1
fi
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node.js $(node -v) detecte : la version 20 ou plus recente est requise." >&2
  exit 1
fi
echo "Node.js $(node -v), npm $(npm -v)"

say "2/4  Fichier d'environnement"
if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env cree a partir de .env.example : renseignez VITE_SITE_URL avant un build de production."
else
  echo ".env deja present, conserve."
fi

say "3/4  Dependances"
# npm ci supprime node_modules : reserve aux installations neuves (sous Windows, un serveur de
# developpement en cours verrouille des fichiers et ferait echouer la suppression).
if [ -d node_modules ]; then
  npm install --no-audit --no-fund
elif [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund
else
  npm install --no-audit --no-fund
fi

if [ "${1:-}" = "--build" ]; then
  say "4/4  Build de production"
  npm run build
  node scripts/seo-audit.mjs
  echo "Le site statique est dans dist/ ; apercu : npm run preview (http://localhost:5175)"
else
  say "4/4  Pret"
  echo "Lancez le serveur de developpement : npm run dev   (http://localhost:5173)"
  echo "Build de production :               bash setup.sh --build"
fi

# API Rassma Tours (Node.js 22 + Hono).
# Construire depuis la RACINE du dépôt (workspaces npm, lockfile à la racine) :
#   docker build -f backend-api/Dockerfile -t rassmatours-api .
# Lancer (les secrets passent par l'environnement, jamais dans l'image) :
#   docker run -d --name rassmatours-api -p 3001:3001 --env-file backend-api/.env -v rassmatours-data:/data rassmatours-api

# --- Build : dépendances complètes + compilation TypeScript ---------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend-api/package.json backend-api/
COPY frontend/package.json frontend/
RUN npm ci --workspace backend-api --include-workspace-root=false --no-audit --no-fund
COPY backend-api/ backend-api/
RUN npm run build -w backend-api

# --- Exécution : dépendances de production seulement ----------------------------------------------
FROM node:22-alpine
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3001 \
    DATA_DIR=/data \
    TRUST_PROXY=1
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend-api/package.json backend-api/
COPY frontend/package.json frontend/
RUN npm ci --workspace backend-api --include-workspace-root=false --omit=dev --no-audit --no-fund \
 && npm cache clean --force
COPY --from=build /app/backend-api/dist backend-api/dist

# Données (messages, galerie, photos) : à monter en volume pour survivre aux mises à jour.
RUN mkdir -p /data && chown -R node:node /data
VOLUME ["/data"]
USER node
WORKDIR /app/backend-api
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:3001/api/health || exit 1
CMD ["node", "dist/server.js"]

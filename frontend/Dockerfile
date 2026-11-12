# Site Rassma Tours : build Vite + prérendu, servi par nginx (qui relaie /api/ vers le conteneur backend-api).
# Construire depuis la RACINE du dépôt (workspaces npm, lockfile à la racine) :
#   docker build -f frontend/Dockerfile -t rassmatours-web \
#     --build-arg VITE_SITE_URL=https://rassmatours.com --build-arg VITE_GA4_ID= .
# Lancer :
#   docker run -d --name rassmatours-web -p 8080:80 -e API_UPSTREAM=http://rassmatours-api:3001 rassmatours-web
# Les variables VITE_* sont figées dans le HTML au build : changer de domaine = reconstruire l'image.

# --- Build : site statique dans frontend/dist ------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/
COPY backend-api/package.json backend-api/
RUN npm ci --workspace frontend --include-workspace-root=false --no-audit --no-fund
COPY frontend/ frontend/
ARG VITE_SITE_URL=https://rassmatours.com
ARG VITE_GA4_ID=
ARG VITE_NOINDEX=
ARG VITE_INQUIRY_ENDPOINT=
# Adresse publique de l'API (ex. https://api.rassmatours.com). Vide : /api/ sur le même domaine (relayé par nginx).
ARG VITE_API_URL=
ENV VITE_SITE_URL=$VITE_SITE_URL \
    VITE_GA4_ID=$VITE_GA4_ID \
    VITE_NOINDEX=$VITE_NOINDEX \
    VITE_INQUIRY_ENDPOINT=$VITE_INQUIRY_ENDPOINT \
    VITE_API_URL=$VITE_API_URL
# Build + audit SEO : l'image n'est pas construite si une page a un problème (titre, canonical, liens…).
RUN npm run build -w frontend && cd frontend && node scripts/seo-audit.mjs

# Redirections 301 de _redirects (« /ancien  /nouveau  301 ») converties en règles nginx.
RUN awk '$3 == "301" { printf "location = %s { return 301 %s; }\n", $1, $2 }' frontend/dist/_redirects > /app/redirects.conf

# --- Exécution : nginx -----------------------------------------------------------------------------
FROM nginx:1.27-alpine
# Adresse du conteneur API ; DNS_RESOLVER = DNS interne de Docker (résolution à la demande : nginx démarre même si l'API est arrêtée).
ENV API_UPSTREAM=http://api:3001 \
    DNS_RESOLVER=127.0.0.11
COPY frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/redirects.conf /etc/nginx/redirects.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

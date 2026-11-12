# Déploiement sur un serveur

Le projet a deux parties :

| Dossier | Contenu | Résultat du build |
|---|---|---|
| `frontend/` | Site (Vite + React), prérendu en HTML statique | `frontend/dist/` : fichiers statiques |
| `backend-api/` | API Node.js (Hono) : formulaire de contact, admin, galerie | `backend-api/dist/` : `node dist/server.js` |

Prérequis : un serveur avec **Node.js 22 LTS** (20.19 minimum) et un accès SSH. Pas de base de données :
les données sont des fichiers dans `backend-api/data/` (à sauvegarder).

## Production actuelle : Dokploy (dash.bpxdev.me)

Projet **rassmatours**, environnement **production**, trois services séparés :

| Service | Type | Source | Domaine | Port |
|---|---|---|---|---|
| `database` | PostgreSQL 16 | image `postgres:16-alpine` | aucun (réseau interne) | 5432 |
| `backend-api` | Application | GitHub `main`, `backend-api/Dockerfile` (contexte `.`) | https://api.rassmatours.com | 3001 |
| `frontend` | Application | GitHub `main`, `frontend/Dockerfile` (contexte `.`) | https://rassmatours.com, https://www.rassmatours.com | 80 |

- **Variables du backend** (Dokploy > backend-api > Environment) : `DATABASE_URL` (vers le service `database`),
  `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `ALLOWED_ORIGINS=https://rassmatours.com,https://www.rassmatours.com`,
  `TRUST_PROXY=1`, `HOST=0.0.0.0`, `PORT=3001`. Le mot de passe de l'admin se lit et se change ici (puis Redeploy).
- **Build args du frontend** (Dokploy > frontend > Environment > Build-time) : `VITE_SITE_URL=https://rassmatours.com`,
  `VITE_API_URL=https://api.rassmatours.com`, `VITE_GA4_ID` (vide pour l'instant). Les modifier demande un Redeploy.
- **Certificats** : Let's Encrypt via Traefik ; DNS chez Cloudflare (proxy actif), SSL Cloudflare en « Full » ou « Full (strict) ».
- **Tables** créées automatiquement au démarrage de l'API : `inquiries`, `gallery_manifest`, `gallery_images`.
- **Mettre à jour le site** : pousser sur `main`, puis Dokploy > service > **Deploy** (pas de déploiement automatique :
  le dépôt est branché en « Git » sans webhook ; pour l'automatiser, copier l'URL de webhook du service dans
  GitHub > Settings > Webhooks).
- **Sauvegardes** : Dokploy > database > Backups (destination S3 à configurer dans Settings > Destinations).

## Avec Docker (le plus simple)

Deux images : `backend-api/Dockerfile` (API Node) et `frontend/Dockerfile` (site servi par nginx, qui relaie `/api/`
vers l'API). `docker-compose.yml` les relie, avec un volume pour les données.

```bash
cp backend-api/.env.example backend-api/.env   # ADMIN_PASSWORD, ADMIN_SESSION_SECRET
nano docker-compose.yml                        # VITE_SITE_URL (et VITE_GA4_ID) dans web > build > args
docker compose up -d --build                   # site + API sur http://<serveur>:8080
```

- HTTPS : un proxy devant le port 8080 (Caddy : `rassmatours.com { reverse_proxy localhost:8080 }`, ou Traefik,
  ou nginx + certbot). Les en-têtes `X-Forwarded-*` sont transmis jusqu'à l'API.
- Données : volume `rassmatours-data` (messages, galerie, photos). Sauvegarde :
  `docker run --rm -v rassmatours_rassmatours-data:/data -v $PWD:/backup alpine tar czf /backup/data.tgz -C /data .`
- Mise à jour : `git pull && docker compose up -d --build`. Les variables `VITE_*` sont figées dans l'image du site :
  changer de domaine demande de reconstruire `web`.
- Sans compose : voir les commandes `docker build` / `docker run` en tête de chaque Dockerfile (les deux conteneurs
  doivent partager un réseau Docker, `API_UPSTREAM` pointe vers le nom du conteneur API).

## Sans Docker

## 1. Installer et construire

```bash
git clone git@github.com:madaniysn03/rassmatours.git && cd rassmatours
bash setup.sh            # crée frontend/.env et backend-api/.env, installe les dépendances
nano frontend/.env       # VITE_SITE_URL=https://rassmatours.com (obligatoire), VITE_GA4_ID si besoin
nano backend-api/.env    # ADMIN_PASSWORD, ADMIN_SESSION_SECRET, TRUST_PROXY=1 derrière nginx
bash setup.sh --build    # build du site + de l'API, audit SEO
```

Variables du frontend (lues **au build**, publiques) : `VITE_SITE_URL`, `VITE_GA4_ID`, `VITE_NOINDEX` (`true` sur un
serveur de test), `VITE_INQUIRY_ENDPOINT` (vide = `/api/inquiry`).
Variables du backend (secrètes, lues **au démarrage**) : voir `backend-api/.env.example`.

## 2. Choisir comment servir le site

### Option A (la plus simple) : Node sert tout
Dans `backend-api/.env` : `FRONTEND_DIR=../frontend/dist`. Le serveur Node sert les pages (redirections 301,
slash final, 404, en-têtes de `_headers`, gzip, vidéos) et l'API. Devant, un reverse proxy pour le HTTPS :

```nginx
server {
  server_name rassmatours.com www.rassmatours.com;
  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 10m;
  }
  # HTTPS : sudo certbot --nginx -d rassmatours.com -d www.rassmatours.com
}
```

### Option B : nginx sert le site, Node seulement l'API
`FRONTEND_DIR` vide. nginx sert `frontend/dist` et relaie `/api/` :

```nginx
server {
  server_name rassmatours.com;
  root /var/www/rassmatours/frontend/dist;

  location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 10m;
  }
  location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
  location /fonts/  { expires 1y; add_header Cache-Control "public, immutable"; }
  location /admin/  { add_header X-Robots-Tag "noindex, nofollow"; try_files $uri $uri/index.html =404; }
  location / { try_files $uri $uri/index.html =404; }
  error_page 404 /404.html;
  # Reprendre ici les redirections 301 de frontend/dist/_redirects (une ligne « location = /ancien { return 301 /nouveau/; } » par règle).
}
```

## 3. Garder l'API en marche (systemd)

`/etc/systemd/system/rassmatours.service` :

```ini
[Unit]
Description=Rassma Tours API
After=network.target

[Service]
WorkingDirectory=/var/www/rassmatours/backend-api
ExecStart=/usr/bin/node dist/server.js
Restart=always
User=www-data
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
sudo chown -R www-data /var/www/rassmatours/backend-api/data
sudo systemctl enable --now rassmatours
sudo systemctl status rassmatours        # logs : journalctl -u rassmatours -f
```

(Alternative : `pm2 start backend-api/dist/server.js --name rassmatours && pm2 save`.)

## 4. Mettre à jour

```bash
git pull && npm ci && npm run build && sudo systemctl restart rassmatours
```

## 5. Vérifier

- `https://<domaine>/api/health` → `{"ok":true}`
- Formulaire de contact → message visible dans `/admin/`
- `/admin/` : connexion, galerie (le premier passage initialise la galerie avec celle du site)

## Hébergements compatibles

Tout serveur où l'on peut lancer Node.js en continu : VPS (Hostinger VPS, OVH, Scaleway, DigitalOcean…), hébergements
« Node.js app » (Hostinger Business/Cloud, o2switch, Plesk/cPanel avec Node). Sur un hébergement mutualisé **sans** Node,
seul le site statique (`frontend/dist`) fonctionne : pas d'admin ni d'enregistrement des messages.

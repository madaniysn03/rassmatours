# Rassma Tours

> Site d'une agence de visites privées à Tanger : site statique prérendu (rapide, prêt pour le référencement) et petite API Node.js pour le formulaire de contact et l'administration.

![Stack](https://img.shields.io/badge/stack-Vite%208%20%C2%B7%20React%2019%20%C2%B7%20TypeScript%20%C2%B7%20Tailwind%204%20%C2%B7%20Hono-15243A)
![Node](https://img.shields.io/badge/node-%3E%3D%2020.19%20(22%20LTS)-339933)

## Description

Rassma Tours propose des visites privées et des excursions à la journée au départ de Tanger (médina et Kasbah, Cap Spartel et grottes d'Hercule, tour gastronomique, Asilah, Chefchaouen).

Le projet a deux parties, chacune dans son dossier :

| Dossier | Rôle | Technologies |
|---|---|---|
| [`frontend/`](frontend/) | Le site. Chaque page est générée en HTML complet au build (métadonnées, données structurées, sitemap, redirections), puis React prend le relais dans le navigateur. | Vite 8, React 19, React Router 7, Tailwind 4, TypeScript |
| [`backend-api/`](backend-api/) | L'API : formulaire de contact, espace `/admin/` (messages, galerie de la page Tours). Stockage en fichiers, sans base de données. Peut aussi servir le site. | Node.js 22, Hono, TypeScript |

## Prérequis

- **Node.js 20.19 ou plus récent** (22 LTS recommandé) et npm.
- Optionnel, pour les scripts d'images et de polices : Python 3 (Pillow), ffmpeg avec libwebp.

## Installation

```bash
git clone git@github.com:madaniysn03/rassmatours.git && cd rassmatours
bash setup.sh        # vérifie Node, crée frontend/.env et backend-api/.env, installe les dépendances
```

Les deux dossiers sont des *workspaces* npm : un seul `npm install` à la racine installe tout.

## Lancer le projet

```bash
npm run dev          # API sur http://localhost:3001 + site sur http://localhost:5173 (/api relayé vers l'API)
```

Ou séparément : `npm run dev:api` et `npm run dev:web`. Depuis l'application Claude, `.claude/launch.json` fournit `rassmatours-api`, `rassmatours-dev` et `rassmatours-prod` (build servi par l'API sur le port 3002).

Production en local, identique au serveur :

```bash
npm run build                                            # frontend/dist + backend-api/dist
cd backend-api && FRONTEND_DIR=../frontend/dist npm start # site + API sur http://localhost:3001
```

| Commande (racine) | Rôle |
|---|---|
| `npm run dev` | Développement (API + site) |
| `npm run build` | Build du site (types, client, SSR, prérendu) puis de l'API |
| `npm start` | Lance l'API compilée (`backend-api/dist/server.js`) |
| `npm run check` | Types de l'API, lint du site, build + audit SEO, tests de l'API |

| Commande (dans `frontend/`) | Rôle |
|---|---|
| `npm test` | Build puis audit SEO du HTML généré |
| `npm run seo` | Audit SEO + vérification des mots-clés (après un build ; régénère `docs/seo-keyword-map.md`) |
| `npm run preview` | Sert `dist/` seul sur le port 5175 (sans API) |
| `bash scripts/image-variants.sh` | Variantes 600/900/1400 px et WebP des images |

## Configuration

**`frontend/.env`** (lu au build, public, aucun secret) :

```bash
VITE_SITE_URL=https://rassmatours.com   # Obligatoire en production : canonical, sitemap, Open Graph.
VITE_INQUIRY_ENDPOINT=                  # Vide : le formulaire envoie à /api/inquiry (backend-api).
VITE_GA4_ID=                            # Google Analytics 4 (G-XXXXXXX). Vide : aucune mesure.
VITE_NOINDEX=                           # true sur un serveur de test : noindex partout, robots.txt bloquant.
```

**`backend-api/.env`** (lu au démarrage, **secret**, jamais versionné) : `PORT`, `HOST`, `ADMIN_PASSWORD`,
`ADMIN_SESSION_SECRET`, `DATA_DIR`, `FRONTEND_DIR`, `TRUST_PROXY`, `INQUIRY_RATE_LIMIT`. Détail dans
[`backend-api/.env.example`](backend-api/.env.example). Sans `ADMIN_PASSWORD`, le mot de passe de test `admin1234`
est actif (message d'avertissement au démarrage) : à remplacer avant de donner l'accès.

## Déployer

Voir **[docs/deploy.md](docs/deploy.md)** : serveur Node (VPS ou hébergement Node.js), nginx, HTTPS, systemd, mises à jour.
L'administration est décrite dans [docs/admin.md](docs/admin.md).

## Modifier le contenu

Le contenu du site vit dans `frontend/src/data/` ; les pages se mettent à jour automatiquement (cartes, menus, sitemap, prérendu).

| Besoin | Fichier |
|---|---|
| Nom, signature, logo, téléphone, WhatsApp, e-mail, horaires, réseaux, navigation | `frontend/src/data/site.ts` |
| Tours : textes, durées, highlights, déroulé, inclus, FAQ, images, SEO | `frontend/src/data/tours.ts` |
| Destinations | `frontend/src/data/destinations.ts` |
| Excursions depuis l'Espagne, guide ferry | `frontend/src/data/spain.ts` |
| Témoignages, FAQ générale | `frontend/src/data/testimonials.ts`, `frontend/src/data/faq.ts` |
| Images : chemins, textes alternatifs, crédits | `frontend/src/data/images.ts` + `frontend/public/images/` |
| Galerie de la page Tours (par défaut) | `frontend/src/data/gallery.ts` ; ensuite depuis `/admin/` |
| Couleurs, typographies, animations | `frontend/src/styles/index.css`, `frontend/src/styles/fonts.css` |
| Routes, sitemap, redirections | `frontend/src/routes.ts` |
| Métadonnées d'une page | `useHead(...)` dans `frontend/src/pages/<Page>.tsx` |

Logo : `frontend/public/images/brand/logo-*` (composant `frontend/src/components/Wordmark.tsx`), favicons dans `frontend/public/`.

Remplacer une image : déposer le JPEG maître (1800 × 1200 en paysage, 1200 × 1500 en portrait) dans
`frontend/public/images/<dossier>/`, lancer `bash scripts/image-variants.sh` depuis `frontend/`, déclarer l'image dans
`frontend/src/data/images.ts`.

## Structure du projet

```
rassmatours/
├── package.json             # Workspaces npm + scripts globaux (dev, build, start, check)
├── setup.sh                 # Installation (Node, .env, dépendances) ; --build pour la production
├── frontend/
│   ├── .env.example         # Variables publiques du build (VITE_*)
│   ├── index.html           # Gabarit rempli au prérendu
│   ├── vite.config.ts       # Build ; en dev, /api relayé vers backend-api
│   ├── public/              # Polices, images, vidéos, favicons, _headers
│   ├── scripts/             # prerender, audit SEO, mots-clés, serveur d'aperçu, outils images/polices
│   └── src/
│       ├── pages/           # Home, Tours, TourDetail, Destinations, About, FAQ, Contact, Admin…
│       ├── components/      # Header, Footer, Wordmark, TourCard, GalleryMarquee, InquiryForm…
│       ├── data/            # Contenu du site
│       ├── lib/             # head (SEO), inquiry, admin-api, gallery-manifest, analytics
│       └── styles/
├── backend-api/
│   ├── .env.example         # Variables secrètes du serveur
│   ├── src/
│   │   ├── server.ts        # Démarrage (API + site optionnel)
│   │   ├── config.ts        # Lecture de .env
│   │   ├── auth.ts          # Session admin (cookie signé), protection CSRF
│   │   ├── storage.ts       # Stockage fichiers : messages, galerie, photos
│   │   ├── static.ts        # Service du site construit (redirections, 404, en-têtes, gzip, vidéo)
│   │   └── routes/          # public.ts (/api/inquiry, /api/gallery…) et admin.ts (/api/admin/*)
│   ├── test/                # Tests de l'API (node --test)
│   └── data/                # Données (créé au démarrage, non versionné)
├── docs/                    # Déploiement, admin, SEO, marque
└── research/                # Audit initial, direction créative, validation client, images, tests
```

## API

| Route | Accès | Rôle |
|---|---|---|
| `POST /api/inquiry` | public | Demande du formulaire (limite par IP, champ piège anti-robots) |
| `GET /api/gallery` · `GET /api/gallery-image/:key` | public | Galerie de la page Tours, photos envoyées depuis l'admin |
| `GET /api/health` | public | Vérification du serveur |
| `/api/admin/session` · `login` · `logout` | public | Connexion à l'admin |
| `/api/admin/messages[/:id]` | admin | Lire, marquer lu, supprimer |
| `/api/admin/gallery[/:id]` · `/api/admin/gallery/init` | admin | Ajouter, modifier, réordonner, supprimer des photos |

## Choix importants

- **Aucune donnée inventée** : prix, avis et distinctions non vérifiés ne sont pas affichés (`research/CLIENT_VALIDATION.md`).
- **Performance** : WebP avec repli JPEG, dimensions explicites, hero préchargé, polices auto-hébergées, vidéos chargées à l'approche.
- **SEO** : un H1 par page, métadonnées uniques, canonical, Open Graph, JSON-LD, sitemap, redirections 301, `noindex` de test.
- **Vie privée** : aucun cookie ni script tiers par défaut côté visiteurs ; GA4 uniquement après consentement. Les messages
  du formulaire (données personnelles) sont stockés dans `backend-api/data/`.

## Documentation

- [docs/deploy.md](docs/deploy.md) — mise en production sur un serveur.
- [docs/admin.md](docs/admin.md) — espace d'administration.
- `docs/seo-*.md` — audit, keyword map, plan de contenu, redirections, checklist de lancement.
- `research/` — audit initial, direction créative, validation client, catalogue d'images, rapports de tests.

## Licence

Aucune licence n'est définie : le code et les textes appartiennent à Rassma Tours. Les polices sont sous licence SIL Open Font
License ; les photos temporaires sous licence Unsplash et les photos du client lui appartiennent (`research/image-sources.csv`).

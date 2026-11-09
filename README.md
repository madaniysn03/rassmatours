# Rassma Tours

> Site vitrine premium d'une agence de visites privées à Tanger : statique, rapide, prêt pour le référencement, sans backend.

![Stack](https://img.shields.io/badge/stack-Vite%208%20%C2%B7%20React%2019%20%C2%B7%20TypeScript%20%C2%B7%20Tailwind%204-15243A)
![Node](https://img.shields.io/badge/node-%3E%3D%2020-339933)
![Rendu](https://img.shields.io/badge/rendu-statique%20pr%C3%A9rendu-B4955B)

## Description

Rassma Tours propose des visites privées et des excursions à la journée au départ de Tanger (médina et Kasbah, Cap Spartel et grottes d'Hercule, tour gastronomique, Asilah, Chefchaouen). Ce site remplace le site existant tangierbyguide.com avec une identité éditoriale premium et chaleureuse, tout en conservant l'offre réelle de l'agence.

Le projet est un site **statique prérendu** : chaque page est générée en HTML complet au build (titres, métadonnées, données structurées, sitemap, redirections), puis hydratée côté client pour la navigation. Il se déploie sur n'importe quel hébergeur statique et ne demande aucun serveur ni base de données. Les demandes des visiteurs partent par WhatsApp, e-mail ou un point de terminaison HTTP optionnel.

Public visé : l'agence (mise à jour des contenus dans `src/data/`), le développeur qui déploie et fait évoluer le site, et le référenceur qui suit `docs/`.

## Aperçu

| Accueil (bureau) | Fiche tour (mobile) |
|---|---|
| Hero plein écran sur la baie de Tanger, titre serif, deux appels à l'action | Visuel, récit, déroulé, encadré de demande collant, FAQ |

Pour voir le site : `npm run dev` puis http://localhost:5173.

## Prérequis

- **Node.js 20 ou plus récent** (testé avec Node 24) et npm.
- Optionnel, pour les scripts d'images et de polices uniquement : Python 3 et ffmpeg (avec libwebp).

## Installation

Emplacement local du projet : `C:\Users\melko\Developer\rassmatours` (dossier indépendant, sans lien avec les autres projets de `Developer/`). Aucun dépôt Git n'est encore initialisé.

```bash
cd C:\Users\melko\Developer\rassmatours
npm install
```

Depuis un dépôt distant, une fois créé :

```bash
git clone <url-du-depot> rassmatours
cd rassmatours
npm install
```

Ou, en une commande (vérifie Node, crée `.env`, installe les dépendances) :

```bash
bash setup.sh
```

## Lancer le projet

Serveur de développement avec rechargement à chaud :

```bash
npm run dev
```

Ouvrir http://localhost:5173. Depuis l'application Claude, `.claude/launch.json` fournit deux configurations : `rassmatours-dev` (port 5173) et `rassmatours-preview` (port 5175, build statique).

Build de production puis aperçu identique à un hébergeur (slash final, redirections 301, 404 réel, gzip) :

```bash
npm run build
npm run preview
```

Ouvrir http://localhost:5175.

| Commande | Rôle |
|---|---|
| `npm run dev` | Développement |
| `npm run build` | Types (`tsc -b`), build client, build SSR, prérendu dans `dist/` (+ `sitemap.xml`, `robots.txt`, `404.html`, `_redirects`) |
| `npm run preview` | Sert `dist/` sur le port 5175 (slash final, 301, 404 réel, gzip, requêtes `Range` pour la vidéo) |
| `npm run lint` | oxlint |
| `npm test` | Build puis audit SEO du HTML généré |
| `node scripts/seo-audit.mjs` | Audit seul (après un build) : titres, descriptions, canonical, robots, H1, alt, dimensions, liens internes, JSON-LD, sitemap |
| `node scripts/seo-keywords-check.mjs` | Vérifie les mots-clés de `scripts/seo-keywords.json` dans le HTML généré et régénère la table de `docs/seo-keyword-map.md` |
| `bash setup.sh --build` | Installation + build + audit SEO |
| `bash scripts/image-variants.sh` | Génère les variantes 600/900/1400 px et les WebP des images |
| `python scripts/image-catalog.py` | Régénère `research/image-sources.csv` |
| `python scripts/fetch-fonts.py` | Retélécharge les polices auto-hébergées |

## Configuration

Copier `.env.example` en `.env` (fait automatiquement par `setup.sh`). Les variables sont lues au build ; aucune n'est un secret.

```bash
# .env
VITE_SITE_URL=https://www.exemple.com   # URL publique sans slash final : canonical, sitemap, Open Graph. Obligatoire en production.
VITE_INQUIRY_ENDPOINT=                  # URL acceptant un POST JSON (Formspree, Basin, fonction serverless…). Vide : WhatsApp / e-mail.
VITE_GA4_ID=                            # Google Analytics 4 (G-XXXXXXX). Vide : aucune mesure, aucun bandeau de consentement.
VITE_NOINDEX=                           # true sur un environnement de recette : noindex partout, robots.txt bloquant.
```

Le build **échoue** si `VITE_SITE_URL` manque ou n'est pas une origine `https://` sans chemin, sauf en recette (`VITE_NOINDEX=true`), où il continue avec le placeholder `https://rassmatours.com` (domaine non confirmé). Les variables sont lues telles que Vite les résout (`.env`, `.env.production` ou shell), de sorte que pages, `robots.txt` et sitemap concordent.

## Utilisation

### Modifier le contenu

Tout le contenu éditable vit dans `src/data/` ; les pages se mettent à jour automatiquement (cartes, menus, sitemap, prérendu).

| Besoin | Fichier |
|---|---|
| Nom, signature, logo, téléphone, WhatsApp, e-mail, horaires, point de rendez-vous, réseaux, fiche Google, navigation | `src/data/site.ts` |
| Tours : textes, durées, highlights, déroulé, inclus, FAQ, images, titre et description SEO | `src/data/tours.ts` |
| Destinations : textes, lieux, infos pratiques, FAQ, SEO | `src/data/destinations.ts` |
| Excursions depuis l'Espagne : villes de départ, logistique, durées, FAQ, guide ferry | `src/data/spain.ts` |
| Témoignages (tableau vide = emplacement neutre), FAQ générale | `src/data/testimonials.ts`, `src/data/faq.ts` |
| Images : chemins, textes alternatifs, crédits | `src/data/images.ts` + `public/images/` |
| Couleurs, typographies, animations | `src/styles/index.css` (bloc `@theme`), `src/styles/fonts.css` |
| Routes, sitemap, redirections | `src/routes.ts` |
| Métadonnées d'une page | l'appel `useHead(...)` dans `src/pages/<Page>.tsx` |

Ajouter un tour : une entrée de plus dans `tours` avec un `slug` unique. Logo : symbole et fichiers dans `public/images/brand/`, régénérés par `python3 scripts/generate-logo.py` (prérequis : `pip install fonttools brotli uharfbuzz`) ; planche de présentation dans `docs/brand/logo-presentation.html`. Pour utiliser un autre fichier, renseigner `brand.logo` dans `src/data/site.ts`.

### Remplacer les images

1. Déposer le JPEG maître (1800 × 1200 px en paysage, 1200 × 1500 px en portrait) dans `public/images/<dossier>/` avec un nom descriptif.
2. Lancer `bash scripts/image-variants.sh` pour générer les variantes et les WebP.
3. Déclarer l'image dans `src/data/images.ts` (texte alternatif, crédit).

Les images actuelles sont des remplacements temporaires sous licence Unsplash (`research/image-catalog.md`).

### Brancher l'envoi du formulaire

Sans `VITE_INQUIRY_ENDPOINT`, le formulaire prépare la demande et le visiteur l'envoie en un clic via WhatsApp ou e-mail (fonctionnel). Avec un point de terminaison, le site envoie un `POST` JSON contenant chaque champ plus `formatted` (message prêt à lire) et `source`.

### Déployer

1. Définir `VITE_SITE_URL` (et éventuellement `VITE_GA4_ID`, `VITE_INQUIRY_ENDPOINT`), laisser `VITE_NOINDEX` vide.
2. `npm run build` puis `node scripts/seo-audit.mjs` (zéro problème attendu).
3. Publier le dossier `dist/`. Netlify et Cloudflare Pages lisent `_redirects` et `_headers` ; Vercel lit `vercel.json` ; nginx et Apache : voir `docs/seo-url-redirects.md`.
4. Suivre `docs/seo-launch-checklist.md` (Search Console, sitemap, GA4, fiche Google).

## Tests

Il n'y a pas de suite de tests unitaires. La commande de vérification construit le site puis audite le HTML généré (code de sortie 1 en cas de problème) :

```bash
npm test
```

Les vérifications complètes exécutées à chaque livraison :

```bash
npx tsc -b                     # types
npm run lint                   # oxlint
npm test                       # build + prérendu + audit SEO
```

Le détail des tests manuels (navigateur, mobile, formulaire, redirections, Lighthouse) est dans `research/TEST_REPORT.md` et `docs/seo-implementation-report.md`.

## Structure du projet

```
rassmatours/
├── index.html                 # Gabarit : préchargement des polices, <!--app-head--> et <!--app-html--> remplis au prérendu
├── setup.sh                   # Installation et premier lancement
├── vercel.json                # Slash final, redirections, en-têtes de cache (Vercel)
├── public/
│   ├── _headers               # En-têtes de cache (Netlify, Cloudflare Pages)
│   ├── fonts/                 # Polices auto-hébergées (woff2, licence OFL)
│   └── images/                # JPEG et WebP en 600 / 900 / 1400 px et maître
├── scripts/
│   ├── prerender.mjs          # Génère un index.html par route, sitemap, robots, 404, _redirects
│   ├── serve.mjs              # Serveur statique de vérification (npm run preview)
│   ├── seo-audit.mjs          # Audit SEO du build
│   ├── seo-keywords.json      # Mots-clés par page (source unique)
│   ├── seo-keywords-check.mjs # Vérifie les mots-clés dans dist/ et met à jour la keyword map
│   ├── image-variants.sh      # Variantes responsives et WebP
│   ├── generate-logo.py       # Logo, symbole et favicon en SVG vectoriel
│   ├── image-catalog.py       # CSV de provenance des images
│   └── fetch-fonts.py         # Téléchargement des polices
├── src/
│   ├── App.tsx                # Routes (dont redirections des anciennes URL)
│   ├── routes.ts              # Liste des routes prérendues, indexabilité, redirections
│   ├── main.tsx               # Entrée client (hydratation)
│   ├── entry-server.tsx       # Entrée du prérendu
│   ├── components/            # Header, Footer, PageHero, TourCard, DestinationTile, InquiryForm, Faq, SmartImage, ConsentBanner…
│   ├── pages/                 # Home, Tours, TourDetail, Destinations, DestinationDetail, About, Contact, Privacy, NotFound
│   ├── data/                  # site, tours, destinations, testimonials, faq, images
│   ├── lib/                   # head (métadonnées et JSON-LD), analytics, images, contact-links, inquiry
│   └── styles/                # index.css (jetons Tailwind), fonts.css
├── docs/                      # SEO : audit, keyword map, content plan, URL/redirects, launch checklist, implementation report, rapports Lighthouse
└── research/                  # Audit initial, direction créative, validation client, catalogue d'images, bilan des tests
```

## Pages

| URL | Page |
|---|---|
| `/` | Accueil |
| `/tours/`, `/tours/<slug>/` | Liste des tours (filtre Tanger / excursions) et fiches |
| `/destinations/`, `/destinations/<slug>/` | Index et pages destinations (Tanger, Asilah, Chefchaouen) |
| `/day-trips-from-spain/`, `/day-trips-from-spain/<slug>/` | Guide des excursions depuis l'Espagne et pages Tarifa / Algeciras | `src/pages/SpainDayTrips.tsx`, `SpainCity.tsx` |
| `/tangier-ferry-guide/` | Guide pratique du ferry | `src/pages/FerryGuide.tsx` |
| `/about/`, `/contact/` | À propos, Plan your trip (formulaire, pré-sélection via `?tour=`) |
| `/privacy/` | Confidentialité (`noindex`) |
| `/experiences/*` | Anciennes URL, redirigées en 301 vers `/tours/…` |

## Choix importants

- **Aucune donnée inventée** : prix, inclusions, avis et distinctions non vérifiés ne sont pas affichés. Les points à faire confirmer par le client sont listés dans `research/CLIENT_VALIDATION.md`.
- **Pas de faux moteur de réservation** : le parcours est une demande, connectable plus tard à un service d'envoi ou une plateforme.
- **Performance** : WebP avec repli JPEG, dimensions explicites, hero préchargé, polices auto-hébergées, animations CSS neutralisées par `prefers-reduced-motion`.
- **Video pilotee par le defilement** (`src/components/ScrollVideo.tsx`, survol de la medina de Tanger sur l'accueil) : chargee uniquement a l'approche de la section, affiche statique en repli, legendes par etape ; fichiers dans `public/video/`, provenance dans `research/image-catalog.md` section 2 bis.
- **SEO** : un H1 par page, métadonnées uniques, canonical, Open Graph, JSON-LD limité aux données vérifiées, sitemap, redirections 301, `noindex` de recette.
- **Vie privée** : aucun cookie ni script tiers par défaut ; GA4 uniquement après consentement.

## Documentation

- `docs/seo-implementation-report.md` — audit, modifications, résultats de tests, limites, configuration externe.
- `docs/seo-keyword-map.md`, `docs/seo-content-plan.md`, `docs/seo-url-redirects.md`, `docs/seo-launch-checklist.md`.
- `research/RESEARCH_REPORT.md`, `research/DESIGN_DIRECTION.md`, `research/CLIENT_VALIDATION.md`, `research/image-catalog.md`, `research/TEST_REPORT.md`.

## Contribuer

1. Créer une branche (`git checkout -b feat/ma-fonctionnalite`).
2. Modifier, puis vérifier : `npx tsc -b && npm run lint && npm run build && node scripts/seo-audit.mjs`.
3. Commit en Conventional Commits avec description en français (`feat: ajoute la page Tétouan`).
4. Ouvrir une pull request courte et ciblée.

## Licence

Aucune licence n'est définie : le code et les textes appartiennent à Rassma Tours. Les polices sont sous licence SIL Open Font License et les photos temporaires sous licence Unsplash (voir `research/image-catalog.md`).

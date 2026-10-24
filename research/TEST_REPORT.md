# Bilan des tests — site Rassma Tours

Date : 20 octobre 2026. Environnement : Windows 11, Node 24.14, npm 11.11, navigateur intégré Chromium du poste de travail (émulation de viewport 1280 × 800 et 375 × 812).

Règle appliquée : un test n'est déclaré réussi que s'il a été exécuté. Les points non couverts sont listés en §3.

## 1. Tests exécutés

| # | Test | Méthode | Résultat |
|---|---|---|---|
| 1 | Installation | `npm install` (React 19.3, React Router 7.18, Vite 8.3, Tailwind 4.3, TypeScript 6.0, oxlint 1.88) | OK, 0 vulnérabilité |
| 2 | Types | `tsc -b` | OK, 0 erreur |
| 3 | Lint | `npm run lint` (oxlint, plugins react/typescript/oxc) | OK, 0 avertissement après correction (setState dans un effet du Header, `Date` impur dans le Footer, mutation de contexte dans `head`) |
| 4 | Build + prérendu | `npm run build` | OK : 11 pages prérendues + `404.html`, `sitemap.xml` (11 URL), `robots.txt`. CSS 48 kB (8,8 kB gzip), JS 358 kB (109 kB gzip) |
| 5 | Métadonnées prérendues | Lecture de `dist/experiences/chefchaouen-day-trip/index.html` | OK : `<title>`, description, canonical, Open Graph, JSON-LD `BreadcrumbList` présents dans le HTML statique |
| 6 | Hydratation en production | Serveur statique (`npm run preview`), onglet neuf, pages `/about` puis `/experiences/chefchaouen-day-trip` | OK : **aucun message console**, navigation interne sans rechargement, JSON-LD présent, 0 image cassée. **Défaut trouvé et corrigé** : `vite preview` servait la page d'accueil pour `/about` (erreur React #418 à l'hydratation) ; remplacé par `scripts/serve.mjs` qui sert `about/index.html` et `404.html` comme un hébergeur statique (`/about` → 200 avec le bon titre, `/nope` → 404) |
| 7 | Développement | `npm run dev` sur 5174 | OK. **Défaut trouvé et corrigé** : `hasChildNodes()` prenait le commentaire `<!--app-html-->` pour du contenu et tentait une hydratation à vide ; remplacé par `firstElementChild` |
| 8 | Accueil, bureau (1280 px) | Captures d'écran section par section | OK : hero plein écran, introduction, 3 cartes, « The Rassma way », Discover Tangier, 3 tuiles destinations, sur-mesure, témoignages, bandeau final, pied de page avec bandeau défilant. **Défaut trouvé et corrigé** : `SmartImage` imposait `relative` et l'image de hero restait dans le flux ; ajout d'une prop `fill` |
| 9 | Page Expériences + filtres | Clic « Day trips », lecture de `aria-pressed`, comptage des cartes, zone `aria-live` | OK : 2 cartes, états pressés corrects, annonce « 2 experiences shown » |
| 10 | Fiche expérience (bureau) | `/experiences/tangier-highlights` : captures, titre, canonical, og:image, lien de demande, lien WhatsApp | OK : encadré collant, lien `/contact?tour=…` encodé, `wa.me/212658313411` |
| 11 | Formulaire : validation | Soumission vide puis remplie (Contact, pré-sélection `?tour=Tangier Food Tour`) | OK : 2 erreurs affichées et reliées aux champs (`aria-invalid`, focus sur le premier champ en erreur) ; formulaire rempli → état « ready » avec message complet, lien WhatsApp pré-rempli et `mailto:` avec sujet et corps |
| 12 | Mobile (375 × 812) : accueil | Capture, mesure de `scrollWidth` | OK : hero portrait, aucun débordement horizontal ; variante 900 px servie via `srcset` |
| 13 | Menu mobile | Clic sur « Open menu » puis sur « Experiences » dans le panneau | OK : `aria-expanded=true`, panneau visible, défilement bloqué, focus sur le premier lien ; après clic : panneau fermé, défilement rétabli, route `/experiences`, page remontée en haut |
| 14 | Mobile : fiche, destinations | Captures `/experiences/tangier-walking-tour`, `/destinations` ; `scrollWidth` | OK, aucun débordement |
| 15 | Page 404 | `/this-does-not-exist` (dev) et `/nope` (statique) | OK : titre « Page not found », `robots: noindex`, statut 404 en statique |
| 16 | Images | Téléchargement des 51 fichiers maîtres + 51 variantes 900 px, `ffprobe` sur chaque fichier, contrôle visuel sur 5 planches-contacts | OK ; 17 candidats écartés au contrôle (lieux non identifiables, villes sans rapport) |
| 17 | Liens internes | Toutes les routes du site sont générées depuis `src/data/` et `src/routes.ts` ; prérendu réussi pour chacune | OK (une route manquante ferait échouer le prérendu) |

## 2. Accessibilité (vérifications manuelles)

- Lien d'évitement, `<main id="content">`, titres hiérarchisés (un `h1` par page), `nav` nommées, `aria-current` sur le fil d'Ariane.
- Menu mobile : `role="dialog"`, `aria-modal`, Échap ferme et rend le focus au bouton.
- Accordéon FAQ en `details`/`summary` natif (clavier et lecteurs d'écran sans script).
- Formulaire : `label` reliés, `aria-invalid`, messages d'erreur via `aria-describedby`, confirmation en `role="status"`.
- Animations neutralisées par `prefers-reduced-motion`.
- Contrastes : texte `ink` sur ivoire et `ivory` sur bleu nuit largement au-dessus de 4,5:1 ; le laiton (`#B4955B`) n'est utilisé que pour des étiquettes de 11 px en capitales (contraste ≈ 2,9:1 sur ivoire : **à surveiller**, voir §3).

## 2 bis. Tests de l'implémentation SEO (20/10/2026, après-midi)

Détail complet dans `docs/seo-implementation-report.md`.

| # | Test | Méthode | Résultat |
|---|---|---|---|
| 18 | Types, lint, build | `tsc -b`, `oxlint`, `npm run build` | OK, 0 erreur, 0 avertissement ; 14 pages prérendues + 404, sitemap 13 URL, robots, `_redirects` |
| 19 | Audit SEO du build | `node scripts/seo-audit.mjs` | OK : 15 fichiers, 485 liens internes (0 cassé, tous avec slash final), 102 images (0 sans alt, 0 sans dimensions), titres et descriptions uniques et dans les limites, 1 H1 par page, JSON-LD valide, canonical = route, `/privacy/` noindex hors sitemap |
| 20 | Redirections et statuts | `curl` sur le serveur statique | `/about` → 301 `/about/` ; `/experiences*` → 301 `/tours/…` ; ancien slug → 301 ; `/nope` → 404 ; sitemap et robots 200 |
| 21 | Hydratation production | Onglet neuf, pages `/`, `/destinations/tangier/`, `/tours/tangier-walking-tour/`, navigation interne vers `/tours/` | OK : aucun message console, canonical / titre / JSON-LD mis à jour à la navigation |
| 22 | Images | Build : `<picture>` WebP + repli JPEG, `srcset` 900/1800, préchargement du hero (`imagesrcset`, variante portrait sur l'accueil) | OK, vérifié dans le HTML généré et dans le navigateur (`currentSrc` en `.webp`) |
| 23 | Polices | Auto-hébergées, 18 fichiers woff2 (latin + latin-ext), 2 préchargés | OK : `document.fonts` chargées depuis `/fonts/` |
| 27 | Pages « depuis l'Espagne » (22/10/2026) | Build, `seo-audit.mjs`, `seo-keywords-check.mjs`, `curl` des nouvelles routes, navigateur | OK : 18 pages prérendues, sitemap 17 URL, 0 problème d'audit, mot-clé principal présent sur 17/17 pages ; routes `/day-trips-from-spain/`, `/tarifa/`, `/algeciras/`, `/tangier-ferry-guide/` en 200, `/day-trips-from-spain/marbella/` en 404 (section du guide, pas une page) |
| 26 | Vidéo pilotée par le défilement (accueil) | Navigateur intégré (requêtes réseau, légendes, captures) puis Chrome headless piloté par le protocole DevTools (page visible, `requestAnimationFrame` actif) : défilement à 10 / 40 / 70 / 95 % de la section et lecture de `currentTime` | OK : la vidéo n'est demandée qu'à l'approche de la section (seule l'affiche est chargée avant) ; variante 768 px servie sous 768 px de large ; légendes 1 → 2 → 3 ; tête de lecture à 0,84 s, 3,37 s, 5,91 s puis 8,02 s sur 8,5 s. **Défaut trouvé et corrigé** : le serveur d'aperçu ne gérait pas les requêtes `Range`, ce qui rendait la vidéo non « seekable » (plage 0–0) ; `scripts/serve.mjs` répond désormais en 206. Les hébergeurs statiques et le serveur Vite gèrent les `Range` nativement. Lighthouse mobile de l'accueil inchangé après ajout (performance 84, LCP 3,9 s) : aucune requête média pendant l'audit, l'affiche est une image paresseuse de 60 Ko. Non testé : Safari iOS |
| 25 | Mots-clés SEO dans le HTML généré | `node scripts/seo-keywords-check.mjs` | OK : 13/13 pages indexables avec le mot-clé principal dans le titre, la description, le H1 et le corps ; 64/65 mots-clés secondaires présents |
| 24 | Lighthouse 12.8 (laboratoire, serveur statique gzip) | Chrome headless, 4 pages | Bureau accueil : performance 100, accessibilité 100, bonnes pratiques 100, SEO 100, LCP 0,5 s. Mobile (4G simulée) : performance 84–86, LCP 3,6–3,9 s, CLS ≤ 0,003, TBT 0 ms ; accessibilité / bonnes pratiques / SEO 100 partout. Aucune donnée terrain (site non publié). Rapports : `docs/lighthouse/` |

## 3. Non couvert ou limites connues

- Pas de test automatisé (unitaire ou e2e) : la vérification est manuelle.
- Pas d'audit Lighthouse exécuté. Le bundle JS (109 kB gzip) inclut React + React Router ; les images maîtres font 18,7 Mo au total mais sont chargées en `lazy` et via `srcset`. Pour aller plus loin : conversion WebP/AVIF, polices auto-hébergées.
- `animation-timeline: view()` : non pris en charge par Firefox stable à ce jour (le contenu s'affiche alors sans animation, ce qui est le comportement voulu).
- Contraste des accroches en laiton sur fond ivoire sous le seuil AA pour du texte normal : accepté comme élément décoratif accompagné d'un titre, à foncer (`#8E7440`) si le client exige AA strict.
- Vérifié uniquement dans Chromium ; Safari et Firefox non testés.
- Formulaire : l'envoi HTTP (`VITE_INQUIRY_ENDPOINT`) n'a pas été testé faute de service ; le chemin WhatsApp / e-mail l'a été.
- Les liens externes (WhatsApp, TripAdvisor, `mailto:`) ont été vérifiés dans leur forme, pas ouverts.

# Direction créative — Rassma Tours

Date : 20 octobre 2026. Document de référence pour la cohérence visuelle du site.

## 1. Positionnement

**Rassma Tours — Discover Tangier, Personally.**

Trois qualités à faire ressentir dès le premier écran :

| Qualité | Traduction dans le design |
|---|---|
| Luxe discret | Grandes photographies, typographie serif éditoriale, beaucoup d'air, palette sobre, aucun doré ni ornement. |
| Chaleur humaine | Ton rédactionnel à la première personne du pluriel, photos de lieux vécus (cafés, marchés, ruelles) plutôt que de vues « carte postale », pastilles WhatsApp et formulaire sans friction. |
| Authenticité | Lieux nommés précisément (Petit Socco, Cinéma Rif, Café Baba, Cap Spartel…), faits publics vérifiables, aucune promesse non sourcée. |

Le site doit se lire comme un **concierge de voyage boutique**, pas comme un moteur de réservation. Référence structurelle : Garmany Golf (hero plein écran avec titre serif + accroche en capitales espacées, bandeau « différence », piliers, tuiles destinations, témoignages, bandeau défilant en pied de page). Référence de contenu : Tangier By Guide (offre réelle). Référence narrative : Tangier Private Tours (cartes « highlights », encadré de réservation, « keep exploring »).

## 2. Palette

| Jeton | Hex | Usage |
|---|---|---|
| `ivory` | `#F7F3EB` | Fond principal |
| `sand` / `sand-deep` | `#EEE6D6` / `#E2D6BF` | Fonds secondaires, repli d'image |
| `line` | `#DCCFB8` | Filets, bordures |
| `paper` | `#FFFDF9` | Cartes, sections alternées |
| `midnight` / `midnight-deep` | `#15243A` / `#0D1727` | Sections sombres, pied de page, boutons principaux, dégradés sur photos |
| `clay` / `clay-deep` | `#B5603C` / `#94492B` | Accent d'action (CTA « Request a custom tour »), erreurs de formulaire |
| `brass` | `#B4955B` | Accroches en capitales, filets, icônes, numéros — toujours en petite surface |
| `ink` / `ink-soft` / `ink-mute` | `#1B1A17` / `#514E47` / `#87827A` | Texte |

Règle : jamais plus d'une couleur d'accent par bloc ; le laiton ne sert qu'aux détails (jamais en fond ni en gros titre).

## 3. Typographie

- **Titres** : Cormorant Garamond 500 (italique 400 pour le mot mis en valeur : *personally*, *home*, *Europe*…). Tailles `display-xl` (hero accueil, jusqu'à 92 px) → `display-sm`.
- **Texte et étiquettes** : Jost 300/400/500. Les accroches (« eyebrow »), la navigation et les boutons sont en capitales, graisse 500, interlettrage 0,16–0,26 em, 11–13 px.
- **Paragraphes éditoriaux** : 17 px, graisse 300, interligne 1,75, largeur maximale ~65 caractères.

## 4. Composition et espacement

- Conteneur `wrap` : 1280 px max, marges 20/32/40 px. `wrap-narrow` : 768 px pour les FAQ et textes longs.
- Sections : 96 px (mobile) à 128 px (desktop) de padding vertical, alternance ivoire / papier / bleu nuit.
- Grilles 12 colonnes pour les blocs éditoriaux (texte 5–6 colonnes, image 6–7), décalages verticaux des images (ex. petite photo superposée en bas à gauche de l'introduction).
- Rayons : 16 px (`rounded-2xl`) pour les images et cartes, 24 px pour les encadrés de formulaire, boutons en pilule.
- Images : plein cadre pour les ouvertures de page (gradient bleu nuit vers le bas pour la lisibilité), 4:5 pour les cartes portrait, 3:2 / 16:10 pour les paysages.

## 5. Mouvement

- Entrées du hero au chargement (`.enter`, 0,9 s, décalées de 80 ms).
- Apparition au défilement **sans JavaScript** via `animation-timeline: view()` (`.reveal`, `.reveal-image`) ; les navigateurs sans prise en charge affichent le contenu directement.
- Zoom lent (1,04, 1,1 s) sur les images des cartes au survol.
- Bandeau défilant 70 s en pied de page, en pause au survol.
- **Vidéo pilotée par le défilement** (`ScrollVideo`, page d'accueil) : une section haute dont le cadre reste collé à l'écran ; la lecture avance avec le défilement (scrubbing lissé en `requestAnimationFrame`), trois légendes se succèdent, un filet laiton indique la progression. Vidéo muette, chargée à l'approche de la section, affiche statique en repli.
- Toutes les animations sont neutralisées par `prefers-reduced-motion: reduce` (la vidéo reste alors figée sur son affiche).

## 6. Composants

`Header` (transparent → ivoire au défilement, panneau mobile), `PageHero`, `SectionHeading`, `TourCard` (portrait / paysage), `DestinationTile`, `CtaBand`, `Testimonials`, `Faq` (details/summary natif), `InquiryForm`, `WhatsAppFab`, `Ticker`, `Footer`, `SmartImage` (srcset, repli, variante portrait), `Button` (5 variantes, 3 tailles), `Breadcrumbs`, `Wordmark`.

## 7. Identité graphique

Pas de logo officiel fourni : wordmark typographique « RASSMA / TOURS » avec un monogramme minimal (cercle sur une ligne d'horizon : le soleil sur le détroit). Favicon dérivé. À remplacer par le logo du client via `brand.logo` dans `src/data/site.ts`.

## 8. Ce qu'on évite

Doré brillant, moucharabiehs et arabesques décoratives, « ultimate luxury experience », « hidden gems », compteurs d'avis non vérifiés, faux moteur de réservation, prix non confirmés.

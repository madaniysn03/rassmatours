# Catalogue des images

Dossier : `public/images/`. Inventaire établi le **20 octobre 2026**. Liste exploitable : `image-sources.csv` (régénérable avec `python scripts/image-catalog.py`).

## 1. Principes

1. **Aucune image du site existant n'a été copiée.** Les onze visuels de tangierbyguide.com (groupes avec le guide, Cap Spartel, Chefchaouen, Asilah, cuisine) sont la propriété de l'agence ou de ses contributeurs : leurs URL sont listées en §4 pour que le client fournisse les originaux et leurs autorisations.
2. Toutes les photos du dossier sont des **remplacements temporaires** sous [licence Unsplash](https://unsplash.com/license) (usage gratuit, commercial ou non, sans attribution obligatoire ; revente non modifiée interdite). Seules des photos gratuites (`images.unsplash.com`) ont été retenues, aucune photo Unsplash+.
3. Chaque image a été **contrôlée visuellement** sur planche-contact avant sélection (sujet réel, cohérence avec le lieu). Les images dont le lieu exact n'est pas certain portent un nom générique (`white-facade-green-trim`, `square-palms`, `coast-rocks`) et ne sont utilisées que comme ambiance.
4. Formats : paysage 1800 × 1200 px, portrait 1200 × 1500 px, hero portrait 1200 × 1700 px, Open Graph 1200 × 630 px ; recadrage et compression côté Unsplash (`fit=crop&crop=entropy&q=72`). Le script `scripts/image-variants.sh` (ffmpeg) génère pour chaque maître des variantes **600, 900 et 1400 px** et une version **WebP** de chacune (qualité 78–80) ; `SmartImage` sert le WebP avec repli JPEG via `srcset`. Poids : ≈ 18,7 Mo pour les 51 maîtres JPEG ; ≈ 54 Mo pour les 382 fichiers (191 JPEG + 191 WebP), dont seule la taille adaptée à l'écran est téléchargée.
5. Le crédit (identifiant Unsplash du photographe, page `https://unsplash.com/@identifiant`) est stocké dans `src/data/images.ts` pour chaque image.

## 2. Usage par page

| Usage | Images |
|---|---|
| Hero accueil (+ portrait mobile, + Open Graph) | `hero/tangier-bay-dusk*` |
| Introduction accueil | `tangier/kasbah-over-port`, `food/mint-tea` |
| Discover Tangier | `tangier/medina-rooftops-dusk`, `tangier/cinema-rif`, `landmarks/hercules-caves-window` |
| Sur-mesure | `landmarks/camels-beach` |
| Bandeau final (toutes pages) | `tangier/marina-sunset` |
| Expériences (hero) | `tangier/grand-socco-gate` |
| Destinations (hero) | `landmarks/cap-spartel-sunset` |
| À propos | `tangier/kasbah-walls`, `tangier/kasbah-arch`, `food/tea-pastries`, `tangier/cafe-baba` |
| Contact | `landmarks/bay-from-beach` |
| 404 | `tangier/medina-lane` |
| Fiches expériences | voir `image` / `imagePortrait` / `gallery` dans `src/data/tours.ts` |
| Destinations | voir `image` / `imageSecondary` dans `src/data/destinations.ts` |

Images téléchargées mais non encore placées (réserve) : `tangier/medina-aerial`, `tangier/el-minzah`, `tangier/medina-gate-street`, `tangier/kasbah-lane-plant`, `tangier/white-facade-green-trim`, `tangier/square-palms`, `landmarks/cap-spartel-cliff`, `landmarks/hercules-caves-sea`, `landmarks/coast-rocks`, `landmarks/coast-road-dusk`, `food/spice-market`, `craft/mirrors`, `craft/pottery-shop`, `craft/carpet-shop`, `craft/souk-lane`.

## 2 bis. Vidéo (section « Tangier from above », page d'accueil)

| Fichier | Sujet | Source | Auteur | Licence | Encodage |
|---|---|---|---|---|---|
| `public/video/tangier-medina-drone-1280.mp4` (6,7 Mo) et `-768.mp4` (2,6 Mo) | Survol par drone des remparts de la Kasbah et des toits de la médina de Tanger, la caméra recule jusqu'à révéler la baie | https://www.pexels.com/video/tangier-drone-20214791/ | Muhamed Abghour (https://www.pexels.com/@muhamed-abghour-991985502/) | [Licence Pexels](https://www.pexels.com/license/) : usage gratuit, commercial ou non, sans attribution obligatoire (crédit affiché par courtoisie) | 8,5 s, H.264, 30 i/s, sans son, image clé toutes les 6 images (`keyint=6`) pour un défilement fluide, `faststart` |
| `public/images/video/tangier-medina-drone-poster.jpg` / `.webp` | Première image de la vidéo (affiche, repli sans JavaScript ou avec « réduire les animations ») | idem | idem | idem | 1280 × 720 |

Le fichier vidéo n'est demandé qu'à l'approche de la section (`IntersectionObserver`, `preload="none"` au chargement). Téléchargé le 20/10/2026 depuis le CDN Pexels (`videos.pexels.com/video-files/20214791/20214791-hd_1280_720_30fps.mp4`), puis recoupé et réencodé avec ffmpeg. À remplacer, idéalement, par un plan drone tourné pour l'agence.

## 3. Inventaire

Toutes : licence Unsplash, statut « OK — remplacement temporaire », consultées le 20/10/2026.

<!-- table générée par scripts/image-catalog.py -->
| Fichier | Sujet (texte alternatif) | Source | Auteur | Dimensions |
|---|---|---|---|---|
| `hero/tangier-bay-dusk.jpg` | Tangier bay and medina at dusk, seen from above, with the port lights along the water | https://unsplash.com/photos/atwIEcpyeSM | @raulcachophoto | 1800x1200 |
| `tangier/medina-rooftops-dusk.jpg` | Rooftops of the Tangier medina at dusk, with the bay and seafront boulevard lit below | https://unsplash.com/photos/2A8ONQWR69g | @raulcachophoto | 1800x1200 |
| `tangier/kasbah-over-port.jpg` | Whitewashed houses of the Kasbah overlooking the port of Tangier and the blue sea | https://unsplash.com/photos/sjniJT-EOiQ | @0x0red | 1200x1500 |
| `tangier/kasbah-walls.jpg` | The old walls and white houses of Tangier above the coast | https://unsplash.com/photos/QZEZcrkr0gw | @alezyra | 1800x1200 |
| `tangier/medina-aerial.jpg` | Aerial view of the white and blue houses of the old town, sloping down to the sea | https://unsplash.com/photos/NXNYSZSltck | @bilalkamal_bk | 1800x1200 |
| `tangier/alley-to-the-sea.jpg` | A silhouette walks down a shaded medina alley that opens onto the bright bay | https://unsplash.com/photos/OUbNul8HKdo | @theemanofoth | 1800x1200 |
| `tangier/cinema-rif.jpg` | The facade of the Cinema Rif on the Grand Socco, framed by palm leaves | https://unsplash.com/photos/s__jKE6v7fk | @theemanofoth | 1800x1200 |
| `tangier/el-minzah.jpg` | The white facade and lantern of the El Minzah Hotel in Tangier | https://unsplash.com/photos/1nqEZ8xFJ1I | @theemanofoth | 1800x1200 |
| `tangier/cafe-baba.jpg` | The painted sign of Cafe Baba on a white wall in the Kasbah | https://unsplash.com/photos/OvKcQnDzww4 | @theemanofoth | 1800x1200 |
| `tangier/rue-kasbah-sign.jpg` | A blue enamel street sign reading Rue de la Kasbah, number 40 | https://unsplash.com/photos/JXOxx7unn6o | @theemanofoth | 1800x1200 |
| `tangier/grand-socco-gate.jpg` | People walking through the white horseshoe gate between the Grand Socco and the medina | https://unsplash.com/photos/gcHdZnmUz5E | @theemanofoth | 1800x1200 |
| `tangier/medina-gate-street.jpg` | A white arch framing a busy street at the edge of the Tangier medina | https://unsplash.com/photos/m8VDuigR4MQ | @theemanofoth | 1800x1200 |
| `tangier/medina-lane.jpg` | A narrow whitewashed lane in the medina leading towards bright sunlight | https://unsplash.com/photos/skXtZ_OpRNo | @theemanofoth | 1800x1200 |
| `tangier/kasbah-arch.jpg` | An arched passage in the Kasbah with white walls and green doors | https://unsplash.com/photos/GaUiN12Rdfc | @sediri_ayoub | 1200x1500 |
| `tangier/kasbah-lane-plant.jpg` | A quiet stone lane in the old town with a potted plant and lanterns | https://unsplash.com/photos/EOn4kwra0qc | @kyllik | 1800x1200 |
| `tangier/marina-sunset.jpg` | Sailing boats moored in the Tangier marina at sunset | https://unsplash.com/photos/7mq_MU6_6kg | @theemanofoth | 1800x1200 |
| `tangier/white-facade-green-trim.jpg` | A white building with green shutters and a tree in front of it | https://unsplash.com/photos/ksdfFSg91i4 | @haykad684 | 1200x1500 |
| `tangier/square-palms.jpg` | White Spanish-style facades and palm trees on a sunny square | https://unsplash.com/photos/fNtAFyRi7es | @lsgerbec | 1800x1200 |
| `landmarks/cap-spartel-sunset.jpg` | The Cap Spartel lighthouse among palm trees at sunset, the sea behind | https://unsplash.com/photos/8kZ3NOlkVe8 | @todorandonov | 1800x1200 |
| `landmarks/cap-spartel-lighthouse.jpg` | The stone lighthouse of Cap Spartel with palm trees under a blue sky | https://unsplash.com/photos/gux9IsIluW8 | @leviaripronk | 1800x1200 |
| `landmarks/cap-spartel-cliff.jpg` | The Cap Spartel lighthouse on its green headland above the ocean | https://unsplash.com/photos/7CciILPba68 | @madbillzzz | 1200x1500 |
| `landmarks/hercules-caves-window.jpg` | The sea seen through the famous opening of the Caves of Hercules | https://unsplash.com/photos/UnzkvCEk1Mg | @starkie_pics | 1200x1500 |
| `landmarks/hercules-caves-sea.jpg` | Waves breaking at the mouth of the Caves of Hercules | https://unsplash.com/photos/ot-oEnMwjRY | @cosoproductions | 1200x1500 |
| `landmarks/hercules-caves-silhouette.jpg` | A visitor in silhouette at the entrance of the cave, looking out to sea | https://unsplash.com/photos/4F_t61uOMBU | @youssmub | 1800x1200 |
| `landmarks/camels-beach.jpg` | A line of camels walking along a wide Atlantic beach | https://unsplash.com/photos/KDGpOAyyreg | @helixgames | 1800x1200 |
| `landmarks/camel-ride.jpg` | A rider on a camel at the water’s edge on a sandy beach | https://unsplash.com/photos/YTpUV9oNjmw | @andri77 | 1200x1500 |
| `landmarks/coast-rocks.jpg` | Rocky coastline with green scrub above a calm sea | https://unsplash.com/photos/7MRSrSxfUr8 | @theemanofoth | 1800x1200 |
| `landmarks/bay-from-beach.jpg` | Waves rolling onto the beach with the white city of Tangier in the distance | https://unsplash.com/photos/dV0iDk1vKaA | @les_trippers | 1800x1200 |
| `landmarks/coast-road-dusk.jpg` | Dusk over the coastal road and the sea near Tangier | https://unsplash.com/photos/PoJ6j3i6DLA | @theemanofoth | 1800x1200 |
| `chefchaouen/blue-city-hillside.jpg` | Blue and white houses of Chefchaouen climbing the hillside under the Rif Mountains | https://unsplash.com/photos/NncAbldgViA | @infinitexplorer | 1800x1200 |
| `chefchaouen/blue-alley.jpg` | A narrow blue-washed alley with stairs and potted plants in Chefchaouen | https://unsplash.com/photos/bX9UO5V1tPs | @find_something_pretty_everyday | 1200x1500 |
| `chefchaouen/blue-stairs-market.jpg` | Blue stairs lined with baskets and crafts in the Chefchaouen medina | https://unsplash.com/photos/CBfUGtVP0QE | @mohammedlak | 1200x1500 |
| `chefchaouen/blue-courtyard.jpg` | A blue courtyard with potted plants and traditional decoration in Chefchaouen | https://unsplash.com/photos/CMmgfHQiYsc | @koullislp | 1800x1200 |
| `chefchaouen/uta-el-hammam.jpg` | People gathering on the main square of Chefchaouen, the mountains behind | https://unsplash.com/photos/zdulPe3bVNU | @bethchobanova | 1800x1200 |
| `asilah/asilah-medina.jpg` | Whitewashed houses with blue trim in the Asilah medina | https://unsplash.com/photos/g9nVb3AzShA | @mohammedlak | 1200x1500 |
| `asilah/blue-window.jpg` | A blue wooden window set in a white wall | https://unsplash.com/photos/jrWBI2FFsbQ | @mohammedlak | 1200x1500 |
| `asilah/window-mural.jpg` | A wooden shutter and a painted mural on a white wall | https://unsplash.com/photos/EHSFlap-yvg | @abdelhamid_az | 1200x1500 |
| `asilah/beach-waves.jpg` | A sandy Atlantic beach with waves and a white town on the headland | https://unsplash.com/photos/ILnxcXUxWyk | @theemanofoth | 1800x1200 |
| `food/couscous.jpg` | A plate of couscous with caramelised onions and raisins | https://unsplash.com/photos/Bi_hJh5oEtA | @theemanofoth | 1800x1200 |
| `food/tagine-ceramic.jpg` | A ceramic tagine decorated with Arabic calligraphy | https://unsplash.com/photos/ftYjriPMfT0 | @theemanofoth | 1800x1200 |
| `food/tagines-clay.jpg` | Clay pots of slow-cooked meat and vegetables | https://unsplash.com/photos/QFGOSN99_lU | @altimod | 1200x1500 |
| `food/spice-market.jpg` | Pyramids of coloured spices and dried goods on a market stall | https://unsplash.com/photos/3dVx9j1iepM | @alessionord | 1200x1500 |
| `food/spice-bags.jpg` | Colourful sacks of spices and dried flowers in a souk | https://unsplash.com/photos/_n9PLGmJq9Y | @packetdiscards | 1800x1200 |
| `food/mint-tea.jpg` | Glasses of mint tea in silver holders | https://unsplash.com/photos/J2pQH8r7WBc | @jonathanpielmayer | 1800x1200 |
| `food/tea-pastries.jpg` | A silver teapot and Moroccan pastries | https://unsplash.com/photos/VBW7PlDhzWU | @rachidnl | 1800x1200 |
| `food/moroccan-table.jpg` | A table laid with Moroccan dishes, bread and tea | https://unsplash.com/photos/_V4v7BbG338 | @anniespratt | 1800x1200 |
| `craft/pottery-shelves.jpg` | Shelves of hand-painted pottery and plates in a shop | https://unsplash.com/photos/LiOCTpR7yTc | @theemanofoth | 1800x1200 |
| `craft/mirrors.jpg` | Rows of small painted mirrors in a craft shop | https://unsplash.com/photos/-8VkSI1pgx4 | @theemanofoth | 1800x1200 |
| `craft/pottery-shop.jpg` | A pottery shop with stacked bowls and plates | https://unsplash.com/photos/LG88LKa-irA | @sandertraa | 1200x1500 |
| `craft/carpet-shop.jpg` | A woman in a hat in front of a carpet shop in the souk | https://unsplash.com/photos/ufPyadx1z_E | @rumanamin | 1200x1500 |
| `craft/souk-lane.jpg` | A narrow lane in the souk with textiles hanging above the stalls | https://unsplash.com/photos/in1z9WjiSR8 | @sandertraa | 1200x1500 |

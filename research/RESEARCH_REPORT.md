# Rassma Tours — Rapport d'audit et de recherche

Date des consultations : **20 octobre 2026**.

> Convention : **[Vérifié]** = lu sur le site existant ou une source identifiée ; **[Dérivé]** = rédigé à partir d'éléments vérifiés ; **[À confirmer]** = absent ou incertain, à valider par le client (liste actionnable dans `CLIENT_VALIDATION.md`).

## 1. Dépôt et stack

- Le projet a d’abord été construit par erreur dans un sous-dossier d’un dossier sans rapport (prototype Little Mamma), puis déplacé le 21/10/2026 dans son propre dossier `C:/Users/melko/Developer/rassmatours`. Aucun dépôt Git n’existe pour l’instant. La stack (Vite 8, React 19, TypeScript 6, Tailwind CSS 4, oxlint) suit la convention maison.
- Ajouts : `react-router` 7 (pages distinctes, URL propres) et un **prérendu statique** maison (`scripts/prerender.mjs`) qui génère un HTML complet par route, avec balises `<head>` par page, `sitemap.xml` et `robots.txt`. Aucune autre dépendance.

## 2. Site existant : tangierbyguide.com [Vérifié]

Application monopage (générée avec Lovable, police système, Tailwind). Les routes `/tours`, `/about`, `/contact` renvoient un **404 serveur en accès direct** (seule la navigation interne fonctionne) : un défaut de référencement majeur de l'existant, corrigé ici par le prérendu.

| Élément | Contenu relevé |
|---|---|
| Nom affiché | « Tangier By Guide » (le brief désigne l'entreprise comme **Rassma Tours** : lien entre les deux noms **[À confirmer]**) |
| Titre / description | « Private Tours & Day Trips from Spain » ; cible explicite : excursions depuis Tarifa, Séville, Malaga, Marbella, Costa del Sol |
| Langues du site | EN / ES |
| Présentation | « We are a team of passionate local guides… » ; « all our tours are private, only you and your group are participating » |
| Tours (page Tours) | Tangier Walking Tour (2–4 h) · Tangier Highlights, Camels & Old Town Tour (4–6 h) · Asilah Day Trip from Tangier (4–6 h) · Chefchaouen Day Trip from Tangier (7–9 h) · Tangier Food Tour (4–5 h, highlights : tasting, fish market & food souks, spices) |
| Services additionnels | Tours sur mesure · transferts inter-villes (Fès, Casablanca, Rabat, Marrakech) · circuits multi-jours · assistance ferry (billets, accompagnement au port) |
| Atouts | Guides locaux expérimentés · expériences personnalisées · service multilingue · sécurité & confort (véhicules privés climatisés, guides et chauffeurs accrédités) |
| Témoignages | Marie L. (France), John D. (United States), Sophie M. (Spain) — repris verbatim, authenticité **[À confirmer]** |
| Distinction | Lien « TripAdvisor Excellence Certified » vers la fiche *Tangier Discovery Tours* (g293737-d17702022) |
| À propos | Fondé par des « enthusiasts of Tangier » ; mission « authentic Morocco beyond tourist clichés » ; valeurs Authenticity / Passion / Connection |
| Contact | Tél. et WhatsApp **+212 658-313411** · tangierbyguide@gmail.com · Tangier, Morocco · Lun–ven 8:00–20:00, sam 9:00–19:00, dim 9:00–17:00 |
| FAQ | Réservation via WhatsApp / téléphone / e-mail / formulaire, réponse sous 24 h · langues AR/FR/EN/ES · paiement en espèces (MAD) le jour même, acompte possible · tours personnalisables |
| Réseaux sociaux | Icônes sans lien (`href="#"`) : **aucun compte vérifié** |
| Images | 11 PNG hébergés sur le site (groupes avec le guide, Cap Spartel, Chefchaouen, Asilah, nourriture). **Non réutilisées** : droits non établis. URL listées dans `image-catalog.md` §4 |
| Prix, horaires de départ, inclusions | **Absents** du site : non affichés |

Ce qui a été conservé : l'intégralité de l'offre, les descriptifs (verbatim dans `summary`), les atouts, la FAQ, les coordonnées, les témoignages. Ce qui a été réorganisé : une page par tour, une page destinations, une page « plan your trip » avec formulaire, un pied de page complet.

## 3. Garmany Golf (référence de structure) [Vérifié]

Relevé sur la page d'accueil (ordinateur, 20/10/2026) :

- **En-tête** : logo à gauche, menu hamburger ouvrant un panneau « Destinations », CTA « Plan Your Experience » à droite.
- **Hero** : vidéo drone plein écran ; accroche en capitales espacées (« LUXURY GOLF TRAVEL », Montserrat 18 px, interlettrage 1,6 px) ; titre serif sur deux lignes (« Exceptional Golf. / Personally Tailored. », EB Garamond, 112 px, la première ligne en italique) ; deux boutons en pilule à bords fins.
- **Séquence** : déclaration de marque → témoignage unique → tuiles « Worldwide Destinations » (image + nom + une ligne) → « The Garmany Difference » sur photo sombre → trois piliers (Our Process / Relationships / Passion) → « Ways to Travel… » (quatre cartes image + titre serif) → bande de témoignages → promos → pied de page sombre (logo blanc) → **bandeau défilant** de phrases de marque.
- **Couleurs** : blanc, bleu nuit `rgb(23,53,73)` et `rgb(10,24,34)`, gris clair `rgb(239,238,238)`.
- **Principes extraits** : une seule famille serif à très grand corps + une sans pour les étiquettes ; alternance fonds clairs / photos sombres ; grands vides ; CTA formulés comme une invitation (« Start your Experience », « Request Itinerary »).

Aucun texte, visuel ni marque de Garmany n'est réutilisé.

## 4. Tangier Private Tours (référence de contenu) [Vérifié]

Le domaine redirige vers **Sunlight Morocco Travel** (opérateur licencié depuis 2007, Tangier + bureau US). Observations utiles :

- Cartes de tours avec **durée, point de départ, 3 highlights + « +2 »**, bouton WhatsApp pré-rempli ; réservation « WhatsApp only, no forms ».
- Fiche tour : hero + étiquettes (durée, rythme, note), aperçu, highlights, **encadré « Book This Tour »** (durée, départ, « Private tour — just your group »), « Keep Exploring » avec trois cartes liées. Pas d'itinéraire horaire ni d'inclusions.
- Ton : « Immerse yourself in the legendary gateway city of Africa », « the authentic Morocco that guidebooks can't capture ».
- Sections « Why travel with us » (licence, privé, multilingue, prix justes), « Morocco Through Our Lens » (galerie), « Find Us ».

Adaptations retenues : encadré d'inquiry collant sur chaque fiche, highlights en liste, « You may also like », WhatsApp pré-rempli par tour, section « Coming from Spain? ».

## 5. Contenu produit pour Rassma Tours

- **Textes** [Dérivé] : introductions, récits de chaque expérience (`story`), déroulé indicatif (`day`), textes destinations, page À propos. Les faits de lieu cités sont de notoriété publique (Cap Spartel : rencontre Méditerranée/Atlantique et phare du XIXe ; grottes d'Hercule et leur ouverture « carte d'Afrique » ; Chefchaouen fondée en 1471 ; remparts portugais d'Asilah du XVe siècle, festival d'arts depuis la fin des années 1970 ; Tanger zone internationale 1923–1956). Aucun prix, horaire, inclusion ou certification inventé.
- **Images** : 51 photos Unsplash (licence Unsplash), contrôlées visuellement sur planches-contacts, nommées par lieu. Provenance complète dans `image-catalog.md` / `image-sources.csv`. À remplacer par les photos de l'agence.
- **Formulaire** : validation côté client ; sans backend, il prépare un message et l'envoie via WhatsApp ou e-mail (prototype fonctionnel) ; avec `VITE_INQUIRY_ENDPOINT`, envoi HTTP JSON.

## 6. Informations manquantes

Voir `CLIENT_VALIDATION.md`. Principales : rapport entre « Rassma Tours » et « Tangier By Guide », logo et charte, nom de domaine, réseaux sociaux, photos officielles, prix et politique d'acompte, autorisation des témoignages, mentions légales, service d'envoi du formulaire, version espagnole.

## 7. Sources

- https://tangierbyguide.com/ (+ routes internes /tours, /about, /contact via navigation JS)
- https://www.garmanygolf.com/
- https://thetangierprivatetours.com/ → https://thetangierprivatetours.com/en/ et /en/day-tours/tangier-city-tour
- https://www.tripadvisor.com/Attraction_Review-g293737-d17702022-Reviews-Tangier_Discovery_Tours-Tangier_Tanger_Tetouan_Al_Hoceima.html (lien présent sur le site existant, non consulté)
- https://unsplash.com/ (recherches : tangier, tangier medina, tangier kasbah, tangier beach, chefchaouen, asilah, cap spartel, hercules cave, moroccan food, morocco souk, camel beach morocco, moroccan mint tea)

# À faire valider par Rassma Tours avant mise en ligne

Le site a été construit uniquement avec les informations publiées sur tangierbyguide.com (20/10/2026) et des faits publics sur les lieux. Rien n'a été inventé pour combler les manques. Légende : ☐ à obtenir · ⚠ provisoire, déjà affiché · ✎ où le modifier.

## 1. Identité

- ☐ **Rapport entre « Rassma Tours » et « Tangier By Guide »** : nouveau nom, deux marques, rachat ? Le site affiche partout Rassma Tours mais utilise le téléphone, l'e-mail et les témoignages de Tangier By Guide. ⚠ ✎ `src/data/site.ts`.
- ☐ **Logo** (SVG/PNG, versions claire et sombre). ⚠ Wordmark typographique provisoire + monogramme. ✎ `brand.logo` dans `src/data/site.ts`, `public/favicon.svg`, `src/components/Wordmark.tsx`.
- ☐ **Signature** « Discover Tangier, Personally. » : à confirmer ou affiner. ✎ `brand.tagline`.
- ☐ **Palette et typographies** proposées (voir `DESIGN_DIRECTION.md`) : direction créative, pas une charte officielle. ✎ `src/styles/index.css`.
- ☐ **Nom de domaine** : `https://rassmatours.com` est un **placeholder** utilisé pour canonical, sitemap et Open Graph. ✎ `.env` → `VITE_SITE_URL`.

## 2. Coordonnées et canaux

- ☐ Téléphone / WhatsApp **+212 658-313411** et e-mail **tangierbyguide@gmail.com** : toujours valables pour Rassma Tours ? Souhaitez-vous une adresse e-mail au nom de la marque ?
- ☐ Horaires affichés (lun–ven 8–20 h, sam 9–19 h, dim 9–17 h).
- ☐ Adresse postale ou point de rendez-vous à publier (le site dit « Tangier, Morocco » et « meeting point agreed when booking »).
- ☐ **Réseaux sociaux** : aucun lien vérifié (icônes vides sur le site existant). ✎ `social` dans `src/data/site.ts` (le pied de page les affichera dès qu'ils seront renseignés).
- ☐ Lien TripAdvisor : la fiche liée s'appelle « Tangier Discovery Tours ». Est-ce bien la vôtre ? ✎ `tripadvisorUrl`.

## 3. Offre

- ☐ Les cinq expériences et leurs durées (2–4 h, 4–6 h, 4–6 h, 7–9 h, 4–5 h) sont reprises du site existant : toujours exactes ?
- ☐ **Déroulé indicatif** (`day`) et récits (`story`) de chaque fiche : rédigés à partir de vos descriptifs et de faits publics. ⚠ À relire, notamment l'ordre des étapes (ex. Highlights : Cap Spartel → grottes → chameaux → médina). ✎ `src/data/tours.ts`.
- ☐ **Prix** : non affichés (absents du site existant). Souhaitez-vous les publier ? Le site indique « Prices are confirmed with your quote ».
- ☐ **Inclusions / exclusions** : non affichées faute d'information (déjeuner d'Asilah : « arranged on the day » ⚠). ✎ `goodToKnow` dans `src/data/tours.ts`.
- ☐ Acompte : « a deposit may be requested for some excursions » (FAQ existante). Montant, conditions ?
- ☐ Services additionnels (transferts, circuits, assistance ferry) : toujours proposés ? Villes exactes ?
- ☐ Destinations : Tanger, Asilah, Chefchaouen uniquement (Tétouan n'est pas proposé, donc absent).

## 4. Preuves sociales

- ☐ Les trois témoignages (Marie L., John D., Sophie M.) sont ceux du site existant : **authentiques et autorisés** ? Sinon, retirer ou remplacer. ✎ `src/data/testimonials.ts` (un tableau vide affiche un emplacement neutre).
- ☐ Note TripAdvisor / Google à afficher ? Non affichée faute de vérification.
- ☐ Mention « TripAdvisor Excellence Certified » : non reprise (certificat et année à fournir).

## 5. Photos

- ☐ **Photos officielles** (tours, guides, véhicules, clients avec autorisation) : toutes les images actuelles sont des **remplacements temporaires Unsplash** (`research/image-catalog.md`). Les 11 images du site existant n'ont pas été copiées (droits à établir) ; leurs URL sont listées dans le catalogue pour récupération des originaux.
- ☐ Validation des légendes et textes alternatifs (`src/data/images.ts`).

## 6. Formulaire et conversion

- ☐ **Service d'envoi du formulaire** : aujourd'hui, le formulaire prépare la demande et l'utilisateur l'envoie via WhatsApp ou e-mail (fonctionnel). Pour un envoi direct : Formspree, Basin, Web3Forms, Resend via fonction serverless, ou CRM. ✎ `.env` → `VITE_INQUIRY_ENDPOINT` (POST JSON : champs du formulaire + `formatted`).
- ☐ Faut-il un outil de réservation en ligne (GetYourGuide, Viator, Bokun…) ? Aucun faux moteur n'a été ajouté.
- ☐ Message WhatsApp pré-rempli : textes à ajuster ? ✎ `src/lib/contact-links.ts`, `src/lib/inquiry.ts`.

## 7. Légal et conformité

- ☐ **Mentions légales** : raison sociale, forme juridique, registre du commerce, licence d'agence / de guide, adresse du siège, hébergeur. ⚠ Aucune page « Legal notice » faute d'informations ; seule une notice de confidentialité factuelle existe (`/privacy`, non indexée).
- ☐ Cookies : aucun traceur ni analytics ; à revoir si Google Analytics ou un pixel est ajouté (bannière de consentement nécessaire).
- ☐ Données structurées `TravelAgency` (nom, téléphone, e-mail, ville) : activées ; désactivables via `seo.enableStructuredData`.

## 8. SEO et mesure (ajouté le 20/10/2026, voir `docs/`)

- ☐ **Domaine de production** : `rassmatours.com` n'est pas enregistré au 20/10/2026 ; seul `tangierbyguide.com` est en ligne. Conserver ce domaine ou en acheter un ? Sans réponse, les URL canoniques et le sitemap pointent vers un placeholder. ✎ `VITE_SITE_URL`.
- ☐ **Titre H1 du tour « Tangier Highlights, Camels & Old Town Tour »** : affiché comme « Cap Spartel & Caves of Hercules Tour from Tangier » (mot-clé de recherche) sur la fiche et les cartes ; le nom publié reste dans l'introduction, le formulaire, WhatsApp et les données structurées. Valider ou revenir au nom publié. ✎ `headline` dans `src/data/tours.ts`.
- ☐ **Point de rendez-vous** affiché sur chaque fiche (« hôtel, port ou terminal ferry, convenu à la réservation ») : dérivé du service d'assistance ferry publié, à confirmer. ✎ `contact.meetingPoint` dans `src/data/site.ts`.
- ☐ **FAQ par tour et infos pratiques par destination** (distances, durées de route, altitude) : rédigées à partir de faits publics, à relire par un guide. ✎ `faqs` / `practical` dans `src/data/tours.ts` et `src/data/destinations.ts`.
- ☐ **Fiche Google Business Profile** : à créer ou revendiquer (voir `docs/seo-launch-checklist.md`), puis renseigner `googleBusinessProfileUrl`.
- ☐ **Google Analytics 4** : souhaité ? Fournir l'identifiant `G-…` (`VITE_GA4_ID`) ; un bandeau de consentement s'affiche alors.
- ☐ **Search Console** : accès au DNS du domaine pour la vérification, ou compte Google à qui déléguer.
- ☐ **Mentions légales** : toujours bloquantes pour la mise en ligne (raison sociale, registre, licence, adresse).
- ☐ **Langue suivante** : espagnol (présent sur l'ancien site) ou français (brief) ? Traduction humaine requise ; l'architecture (`locales`, `alternates`) est prête.

## 9. Excursions depuis l'Espagne (ajouté le 22/10/2026)

- ☐ **Transport en Espagne** : le site n'en promet aucun (« our service starts in Tangier »). Proposez-vous des prises en charge à Marbella, Malaga, Séville ou Tarifa ? Si oui, des pages dédiées à ces villes deviennent justifiées. ✎ `hasPage` dans `src/data/spain.ts`.
- ☐ **Transfert Tanger Med ↔ ville** : présenté comme « à demander » sur la page Algeciras. Confirmez que vous le proposez et son fonctionnement.
- ☐ **Billets de ferry** : présentés comme achetés auprès de la compagnie, avec votre aide, hors prix du tour. Exact ? Avez-vous un partenaire ferry à nommer ?
- ☐ **Durées** : traversée Tarifa ≈ 1 h, Algeciras ≈ 1 h 30, Tanger Med ≈ 45 min de la ville ; routes Marbella ≈ 1 h 15, Malaga ≈ 2 h, Séville ≈ 2 h 15. Ordres de grandeur publics, à relire.
- ☐ **Chefchaouen depuis l'Espagne** : affiché comme non compatible avec un aller-retour dans la journée (nuit à Tanger conseillée). D'accord ?
- ☐ **Documents** : passeport exigé, vérification des règles d'entrée par nationalité. Souhaitez-vous ajouter des précisions (fiche d'entrée, mineurs) ?

## 10. Langues

- ☐ Le site existant est bilingue EN/ES. Le nouveau site est en anglais ; la structure (textes centralisés dans `src/data/` et `src/content/`) permet d'ajouter l'espagnol et le français sans refonte. Priorité ?

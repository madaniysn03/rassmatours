# Rassma Tours — Keyword-to-page map

Status: **keywords implemented in the site; volumes not validated.** The keywords below are written into the built pages (title, meta description, H1, intro, H2s, alt text, anchors) and verified by `node scripts/seo-keywords-check.mjs` (section 3 bis). What remains unvalidated is their search demand: No keyword research tool or authenticated API (Google Keyword Planner, Search Console, Semrush, Ahrefs) was available in this environment, so **no search volumes, difficulty scores or trends are stated**. Opportunities were assessed qualitatively from (a) the company's actual offer, (b) a review of the search results pages for a handful of queries on 20 October 2026, and (c) search intent. See §5 for how to validate.

## 1. What the search results told us (20 Oct 2026)

Queries checked: "Tangier private tours local guide", "Chefchaouen day trip from Tangier private", "Cap Spartel Hercules Caves tour Tangier", and the French "visite guidée Tanger guide privé excursion Chefchaouen depuis Tanger".

- Results are dominated by **marketplaces and aggregators**: Civitatis, Headout, Barceló Guía de Turismo, ToursByLocals, GoWithGuide, daytrip.com, Travelocity, Shore Excursions Group. Few independent operators rank on the first page.
- Competing listings sell on **duration, pickup at hotel/port/airport, "private", lunch not included, languages** and show prices. Rassma Tours cannot show prices yet (none confirmed), so its pages must win on **specificity, local voice and practical answers**.
- Two intents recur: **cruise and ferry day-trippers from Spain** (short tours timed around port calls) and **full-day excursions** (Chefchaouen, Asilah). Both match the existing offer exactly.
- French-language results exist for the same intents (Civitatis FR, Barceló FR), so a French version is a credible second phase once content is translated by a human.

## 2. Keyword clusters (hypotheses)

| Cluster | Example queries | Intent | Mapped page |
|---|---|---|---|
| Core Tangier | tangier tours, tangier private tours, private tour guide tangier, tangier guided tours, tangier sightseeing | Commercial | `/` and `/tours/` |
| Walking tour | tangier walking tour, tangier medina tour, kasbah tangier tour, tangier old town tour | Commercial | `/tours/tangier-walking-tour/` |
| Landmarks | cap spartel and hercules caves tour, hercules cave tangier tour, tangier camel ride, tangier highlights tour, tangier city tour | Commercial | `/tours/cap-spartel-hercules-caves/` |
| Food | tangier food tour, tangier market tour, moroccan cooking tangier (not offered) | Commercial / informational | `/tours/tangier-food-tour/` |
| Chefchaouen | chefchaouen day trip from tangier, tangier to chefchaouen tour, blue city tour from tangier | Commercial | `/tours/chefchaouen-day-trip/` |
| Asilah | asilah day trip from tangier, tangier to asilah tour, asilah excursion | Commercial | `/tours/asilah-day-trip/` |
| Destination info | things to do in tangier morocco, tangier day trip from spain, is tangier worth visiting, chefchaouen from tangier distance, asilah morocco | Informational | `/destinations/tangier/`, `/destinations/asilah/`, `/destinations/chefchaouen/` |
| Commercial / custom | book a private tour in tangier, private excursions tangier, local guide in tangier morocco, customized tangier tours, tangier tour from tarifa | Transactional | `/contact/`, `/tours/` |
| Not targeted | tetouan tour from tangier (not offered), fes/marrakech tours (transfers only), prices/"cheap" queries (no public prices) | — | none (see content plan) |

## 3. Page map

### `/` — Home

- **Primary:** private tours in Tangier
- **Secondary:** Tangier tours, local guide Tangier, day trips from Tangier
- **Intent:** commercial (broad)
- **Audience / language:** English-speaking visitors from Spain (ferry), cruise passengers, independent travellers; EN
- **Title:** Private Tours in Tangier with Local Guides | Rassma Tours
- **H1:** Private tours in Tangier, *personally* guided.
- **Meta description:** Private tours in Tangier and day trips with local guides: medina walking tour, Cap Spartel and Caves of Hercules, food tour, Asilah and Chefchaouen.
- **H2s carrying secondary keywords:** Private tours and day trips from Tangier · Why travel with a local guide in Tangier · Tangier, Asilah and Chefchaouen · Customised Tangier tours, your way
- **Content gaps:** real photos of guides and guests; verified testimonials; company founding facts
- **Internal links:** 3 featured tours, all tours, 3 destinations, about, contact
- **Validation:** implemented in code and verified in the built HTML; search volumes unvalidated

### `/tours/` — Tours index

- **Primary:** Tangier tours and day trips
- **Secondary:** Tangier guided tours, private excursions Tangier, tailor-made Tangier tours
- **Intent:** commercial (comparison)
- **Title:** Tangier Tours & Day Trips with a Local Guide | Rassma Tours
- **H1:** Tangier tours and day trips, days worth remembering
- **Description:** Tangier tours and day trips, all private and led by local guides: medina walking tour, Cap Spartel and Caves of Hercules, food tour, Asilah, Chefchaouen.
- **H2s:** Guided tours in Tangier and excursions from the city · Tailor-made Tangier tours and private excursions
- **Content gaps:** prices or "from" indications once confirmed; ferry/cruise timing guidance
- **Internal links:** 5 tour pages, contact, FAQ
- **Validation:** implemented; keywords unvalidated

### `/tours/tangier-walking-tour/`

- **Primary:** Tangier walking tour
- **Secondary:** Tangier medina tour, Kasbah Tangier, Tangier old town tour, Tangier private tour guide
- **Intent:** commercial
- **Title:** Tangier Walking Tour: Medina, Kasbah & Souks | Rassma Tours
- **H1:** Tangier Walking Tour
- **Description:** A private Tangier walking tour, 2 to 4 hours through the medina, Kasbah and souks with a local guide. History, hidden corners and your own pace.
- **H2s:** Your Tangier walking tour itinerary · Highlights of the Tangier walking tour · Practical information for the Tangier walking tour · Questions about the Tangier walking tour
- **Content gaps:** exact meeting point, price, photos from the tour
- **Internal links:** destination Tangier, Cap Spartel tour, food tour, contact (pre-filled)
- **Validation:** implemented; keywords unvalidated

### `/tours/cap-spartel-hercules-caves/`

- **Primary:** Cap Spartel and Hercules Caves tour
- **Secondary:** Tangier highlights tour, Tangier camel ride, Tangier city tour, Hercules cave Tangier
- **Intent:** commercial
- **Title:** Cap Spartel & Caves of Hercules Tour, Tangier | Rassma Tours
- **H1:** Cap Spartel & Caves of Hercules Tour from Tangier (the verified product name, "Tangier Highlights, Camels & Old Town Tour", is kept as the tour `name` in the intro, the form, the WhatsApp message and the `TouristTrip` schema; the H1 uses the keyword-bearing `headline`. To confirm with the client.)
- **Description:** Private Cap Spartel and Caves of Hercules tour from Tangier, 4 to 6 hours: lighthouse, sea caves, camel ride on the Atlantic beach and the old medina.
- **Content gaps:** entrance fees (caves), camel ride cost, price
- **Internal links:** destination Tangier, walking tour, Asilah, contact
- **Validation:** implemented; slug changed from `tangier-highlights` (redirect in place); keywords unvalidated

### `/tours/asilah-day-trip/`

- **Primary:** Asilah day trip from Tangier
- **Secondary:** Tangier to Asilah tour, Asilah excursion, Asilah private tour
- **Intent:** commercial
- **Title:** Asilah Day Trip from Tangier, Private Tour | Rassma Tours
- **H1:** Asilah Day Trip from Tangier
- **Description:** A private Asilah day trip from Tangier, 4 to 6 hours: coastal drive, whitewashed medina, Portuguese ramparts, festival murals and lunch by the ocean.
- **Content gaps:** lunch arrangements, price
- **Internal links:** destination Asilah, Chefchaouen, Cap Spartel tour, contact
- **Validation:** implemented; keywords unvalidated

### `/tours/chefchaouen-day-trip/`

- **Primary:** Chefchaouen day trip from Tangier
- **Secondary:** Tangier to Chefchaouen tour, blue city tour from Tangier, Chefchaouen private tour
- **Intent:** commercial (highest competition in the set)
- **Title:** Chefchaouen Day Trip from Tangier, Private | Rassma Tours
- **H1:** Chefchaouen Day Trip from Tangier
- **Description:** A private Chefchaouen day trip from Tangier, full day in the blue town of the Rif Mountains: medina, artisans, viewpoints, lunch and a local guide.
- **Content gaps:** departure time, lunch, price, photos
- **Internal links:** destination Chefchaouen, Asilah, walking tour, contact
- **Validation:** implemented; keywords unvalidated

### `/tours/tangier-food-tour/`

- **Primary:** Tangier food tour
- **Secondary:** Tangier market tour, Moroccan food Tangier, fish market Tangier
- **Intent:** commercial
- **Title:** Tangier Food Tour: Markets, Souks & Spices | Rassma Tours
- **H1:** Tangier Food Tour
- **Description:** A private Tangier food tour, 4 to 5 hours through the fish market and food souks, with tastings of local specialities and an introduction to Moroccan spices.
- **Content gaps:** list of tastings, number of stops, price (the source site has a one-line description only)
- **Internal links:** destination Tangier, walking tour, Cap Spartel tour, contact
- **Validation:** implemented; thinnest page, see content plan

### `/destinations/` — Destinations index

- **Primary:** day trip destinations from Tangier (navigational hub)
- **Intent:** informational / navigational
- **Title:** Day Trip Destinations from Tangier | Rassma Tours
- **H1:** Day trip destinations from Tangier, up close
- **H2s:** Tangier, Asilah and Chefchaouen · Day trips and tours by destination
- **Internal links:** 3 destination pages, tours by destination, contact
- **Validation:** implemented

### `/destinations/tangier/`

- **Primary:** things to do in Tangier
- **Secondary:** Tangier Morocco, Tangier day trip from Spain, Tangier from Tarifa, visit Tangier
- **Intent:** informational with commercial links
- **Title:** Things to Do in Tangier with a Local Guide | Rassma Tours
- **H1:** Things to do in Tangier with a local guide
- **Description:** Things to do in Tangier: the medina, the Kasbah, the Grand Socco, Cap Spartel and the Caves of Hercules, with practical tips and private tours by local guides.
- **H2s:** What to see in Tangier · Planning a visit to Tangier · Questions about Tangier · Private tours in Tangier
- **Content gaps:** could grow into a fuller guide (neighbourhoods, cafés, markets) with original photography
- **Internal links:** 3 Tangier tours, other destinations, contact
- **Validation:** implemented

### `/destinations/asilah/`

- **Primary:** Asilah Morocco
- **Secondary:** Asilah from Tangier, Asilah medina, Asilah murals
- **Title:** Asilah, Morocco: The White Town near Tangier | Rassma Tours
- **H1:** Asilah, Morocco: the white town near Tangier
- **Internal links:** Asilah day trip, other destinations
- **Validation:** implemented

### `/destinations/chefchaouen/`

- **Primary:** Chefchaouen from Tangier
- **Secondary:** Chefchaouen blue city, Tangier to Chefchaouen distance, Chefchaouen day trip
- **Title:** Chefchaouen: The Blue City, 2 Hours from Tangier | Rassma Tours
- **H1:** Chefchaouen, the blue city two hours from Tangier
- **Internal links:** Chefchaouen day trip, other destinations
- **Validation:** implemented. Note: the **tour page** targets the transactional "day trip" query; the destination page targets the informational query. Both link to each other and must not be merged.

### `/about/`

- **Primary:** Rassma Tours (brand), local guides in Tangier
- **Title:** About Rassma Tours, Local Guides in Tangier | Rassma Tours
- **H1:** Local guides in Tangier, hosts first
- **H2s:** Born from a love of Tangier · Three words we work by · What to expect from your private tour guide in Tangier
- **Content gaps:** founding year, team, licences (none verified)
- **Validation:** implemented

### `/contact/`

- **Primary:** book a private tour in Tangier
- **Secondary:** Tangier tour inquiry, Tangier tour from Tarifa, custom Tangier tour
- **Intent:** transactional
- **Title:** Plan Your Trip: Book a Private Tour in Tangier | Rassma Tours
- **H1:** Book a private tour in Tangier: let's plan your days
- **Description:** Book a private tour in Tangier: tell us your dates, your group and what you would like to see. Reach Rassma Tours by WhatsApp, phone, email or the form.
- **Validation:** implemented

### `/privacy/`

- `noindex`, excluded from the sitemap.

## 3 bis. Keyword implementation table (verified against the built HTML)

Status meaning: **Implemented** = the primary keyword is in the title, the H1 and the page body, and at least three secondary keywords appear in the body; search volumes remain **unvalidated** (see section 5). Secondary cells show body occurrences and whether the keyword also appears in an H2, an image alt or a link anchor.

<!-- keyword-table:start -->
_Generated by `node scripts/seo-keywords-check.mjs` on 2026-10-22 from the built HTML in `dist/`._

| Page | Primary keyword | Primary: where found | Secondary keywords (body occurrences; H2 / alt / link when present) | Status |
|---|---|---|---|---|
| `/` | Tangier day trips from Spain | title ✓ · meta ✓ · H1 ✓ · body ×2 | private tours in Tangier (1); local guide (6, H2); Tarifa (6, link); ferry (4, link); Chefchaouen (7, H2, alt, link) | Implemented (volumes unvalidated) |
| `/tours/` | Tangier tours and day trips | title ✓ · meta ✓ · H1 ✓ · body ×1 | guided tours in Tangier (1, H2); private excursions (1, H2); tailor-made Tangier tours (1, H2); local guide (1); Chefchaouen (2, alt, link) | Implemented (volumes unvalidated) |
| `/tours/tangier-walking-tour/` | Tangier walking tour | title ✓ · meta ✓ · H1 ✓ · body ×8 | private city tour (1); medina (5, alt); Kasbah (4, alt); souks (4); day trip from Spain (2, H2) | Implemented (volumes unvalidated) |
| `/tours/cap-spartel-hercules-caves/` | Cap Spartel and Caves of Hercules tour | title ✓ · meta ✓ · H1 ✓ · body ×8 | camel ride (4); Tangier highlights (1); Atlantic (6, alt); old town (4); lighthouse (3, alt) | Implemented (volumes unvalidated) |
| `/tours/asilah-day-trip/` | Asilah day trip from Tangier | title ✓ · meta ✓ · H1 ✓ · body ×2 | Atlantic coast (3); ramparts (4); murals (5); medina (4, alt); private tour (2) | Implemented (volumes unvalidated) |
| `/tours/chefchaouen-day-trip/` | Chefchaouen day trip from Tangier | title ✓ · meta ✓ · H1 ✓ · body ×2 | blue city (1); Rif Mountains (3, alt); medina (5, alt); private (11); local guide (1) | Implemented (volumes unvalidated) |
| `/tours/tangier-food-tour/` | Tangier food tour | title ✓ · meta ✓ · H1 ✓ · body ×8 | fish market (4); food souks (3); Moroccan spices (2); tastings (2); local specialities (3) | Implemented (volumes unvalidated) |
| `/destinations/` | day trip destinations from Tangier | title ✓ · meta ✓ · H1 ✓ · body ×1 | Tangier (11, H2, alt, link); Asilah (4, H2, alt, link); Chefchaouen (4, H2, alt, link); Fes (1, H2); private transfers (1) | Implemented (volumes unvalidated) |
| `/destinations/tangier/` | things to do in Tangier | title ✓ · meta ✓ · H1 ✓ · body ×1 | medina (6, alt); Kasbah (4, alt); Grand Socco (2); Cap Spartel (7, link); Tarifa (2) | Implemented (volumes unvalidated) |
| `/destinations/asilah/` | Asilah Morocco | title ✓ · meta ✓ · H1 ✓ · body ×1 | ramparts (4); medina (3, alt); murals (4); beach (3, alt); day trip (2, link) | Implemented (volumes unvalidated) |
| `/destinations/chefchaouen/` | Chefchaouen | title ✓ · meta ✓ · H1 ✓ · body ×12 | blue city (1); Rif Mountains (1, alt); two hours from Tangier (2); medina (6, alt); day trip (4, link) | Implemented (volumes unvalidated) |
| `/about/` | local guides in Tangier | title ✓ · meta ✓ · H1 ✓ · body ×1 | private tours (0); Rassma Tours (1, link); languages (1); Morocco (2); hospitality (1) | Implemented (volumes unvalidated) |
| `/contact/` | book a private tour in Tangier | title ✓ · meta ✓ · H1 ✓ · body ×1 | WhatsApp (3, link); ferry (5, link); Tarifa (1); tailor-made (2); quote (1) | Implemented (volumes unvalidated) |
| `/day-trips-from-spain/` | Tangier day trip from Spain | title ✓ · meta ✓ · H1 ✓ · body ×1 | Tarifa (23, link); Algeciras (7, link); Marbella (5, H2); Malaga (4, H2); Seville (5, H2); ferry (18, H2, link); private guide (4) | Implemented (volumes unvalidated) |
| `/day-trips-from-spain/tarifa/` | Tangier day trip from Tarifa | title ✓ · meta ✓ · H1 ✓ · body ×1 | ferry (13, link); Tangier Ville (3); private guide (1, H2); medina (5, H2); one hour (1) | Implemented (volumes unvalidated) |
| `/day-trips-from-spain/algeciras/` | Tangier day trip from Algeciras | title ✓ · meta ✓ · H1 ✓ · body ×1 | Tanger Med (8); ferry (12, link); transfer (5); private guide (1, H2); medina (3, H2) | Implemented (volumes unvalidated) |
| `/tangier-ferry-guide/` | Tangier day trip with ferry | title ✓ · meta ✓ · H1 ✓ · body ×1 | Tarifa (6, link); Algeciras (3, link); Tanger Med (5); passport (6); Tangier Ville (4) | Implemented (volumes unvalidated) |
<!-- keyword-table:end -->

## 3 ter. Spain-to-Tangier day trips (added 22 October 2026)

Business objective: travellers staying in southern Spain who want a ferry-based day trip to Tangier with a private guide. Verified facts: tours start in Tangier, the agency meets guests at the port and helps buy ferry tickets. **Not verified**: any transport inside Spain, pickups at Tanger Med, ferry ticket included in a price. Pages were therefore created only where the business genuinely operates (ferry arrival ports) and the other cities are handled inside the hub guide.

| URL | Primary keyword | Secondary | Intent | Decision |
|---|---|---|---|---|
| `/` | Tangier day trips from Spain | private tours in Tangier, local guide, Tarifa, ferry, Chefchaouen | commercial | Home H1, title, description and a dedicated section now lead with the Spain day-trip intent |
| `/day-trips-from-spain/` | Tangier day trip from Spain | Tarifa, Algeciras, Marbella, Malaga, Seville, ferry, private guide | commercial / informational hub | Hub guide: how a day trip works, the two ferry ports, road logistics from Marbella, Malaga and Seville (anchored sections, no thin landing pages) |
| `/day-trips-from-spain/tarifa/` | Tangier day trip from Tarifa | Tarifa to Tangier ferry, Tangier Ville, private guide, medina, one hour | commercial | Dedicated page: the real ferry departure port, direct arrival in the city |
| `/day-trips-from-spain/algeciras/` | Tangier day trip from Algeciras | Tanger Med, ferry, transfer, private guide, medina | commercial | Dedicated page: distinct logistics (Tanger Med + transfer, to confirm with the client) |
| `/tangier-ferry-guide/` | Tangier day trip with ferry | Tarifa, Algeciras, Tanger Med, passport, Tangier Ville | informational | Practical guide: routes, ports, checklist, arrival, FAQ |
| `/tours/tangier-walking-tour/` | Tangier walking tour | private city tour, medina, Kasbah, souks, day trip from Spain | commercial | Existing page now also targets "Tangier private city tour" (no duplicate page) |
| Marbella, Malaga, Seville | Tangier day trip from Marbella / Malaga / Seville | — | commercial | **Not created as pages**: no service from these cities; covered as sections of the hub (`#marbella`, `#malaga`, `#seville`). Create pages only if the client confirms pickups or transport from these cities. |
| Tour pages (walking, Cap Spartel, food, Asilah, Chefchaouen) | unchanged | day trip from Spain, ferry, port | — | New "Coming from Spain for the day" block answering start point, ferry, fit, documents and return |

Keyword candidates not assigned (no page justifies them yet): "Tangier day trip price" (no public prices), "Tangier tour with transport included" (not verified), "Seville to Morocco day tour" (no service). All remain unvalidated for search volume.

## 4. French-language keywords (phase 2, not published)

Hypotheses only; to validate before translating: "visite guidée Tanger", "guide privé Tanger", "excursion Chefchaouen depuis Tanger", "excursion Asilah Tanger", "que faire à Tanger", "Tanger en une journée depuis Tarifa", "grottes d'Hercule Cap Spartel visite". The French market reaches Tangier mainly from France and from Spain's Costa del Sol; the existing site already serves Spanish (ES), which suggests Spanish may deserve priority over French. Decide with the client (see `seo-implementation-report.md`, language strategy).

## 5. How to validate this map

1. **Google Search Console** (after launch, 4 to 8 weeks of data): Performance report filtered by page, export queries, compare with the primary/secondary keywords above. Promote queries with impressions but low CTR into titles and descriptions.
2. **Google Keyword Planner** (free with a Google Ads account): enter the primary keywords, location Spain + United Kingdom + United States + Morocco, language English; record monthly volume ranges per keyword in a new "Volume" column here.
3. **Google Trends**: compare "Chefchaouen day trip" vs "Asilah day trip" vs "Tangier tour" over 12 months to confirm seasonality (expected peaks: Easter, July–August, October).
4. **Competitor check**: for each primary keyword, note the first three organic results and whether they are marketplaces or operators; realistic targets are long-tail and local-intent queries where operators already appear.
5. Revisit this file after validation and mark each page's "Validation" line as validated, with the date and the source.

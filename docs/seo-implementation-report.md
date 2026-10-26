# Rassma Tours — SEO implementation report

Date: 20 October 2026. Repository: `rassmatours/`. Related documents: `seo-audit.md` (initial findings), `seo-keyword-map.md`, `seo-content-plan.md`, `seo-url-redirects.md`, `seo-launch-checklist.md`.

## 1. Initial audit (summary)

Full table in `seo-audit.md`. The v1 site already prerendered every page with unique titles and one H1, zero broken links and complete alt text, but: tour URLs lived under `/experiences/`, destinations were anchors on one page, trailing slashes were inconsistent, the canonical domain was a placeholder, `/privacy/` (noindex) was in the sitemap, there was no staging rule, no redirect configuration, fonts came from Google, images were JPEG only without hero preload, structured data was minimal, and the home H1 carried no topical keyword. The predecessor site (tangierbyguide.com) uses `/`, `/tours`, `/about`, `/contact`, which the new URL map preserves.

## 2. Keyword strategy

No keyword tool or API was available, so `seo-keyword-map.md` is a **preliminary** map built from the actual offer and a qualitative review of search results (dominated by marketplaces: Civitatis, Headout, Barceló, ToursByLocals, GoWithGuide). No volumes or difficulty figures are stated. Each indexable page has one primary intent; tour pages target transactional "day trip / tour" queries and destination pages target informational "things to do / distance" queries, cross-linked but not merged. French and Spanish keywords are listed as a phase-2 hypothesis.

## 3. Changes implemented

### URL architecture and redirects
- Routes moved to `/tours/`, `/tours/<slug>/`, `/destinations/<slug>/`; trailing slash everywhere; lowercase. Tour slug `tangier-highlights` renamed `cap-spartel-hercules-caves`.
- Single source of truth `src/routes.ts` (routes, `indexable` flag, `legacyRedirects`) feeding the prerender, the sitemap and `dist/_redirects`.
- 301s: `/experiences*` → `/tours/…`, old slug → new slug, no-slash → slash. Files: `dist/_redirects` (Netlify/Cloudflare), `vercel.json` (Vercel), nginx/Apache snippets in `seo-url-redirects.md`; client-side `Navigate` fallbacks in `src/App.tsx`.
- `scripts/serve.mjs` now behaves like a static host (301 slash, `_redirects`, gzip, cache headers, 404 status) so the build can be verified locally.

### Crawling and indexability
- `robots.txt` generated per environment; `VITE_NOINDEX=true` makes every page `noindex`, disallows crawling and empties the sitemap (staging safety).
- Sitemap lists only indexable routes (17 URLs since the Spain pages), without `lastmod` (the build date is not a content date); `/privacy/` is `noindex`, excluded from the sitemap, and left crawlable so the `noindex` can be read.
- `noindex` pages (`/privacy/`, `404.html`, every page in staging) emit no canonical and no `og:url`.
- `404.html` prerendered; hosts serve it with a 404 status (`_redirects` rule `/* /404.html 404`).
- Build fails when `VITE_SITE_URL` is missing or not an `https://` origin (placeholder domain would otherwise leak into canonicals), except for staging builds (`VITE_NOINDEX=true`).

### Metadata system (`src/lib/head.ts`)
- One `useHead()` call per page: title (brand suffix added), description, canonical, robots (`max-image-preview:large`), Open Graph with image dimensions and alt, Twitter card, optional `hreflang` alternates, hero preload with `imagesrcset`/`imagesizes` (portrait and landscape variants), JSON-LD `@graph`.
- Same data rendered into the static HTML at build and updated on client navigation.
- `scripts/seo-audit.mjs` enforces: unique titles ≤ 65 chars, descriptions ≤ 160, one H1, canonical = route, indexable pages in sitemap, no `noindex` in sitemap, no broken or slash-less internal links, alt and width/height on every `<img>`, parseable JSON-LD.

### Structured data
- Every page: `TravelAgency` (name, URL, phone, email, city, languages, areaServed, TripAdvisor in `sameAs`), `WebSite`, `WebPage`, `BreadcrumbList` (non-home pages).
- Tour pages: `TouristTrip` (name, description, URL, images, languages, provider, itinerary as an `ItemList` of `Place`). No `offers`, no `aggregateRating`, no availability.
- Destination pages: `TouristDestination` with `includesAttraction`.
- `FAQPage` deliberately omitted (no rich result for commercial sites since 2023). `hasMap` is added automatically once `googleBusinessProfileUrl` is set.

### Content
- Home: H1 "Private tours in Tangier, personally guided."; title "Private Tours in Tangier with Local Guides"; tagline kept as the eyebrow.
- Tour pages: per-tour FAQs (3 each), "What comes with it" (only verified inclusions: private guide, private vehicle for driving tours), meeting point (to confirm), start-time note, keyword-aligned titles and descriptions, link to "Things to do in <destination>".
- Three new destination pages with places, practical context (access from Spain, airport and train, distances, time needed, season), FAQs, tours and cross-links; destinations index lists tours by destination.
- Navigation label "Experiences" → "Tours" (matches query language and the old site).

### Images
- All 51 masters now have 600/900/1400 px variants and WebP versions (`scripts/image-variants.sh`); `SmartImage` renders `<picture>` with WebP sources, JPEG fallback, explicit width/height, lazy loading except hero, `fetchpriority="high"` on the hero, portrait art direction on the home hero.
- Image folder: 191 JPEG + 191 WebP (54 MB on disk; a page downloads only the size it needs).
- Image sitemap: not created (placeholder images); revisit with original photography.

### Scroll-driven video (home page)
- `src/components/ScrollVideo.tsx`: a tall section with a sticky frame; the video's playback position follows the scroll progress (smoothed with `requestAnimationFrame`), three captions step through, a progress line shows where you are. The MP4 (`public/video/`, Pexels licence, 8.5 s, keyframe every 6 frames) is requested only when the section is one viewport away (`preload="none"`, then `load()` on intersection); a 768 px variant serves narrow screens; the poster is the fallback without JavaScript or with reduced motion. Hosting requirement: the server must honour HTTP `Range` requests (all common static hosts do; the preview server was fixed to do so).

### Fonts and loading
- Google Fonts replaced by self-hosted woff2 (`public/fonts/`, 18 files, latin + latin-ext, OFL), `font-display: swap`, the two first-screen files preloaded. No third-party request on first load.
- Cache headers for `/assets/`, `/fonts/`, `/images/` in `public/_headers` and `vercel.json`.

### Analytics and conversions (`src/lib/analytics.ts`, `ConsentBanner.tsx`)
- GA4 optional via `VITE_GA4_ID`; loaded only after an explicit "Accept" in a consent banner (choice stored locally; nothing loads before). No measurement ID in the repository.
- Events: `page_view` on route change, `whatsapp_click`, `email_click`, `phone_click`, `cta_click` (buttons marked `data-cta`), and `generate_lead` **only** on a sent request (HTTP form success, or clicking "Send via WhatsApp"/"Send by email" on the prepared request). Opening the form is not counted.

### Language architecture
- `siteConfig.locales` and `alternates` in `useHead` are in place; no `hreflang` is emitted while only English exists. Adding French or Spanish means duplicated data files under a `/fr/` or `/es/` prefix, human-translated; see README.

### Keyword implementation (on-page)
- `scripts/seo-keywords.json` is the single source of the primary and secondary keywords per indexable page; `scripts/seo-keywords-check.mjs` verifies them against the built HTML and regenerates the implementation table in `seo-keyword-map.md` §3 bis.
- Every indexable page: primary keyword in the title, the meta description, the H1 and the intro or first paragraph; secondary keywords in H2 headings (section headings are now descriptive: "Guided tours in Tangier and excursions from the city", "Your Chefchaouen day trip itinerary", "What to see in Tangier"…), in body copy, in image alt text (place names) and in anchors (tour cards link with "See the Asilah day trip", footer and destination links use the tour headlines).
- Tour data gained `headline` (H1 and card title) and `ref` (short designation used in H2s, FAQ titles and anchors); destination data gained `h1`. Only the Cap Spartel tour has a headline different from its published name, which is kept everywhere else (intro, form, WhatsApp message, schema `name`, with `alternateName`).
- Last check: 13/13 pages have the primary keyword in title, meta, H1 and body; 64/65 secondary keywords appear in the body (the About page lacks "hospitality" as a literal word).

**Implemented vs awaiting validation**
- Implemented: all on-page elements above, titles ≤ 65 characters, descriptions ≤ 160, one H1 per page, descriptive URLs, redirects.
- Awaiting validation: the search demand behind each keyword (no volume tool available), the French/Spanish keyword set, and the client's approval of the Cap Spartel headline and of the meeting-point wording.

### Spain-to-Tangier day trips (22 October 2026)
- New hub `/day-trips-from-spain/` (how a day trip works, ferry ports, road logistics from Marbella, Malaga and Seville as anchored sections, tours that fit, FAQ), two departure-port pages `/day-trips-from-spain/tarifa/` and `/day-trips-from-spain/algeciras/`, and a practical `/tangier-ferry-guide/`. Data in `src/data/spain.ts`; pages `SpainDayTrips.tsx`, `SpainCity.tsx`, `FerryGuide.tsx`; component `SpainNotes.tsx` on every tour page.
- Home page re-targeted to "Tangier day trips from Spain" (title, H1, description, new section with the two port pages and the ferry guide); "From Spain" added to the main navigation and footer; contact page links to the hub.
- Only facts published by the business are stated as services (meeting at the port, ferry ticket help, port accompaniment, private tours). Crossing and road times are labelled approximate; no schedules, fares or operators are named; the ferry ticket is explicitly outside the tour price unless the quote says otherwise.
- City pages for Marbella, Malaga and Seville were **not** created (no service from these cities): they are sections of the hub, flagged for the client.

## 4. Files created or modified

- Created: `src/pages/DestinationDetail.tsx`, `src/pages/Tours.tsx` (renamed from `Experiences.tsx`), `src/lib/analytics.ts`, `src/lib/images.ts`, `src/components/ConsentBanner.tsx`, `src/styles/fonts.css`, `public/fonts/*`, `public/_headers`, `vercel.json`, `scripts/seo-audit.mjs`, `scripts/fetch-fonts.py`, `scripts/image-variants.sh`, `docs/*.md`.
- Modified: `src/lib/head.ts` (rewritten), `src/routes.ts`, `src/App.tsx`, `src/data/site.ts`, `src/data/tours.ts`, `src/data/destinations.ts`, `src/pages/*` (metadata, breadcrumbs, content), `src/components/SmartImage.tsx`, `Faq.tsx`, `Header.tsx`, `Footer.tsx`, `Layout.tsx`, `InquiryForm.tsx`, `CtaBand.tsx`, `index.html`, `scripts/prerender.mjs`, `scripts/serve.mjs`, `.env.example`, `README.md`, `research/CLIENT_VALIDATION.md`, `research/TEST_REPORT.md`, `research/image-catalog.md`.

## 5. Test results

Environment: Windows 11, Node 24, Chrome 141 headless for Lighthouse 12.8, static preview server with gzip.

| Check | Method | Result |
|---|---|---|
| Types, lint, build | `tsc -b`, `oxlint`, `npm run build` | **Passed**: 0 errors, 0 warnings; 14 pages + 404, sitemap 13 URLs, robots, `_redirects` |
| Metadata and canonical per page | `node scripts/seo-audit.mjs` on `dist/` | **Passed**: 15 HTML files, unique titles/descriptions within limits, 1 H1 each, canonical = route, `/privacy/` and `404.html` noindex and out of sitemap |
| Keyword implementation | `node scripts/seo-keywords-check.mjs` on `dist/` | **Passed**: primary keyword in title, meta, H1 and body on 17/17 indexable pages (13 original + 4 Spain pages); ≥ 4 of 5 secondary keywords in the body of every page; table regenerated in `seo-keyword-map.md` |
| Internal links | same | **Passed**: 485 internal links, 0 broken, all with trailing slash; no orphan page (every route is linked from header, footer or hub pages) |
| Images | same | **Passed**: 102 `<img>`, 0 without alt, 0 without width/height |
| Sitemap and robots | `curl`, inspection | **Passed**: valid XML, 13 absolute URLs, robots allows all and references the sitemap |
| HTTP status and redirects | `curl` against `npm run preview` | **Passed**: `/about`→301→`/about/`; `/experiences`, `/experiences/<slug>`, `/experiences/tangier-highlights`, `/tours/tangier-highlights` → 301 to the new URLs (no chains); unknown path → 404; sitemap/robots 200 |
| Initial HTML contains content | inspection of `dist/**/index.html` | **Passed**: full page text, headings, links and JSON-LD present without JavaScript |
| Hydration in production | fresh browser tab on `/`, `/destinations/tangier/`, `/tours/tangier-walking-tour/`, client navigation to `/tours/` | **Passed**: no console messages, no hydration error, canonical/title/JSON-LD update on navigation |
| Structured data | JSON parse in audit script; graph inspected on a tour page (`TravelAgency`, `WebSite`, `WebPage`, `BreadcrumbList`, `TouristTrip`) | **Passed locally**. **Not completed**: Google Rich Results Test and Schema Markup Validator require a public URL; run them after deployment (https://search.google.com/test/rich-results, https://validator.schema.org/) and paste the HTML of `dist/tours/chefchaouen-day-trip/index.html` for a pre-launch check |
| Responsive behaviour | browser at 375 px and 1280 px (earlier QA), narrow pane for new pages | **Passed**: no horizontal overflow; portrait hero source selected on narrow portrait viewports |
| Accessibility | Lighthouse accessibility + manual | **Passed**: 100 on home; `dl` and link-name issues found on tour/destination pages were fixed (see §6 for the re-run) |
| Redirect loops | static server logic + curl | **Passed**: slash redirect only when a directory index exists; redirect targets are final URLs |
| Lighthouse | see §6 | lab data only |

## 6. Performance (Lighthouse 12.8, lab data)

**No field data exists** (the site is not live); these are laboratory measurements on a local static server with simulated throttling (mobile: slow 4G, 4× CPU slowdown).

First pass, before enabling gzip on the test server (uncompressed JS/CSS, which no real host does):

| Page | Form factor | Performance | LCP | CLS | TBT | FCP |
|---|---|---|---|---|---|---|
| Home | desktop | 95 | 1.3 s | 0.018 | 0 ms | 0.9 s |
| Home | mobile | 66 | 6.2 s | 0.003 | 0 ms | 4.7 s |
| Tour (Chefchaouen) | mobile | 65 | 6.6 s | 0 | 0 ms | 4.7 s |
| Destination (Tangier) | mobile | 68 | 5.6 s | 0 | 0 ms | 4.7 s |

Diagnosis: `uses-text-compression` (345 KiB) and render-blocking CSS explained most of the mobile FCP/LCP; `uses-responsive-images` flagged the 900 px floor of the srcset; `unused-javascript` flagged the single bundle (192 KiB). Fixes applied: gzip on the preview server (production hosts compress by default), 600 and 1400 px variants, hero preload with full srcset.

Second pass (gzip, new variants): see table below.

| Page | Form factor | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | FCP |
|---|---|---|---|---|---|---|---|---|---|
| Home | desktop | 100 | 100 | 100 | 100 | 0.5 s | 0.021 | 0 ms | 0.4 s |
| Home | mobile | 84 | 100 | 100 | 100 | 3.9 s | 0.003 | 0 ms | 2.7 s |
| Tour (Chefchaouen) | mobile | 84 | 100 | 100 | 100 | 3.8 s | 0 | 0 ms | 2.7 s |
| Destination (Tangier) | mobile | 86 | 100 | 100 | 100 | 3.6 s | 0 | 0 ms | 2.7 s |

HTML reports: `docs/lighthouse/*.report.html`.

Reading: CLS and TBT are at zero on every page, so layout stability and interactivity (INP proxy) are not a concern. LCP on mobile is driven by network transfer under simulated slow 4G; on a real host with Brotli and a CDN the lab figure will be lower, but the 2.5 s target on mobile should be confirmed with field data after launch.

Remaining performance levers (not implemented, by priority):
1. Route-level code splitting (`React.lazy`) to cut the 115 kB gzip bundle on first load; needs care with hydration of prerendered pages.
2. Lower WebP quality for gallery thumbnails (75) and a 400 px variant for the small destination thumbnails.
3. Brotli at the host; HTTP/2 or HTTP/3.
4. Replacing the placeholder photography with optimised originals exported at the exact widths.

## 7. Remaining issues and external setup required

| Item | Owner | Blocking |
|---|---|---|
| Production domain: `rassmatours.com` is not registered; only tangierbyguide.com is live. Set `VITE_SITE_URL` accordingly before building. | Client | **Yes** |
| Legal notice page content (company name, registration, licence, address). | Client | **Yes** |
| Host redirects (HTTPS, preferred host, trailing slash) and `www` → apex on the current host. | Developer at deployment | Yes |
| Google Search Console verification and sitemap submission (not done). | Client / developer | After launch |
| Google Business Profile claim; paste URL into `googleBusinessProfileUrl`. | Client | After launch |
| GA4 property and `VITE_GA4_ID` (optional). | Client | No |
| Form endpoint `VITE_INQUIRY_ENDPOINT` (optional; WhatsApp/email flow works without it). | Client | No |
| Rich Results Test / Schema validator on the public URL. | Developer | After launch |
| Verified content: prices, inclusions, meeting point, testimonials, founding facts, original photos, TripAdvisor listing name. | Client | For quality, not for launch |
| Second language (ES or FR), human translation. | Client | No |
| Keyword volumes: validate the map with Keyword Planner and Search Console. | SEO | After launch |

## 8. Recommended post-launch actions

See `seo-launch-checklist.md` §7: index coverage in week 1, query review in weeks 2–4, original photography and first editorial piece in months 2–3, quarterly Lighthouse and audit-script runs, and a keyword-map review once Search Console has data. No ranking outcome is promised; the foundation (crawlable static HTML, clean URLs, unique intent per page, verified structured data, measurable conversions) is in place.

# Rassma Tours — Search Console, analytics and local SEO launch checklist

Nothing in this list has been done yet: no domain is verified, no sitemap submitted, no analytics property created. Each step needs the client's accounts.

## 1. Before deploying

- [ ] Decide the production domain and preferred host (apex or www). Set `VITE_SITE_URL=https://<domain>` in the build environment.
- [ ] Make sure `VITE_NOINDEX` is **unset** for production (and `true` for any staging build).
- [ ] Run `npm run build` and `node scripts/seo-audit.mjs`: zero issues expected.
- [ ] Configure host redirects (HTTPS, preferred host, trailing slash, `_redirects` / `vercel.json`), see `seo-url-redirects.md`.
- [ ] Provide the legal notice content (launch blocker in most jurisdictions).

## 2. Google Search Console

1. Open https://search.google.com/search-console and add a **Domain** property for the production domain (covers http/https, www/apex).
2. Verify via a DNS TXT record at the registrar (the "Domain" property only supports DNS verification). Alternative: a URL-prefix property verified with an HTML file placed in `public/` or a meta tag added to `index.html`.
3. Submit the sitemap: `https://<domain>/sitemap.xml` (Sitemaps section). Expect 17 URLs.
4. Use **URL Inspection** on `/`, `/tours/`, each tour, and `/destinations/chefchaouen/`: check "URL is on Google" after a few days, and "Test live URL" immediately to confirm the page is crawlable and the canonical is the expected one.
5. If migrating from tangierbyguide.com to a new domain: verify both, keep the old one's redirects live for at least a year, and use **Settings → Change of address** on the old property.
6. Review the **Pages** (indexing) report weekly for the first two months: "Excluded by noindex", "Duplicate without user-selected canonical", "Not found (404)" and "Redirect error" should all be empty except `/privacy/`.

## 3. Monitoring search performance

- **Performance → Search results**: filter by page to compare the page map in `seo-keyword-map.md` with real queries. Metrics: clicks, impressions, CTR, average position.
- Monthly routine: export the top 200 queries; add new relevant queries to the keyword map; rewrite titles/descriptions for pages with high impressions and CTR under 2 %; expand pages that rank between positions 8 and 20 for a relevant query.
- **Core Web Vitals** report (field data from Chrome users) appears once the site has enough traffic; until then rely on Lighthouse lab data (see the implementation report).
- **Enhancements**: Breadcrumbs should appear as a valid item type. No other rich result type is expected.

## 4. Google Analytics 4 (optional, client's decision)

1. Create a GA4 property and a Web data stream for the domain; copy the Measurement ID (`G-XXXXXXX`).
2. Set `VITE_GA4_ID=G-XXXXXXX` in the build environment and rebuild. Nothing loads until a visitor accepts the consent banner; the choice is stored in `localStorage` (`rt-consent`).
3. Events sent by the site (see `src/lib/analytics.ts`):

| Event | When | Parameters |
|---|---|---|
| `page_view` | first page after consent, then each route change (the `config` call sends none, to avoid double counting; in GA4 → Data stream → Enhanced measurement, turn off "Page changes based on browser history events") | `page_location`, `page_title` |
| `whatsapp_click` | any wa.me link (header, floating button, footer, tour page, contact, prepared request) | `page`, `label` |
| `email_click` | any `mailto:` link | `page` |
| `phone_click` | any `tel:` link | `page` |
| `cta_click` | buttons marked `data-cta` (hero, header, CTA band, tour "Request this experience", custom tour) | `page`, `label` |
| `generate_lead` | **only** when a request is actually sent: HTTP form submission succeeds, or the visitor clicks "Send via WhatsApp" / "Send by email" on the prepared request | `method` = form, whatsapp, email; `tour` |

4. In GA4 → Admin → Events, mark `generate_lead` as a **conversion** (key event). Optionally also `whatsapp_click`. Do not mark `cta_click` as a conversion: opening the form is not an inquiry.
5. Link GA4 to Search Console (Admin → Product links) to see organic landing pages with conversions.
6. Google Tag Manager is not needed for this setup. If the client later wants Meta pixel or call tracking, replace `loadGa4()` with a GTM container loaded under the same consent gate and keep `trackEvent` pushing to `dataLayer`.

## 5. Conversion tracking without GA4

Even with analytics disabled, inquiries arrive through WhatsApp (pre-filled message starts with "Hello Rassma Tours, I would like to plan a trip"), email (subject "Trip inquiry: …") or the HTTP endpoint. Counting them weekly in a spreadsheet gives a reliable baseline.

## 6. Local SEO and Google Business Profile

Rassma Tours operates as a **service-area business**: it meets guests at hotels, the port or the ferry terminal and does not publish a shop address. Do not invent a storefront.

- [ ] Claim or create the Google Business Profile at https://business.google.com with the business name **Rassma Tours** (consistent with the site), category "Tour operator" (secondary: "Tour agency", "Sightseeing tour agency"), service areas Tangier, Asilah, Chefchaouen, phone `+212 658-313411`, website URL, hours as published on the site.
- [ ] Verification will likely require a video or postcard; keep the address private (service-area setting).
- [ ] Add the five tours as **Services**, upload original photos, write a description from the About page, enable messaging, and answer reviews.
- [ ] Paste the profile's public URL into `googleBusinessProfileUrl` in `src/data/site.ts`: the footer link and the `hasMap` property in the structured data activate automatically.
- [ ] Keep **name, phone and website identical** everywhere (NAP consistency): TripAdvisor (rename or confirm the "Tangier Discovery Tours" listing), GetYourGuide/Viator if used, Facebook/Instagram, Visit Morocco / Office National Marocain du Tourisme directories, local hotel concierge partners.
- [ ] Ask satisfied guests for Google and TripAdvisor reviews with a direct link; respond to all of them.
- [ ] Structured data already states `TravelAgency` with city, phone and email only; add `address` street fields only if the client wants a public address.

## 7. Post-launch actions (first 90 days)

1. Week 1: confirm indexing of all 17 URLs, fix any crawl error, check the redirect from the old site.
2. Week 2–4: collect first Search Console queries; adjust titles where impressions exist without clicks.
3. Month 2: replace placeholder photos with original ones (file names already descriptive; add alt text in `src/data/images.ts`); then consider an image sitemap.
4. Month 2–3: publish one editorial piece from `seo-content-plan.md` with original photography; add verified testimonials and prices if the client agrees.
5. Quarterly: Lighthouse run, broken-link check (`node scripts/seo-audit.mjs` after a build), review of the keyword map.

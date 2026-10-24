# Rassma Tours — SEO audit of the v1 site (before implementation)

Date: 20 October 2026. Scope: the repository in `rassmatours/` as delivered after the first build, plus the live predecessor site tangierbyguide.com.

## 1. Stack and rendering

- Vite 8 + React 19 + TypeScript + Tailwind 4, React Router 7, custom build-time prerender (`scripts/prerender.mjs`) producing one `index.html` per route; client hydrates. No server runtime, deployable to any static host.
- 11 routes prerendered; all page text present in the initial HTML (verified by reading `dist/*/index.html`), so indexing does not depend on JavaScript execution.
- Fonts loaded from Google Fonts (third-party, render-blocking CSS); images JPEG only, `srcset` 900/1800, width/height set, lazy-loaded except hero; hero not preloaded.
- No analytics, no cookies, no consent mechanism.
- Dev and preview servers in `.claude/launch.json`; no hosting configuration (redirects, headers) in the repo.

## 2. Findings per area

| Area | Finding | Severity | Decision |
|---|---|---|---|
| URLs | `/experiences/<slug>` for tours; destinations as anchors on one page (`/destinations#chefchaouen`); mixed trailing slashes in internal links; the predecessor site uses `/tours`, `/about`, `/contact`. | High | Move to `/tours/…`, create real destination pages, enforce trailing slashes, 301 old paths. |
| Canonical domain | Placeholder `https://rassmatours.com` (does not resolve). Only tangierbyguide.com is live. | Launch blocker | Keep env-driven `VITE_SITE_URL`, warn at build, document in redirect strategy; client decision. |
| Metadata | Unique titles and descriptions on all pages, but 2 descriptions > 160 chars and no `og:image` dimensions, no Twitter title/description, no `og:locale`. | Medium | Length limits enforced by the audit script; metadata system extended. |
| Headings | One H1 per page (good). Home H1 was the brand tagline with no topical keyword. | Medium | H1 now carries "Private tours in Tangier". |
| Indexability | `/privacy/` correctly `noindex`, but still listed in the sitemap. No staging rule: a preview deployment would be indexable. | Medium | Sitemap limited to indexable routes; `VITE_NOINDEX` for staging; robots.txt per environment. |
| Structured data | `TravelAgency` on home only, `BreadcrumbList` on tours only, no `WebSite`/`WebPage`, no `TouristTrip`. | Low | `@graph` on every page with verified data only. |
| Internal linking | Good hub links; destination anchors not crawlable as pages; footer labelled "Experiences". | Medium | Destination pages, "Tours" naming, cross-links tour ↔ destination ↔ other destinations. |
| Links | 0 broken internal links. | — | Kept; audit script now checks after each build. |
| Images | 0 missing alt, 0 missing dimensions. JPEG only (24 MB folder), hero not preloaded, no portrait art direction on destination/tour heroes. | Medium | WebP for all images (16 MB), `<picture>`, hero `preload` with `imagesrcset`, portrait source on the home hero. |
| Fonts | Google Fonts CSS on the critical path (two external origins). | Medium | Self-hosted woff2, two files preloaded, `font-display: swap`. |
| 404 | Prerendered `404.html`; `vite preview` served the home page for nested paths (a dev-only issue). | Low | Static server rewritten to mimic a real host (301 slash, 404 status). |
| Redirects | None defined. | High | `_redirects`, `vercel.json`, nginx/Apache snippets, client fallbacks. |
| Content | Tour pages: verified summary + editorial story; no FAQ per tour, no "included", no meeting point; food tour very thin at source. Destinations: short. | Medium | Per-tour FAQs, included list (verified items only), meeting point (to confirm), destination pages with practical context. |
| Analytics | Nothing. | Medium | Consent-gated GA4 with conversion events. |
| Predecessor site | tangierbyguide.com: `www.` not redirected to apex; direct requests to `/tours`, `/about`, `/contact` return 404 (SPA); same four indexable URLs as the new site. | High for migration | 1:1 mapping; host-level fixes documented. |

## 3. Priorities

1. **Launch blockers:** production domain decision; legal notice content; host redirect rules.
2. **High impact, done in code:** URL restructure with 301s, destination pages, metadata and structured data system, staging `noindex`, image and font performance.
3. **Medium:** content enrichment (FAQs, included, practical info), analytics and conversion events.
4. **Later, needs client input:** prices, original photography, verified reviews, second language.

Implementation details and test results: `seo-implementation-report.md`.

# Rassma Tours — URL architecture and redirect strategy

## 1. Conventions

- Lowercase paths, hyphens, **trailing slash** on every page (`/tours/`, `/tours/asilah-day-trip/`). The root is `/`.
- One canonical URL per page, absolute, on the production domain (`VITE_SITE_URL`). Query strings (`/contact/?tour=…`) never change the canonical.
- No `index.html` in URLs, no uppercase, no `.html` extensions, no hash-only pages (destination anchors were replaced by real pages).

## 2. URL map

| URL | Page |
|---|---|
| `/` | Home |
| `/tours/` | Tours index |
| `/tours/tangier-walking-tour/` | Tour |
| `/tours/cap-spartel-hercules-caves/` | Tour (formerly `tangier-highlights`) |
| `/tours/asilah-day-trip/` | Tour |
| `/tours/chefchaouen-day-trip/` | Tour |
| `/tours/tangier-food-tour/` | Tour |
| `/destinations/` | Destinations index |
| `/destinations/tangier/`, `/destinations/asilah/`, `/destinations/chefchaouen/` | Destination pages |
| `/about/`, `/contact/` | About, Plan your trip |
| `/privacy/` | Privacy (`noindex`, not in sitemap; not disallowed in robots.txt, so crawlers can read the `noindex`) |
| `/404.html` | Served with a 404 status for unknown paths |

All routes are defined once in `src/routes.ts`, which feeds the prerender, the sitemap and the redirect files.

## 3. Does this replace an indexed site?

The only live site is **tangierbyguide.com** (HTTP 200; `http://` redirects to `https://` with a 301; `www.` answers 200 without redirecting to the apex, which should be fixed at the host). Its indexable URLs are `/`, `/tours`, `/about`, `/contact` (the sitemap lists exactly these; direct requests to the last three currently return a server 404 because the old site is a client-side app).

- If the new site launches on **tangierbyguide.com**: the old paths map 1:1 to `/`, `/tours/`, `/about/`, `/contact/`. Only the trailing-slash 301s are needed; nothing of value is lost.
- If it launches on a **new domain** (`rassmatours.com` or other: none of `rassmatours.com`, `www.rassmatours.com`, `rassma-tours.com` resolved on 20 Oct 2026): keep tangierbyguide.com alive and 301 every old URL to the equivalent new URL (`/tours` → `https://newdomain/tours/`, etc.), then use the Search Console "Change of address" tool. Never redirect everything to the homepage.

## 4. Redirects implemented in the repository

Generated at build time from `legacyRedirects` in `src/routes.ts`:

| From | To | Type |
|---|---|---|
| `/experiences`, `/experiences/` | `/tours/` | 301 |
| `/experiences/<slug>` | `/tours/<slug>/` | 301 |
| `/experiences/tangier-highlights`, `/tours/tangier-highlights` | `/tours/cap-spartel-hercules-caves/` | 301 |
| `/about`, `/tours`, … (no trailing slash) | same path with `/` | 301 (host-level; the dev static server does it too) |
| unknown path | `/404.html` | 404 |

Files: `dist/_redirects` (Netlify and Cloudflare Pages), `vercel.json` (Vercel, with `trailingSlash: true`). Client-side fallbacks for `/experiences/*` and the old tour slug also exist in `src/App.tsx` so that stale links work even before host redirects are configured, but the host-level 301 is the one search engines need.

## 5. Host configuration to add at deployment

**HTTPS and preferred host** (choose apex or www once, then redirect the other):

```
# nginx
server { listen 80; server_name example.com www.example.com; return 301 https://example.com$request_uri; }
server { listen 443 ssl; server_name www.example.com; return 301 https://example.com$request_uri; }
server {
  listen 443 ssl; server_name example.com; root /var/www/dist;
  location / { try_files $uri $uri/index.html @slash; }
  location @slash { if ($uri !~ /$) { return 301 $uri/; } return 404; }
  error_page 404 /404.html;
  location ~* ^/(assets|fonts)/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
}
```

```
# Apache .htaccess
RewriteEngine On
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^www\. [NC]
RewriteRule ^ https://example.com%{REQUEST_URI} [L,R=301]
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_URI} !/$
RewriteRule ^(.*)$ /$1/ [L,R=301]
ErrorDocument 404 /404.html
RedirectMatch 301 ^/experiences/?$ /tours/
RedirectMatch 301 ^/experiences/([^/]+)/?$ /tours/$1/
```

Netlify and Vercel apply HTTPS and the `_redirects` / `vercel.json` rules automatically; set the primary domain in their dashboard so the other hostname 301s to it.

## 6. Rules

- No redirect chains: redirect targets are always final canonical URLs (with trailing slash, on the preferred host).
- No redirect loops: the static server and the host rules only add a slash when a directory index exists.
- Never launch with `VITE_SITE_URL` unset: the build prints a warning and uses the placeholder `https://rassmatours.com`, which would produce wrong canonicals and a wrong sitemap.
- Staging: build with `VITE_NOINDEX=true` (all pages `noindex`, `robots.txt` disallows everything, empty sitemap) and protect the host with HTTP auth if possible.

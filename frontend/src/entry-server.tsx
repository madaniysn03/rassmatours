import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { HeadContext, NOINDEX_ALL, renderHeadTags, type HeadData } from './lib/head'
import { legacyRedirects, staticPaths } from './routes'
import { siteConfig } from './data/site'

export { staticPaths, legacyRedirects, siteConfig }

/**
 * Variables de build telles que Vite les a résolues (.env, .env.production, environnement du shell) :
 * le prérendu s’y fie plutôt qu’à process.env, pour que pages, robots.txt et sitemap concordent.
 */
export const buildEnv = {
  siteUrl: ((import.meta.env.VITE_SITE_URL as string | undefined) ?? '').trim(),
  noindexAll: NOINDEX_ALL,
}

/** Rend une URL en HTML statique et renvoie aussi les balises <head> de la page. */
export function render(url: string) {
  let collected: HeadData | null = null
  const collect = (data: HeadData) => {
    collected = data
  }
  const html = renderToString(
    <StrictMode>
      <HeadContext.Provider value={collect}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadContext.Provider>
    </StrictMode>,
  )
  const head = collected ? renderHeadTags(collected) : `<title>${siteConfig.brand.name}</title>`
  return { html, head }
}

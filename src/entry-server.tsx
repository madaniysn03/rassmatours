import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { HeadContext, renderHeadTags, type HeadData } from './lib/head'
import { legacyRedirects, staticPaths } from './routes'
import { siteConfig } from './data/site'

export { staticPaths, legacyRedirects, siteConfig }

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

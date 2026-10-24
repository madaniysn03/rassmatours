import { siteConfig } from '../data/site'
import { useHead } from '../lib/head'

/**
 * Notice de confidentialité factuelle : le site ne pose aucun cookie et ne stocke rien côté serveur
 * tant qu’aucun service d’envoi n’est branché. Les mentions légales (raison sociale, registre)
 * sont à fournir par le client ; voir research/CLIENT_VALIDATION.md.
 */
export function Privacy() {
  useHead({
    title: 'Privacy',
    description: 'How Rassma Tours handles the information you share when you contact us.',
    path: '/privacy/',
    noindex: true,
  })

  return (
    <section className="pt-36 pb-24 lg:pt-44 lg:pb-32">
      <div className="wrap-narrow prose-editorial">
        <span className="eyebrow mb-5">Privacy</span>
        <h1 className="display-md">How we handle your information</h1>
        <p className="mt-8">
          This website sets no cookies and loads no trackers by default. Fonts are served from our own domain. If audience
          measurement (Google Analytics) is enabled, it is only loaded after you accept it in the banner shown at the bottom
          of the page, and you can decline it without losing any feature.
        </p>
        <p>
          When you contact us through the inquiry form, the details you enter (name, email, phone number, travel dates,
          number of travellers and your message) are used only to answer your request and to organise your tour. Depending
          on the option you choose, they are sent to us through WhatsApp, by email, or through the sending service connected
          to the form. We do not sell or share them with anyone else.
        </p>
        <p>
          You can ask us at any time to correct or delete the information we hold about you by writing to{' '}
          <a href={`mailto:${siteConfig.contact.email}`} className="underline underline-offset-4">
            {siteConfig.contact.email}
          </a>
          .
        </p>
        <p>
          {siteConfig.brand.name}, {siteConfig.contact.city}, {siteConfig.contact.country}.
        </p>
      </div>
    </section>
  )
}

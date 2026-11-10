/**
 * Configuration du site Rassma Tours.
 * Toute donnée commerciale provient du site existant tangierbyguide.com
 * (consulté le 20/10/2026) ; voir research/CLIENT_VALIDATION.md pour ce qui reste à confirmer.
 */
export const siteConfig = {
  lang: 'en',
  /**
   * Langues publiées. Une seule aujourd’hui : aucun hreflang n’est émis.
   * Pour ajouter le français : { code: 'fr', prefix: '/fr' } + données traduites (voir docs/seo-implementation-report.md).
   */
  locales: [{ code: 'en', prefix: '' }] as { code: string; prefix: string }[],
  brand: {
    name: 'Rassma Tours',
    /** Signature : direction créative à affiner avec le client. */
    tagline: 'Rassma Tours… it’s more than just a tour.',
    /** Logo complet sur fond ivoire (données structurées). Versions détourées dans public/images/brand/logo-*. */
    logo: '/images/brand/logo-full-ivory-bg.png',
  },
  /**
   * URL publique, sans slash final : canonical, sitemap, Open Graph, données structurées.
   * Placeholder tant que le domaine n’est pas confirmé (voir docs/seo-url-redirects.md).
   */
  url: ((import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://rassmatours.com').replace(/\/$/, ''),
  contact: {
    /** Numéro affiché sur tangierbyguide.com (téléphone et WhatsApp). */
    phoneDisplay: '+212 658-313411',
    phoneE164: '+212658313411',
    whatsappNumber: '212658313411',
    email: 'tangierbyguide@gmail.com',
    city: 'Tangier',
    country: 'Morocco',
    /** Horaires publiés sur la page Contact du site existant. */
    hours: [
      { days: 'Monday to Friday', time: '8:00 – 20:00' },
      { days: 'Saturday', time: '9:00 – 19:00' },
      { days: 'Sunday', time: '9:00 – 17:00' },
    ],
    responseTime: 'We usually reply within 24 hours.',
    /** Point de rendez-vous : convenu à la réservation (hôtel, port, terminal ferry). À confirmer par le client. */
    meetingPoint: 'Agreed when you book: your hotel in Tangier, the port or the ferry terminal.',
  },
  /**
   * Fiche TripAdvisor : masquée à la demande du client (novembre 2026). Ancienne fiche liée depuis le site existant :
   * https://www.tripadvisor.com/Attraction_Review-g293737-d17702022-Reviews-Tangier_Discovery_Tours-Tangier_Tanger_Tetouan_Al_Hoceima.html
   * Renseigner l’URL ici pour réafficher les liens (avis, pied de page, données structurées).
   */
  tripadvisorUrl: null as string | null,
  /** Fiche Google Business Profile : à renseigner une fois vérifiée (lien « hasMap » et pied de page). */
  googleBusinessProfileUrl: null as string | null,
  /** Réseaux sociaux : aucun lien vérifié (le site existant affiche des icônes sans URL). */
  social: [] as { label: string; href: string }[],
  languages: ['English', 'French', 'Spanish', 'Arabic'],
  nav: [
    { label: 'Tours', href: '/tours/' },
    { label: 'From Spain', href: '/day-trips-from-spain/' },
    { label: 'Destinations', href: '/destinations/' },
    { label: 'About', href: '/about/' },
    { label: 'FAQ', href: '/faq/' },
    { label: 'Contact', href: '/contact/' },
  ],
  seo: {
    /** Données structurées limitées aux informations vérifiées (nom, téléphone, e-mail, ville). */
    enableStructuredData: true,
  },
}

export type SiteConfig = typeof siteConfig

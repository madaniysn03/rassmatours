/**
 * Questions fréquentes. `spainFaq` et la question sur la monnaie sont le texte fourni par le client
 * (novembre 2026), légèrement corrigé ; les autres reprennent la page Contact du site existant.
 */
export type FaqItem = { question: string; answer: string }

/** Venir d’Espagne : texte du client. */
export const spainFaq: FaqItem[] = [
  {
    question: 'We are in southern Spain. Can we do a day trip to Tangier, Morocco?',
    answer:
      'Yes, a day trip to Tangier can be done from all cities in southern Spain. “The day we spent in Tangier was the best day of the entire holiday” is what we always hear from our guests.',
  },
  {
    question: 'How can we get to Tangier from southern Spain?',
    answer:
      'The best way to make it from southern Spain is to take a ferry from Tarifa to the Tangier city port. We can help you choose the best ferry schedule for your time and your tour.',
  },
  {
    question: 'Where is Tarifa located in southern Spain?',
    answer:
      'Tarifa is a coastal town in the province of Cádiz, Andalusia, at the southernmost tip of the Iberian Peninsula. It is famous for windsurfing and for the ferries crossing to Tangier.',
  },
  {
    question: 'Where is Tangier located?',
    answer:
      'Tangier is a major port city in northwestern Morocco, on the coast where the Mediterranean Sea meets the Atlantic Ocean along the Strait of Gibraltar. It is only 20 miles from Tarifa, in southern Spain.',
  },
  {
    question: 'How long does the ferry from Tarifa to Tangier take?',
    answer: 'Only one hour: the ferry from Tarifa brings you straight to the Tangier city port.',
  },
  {
    question: 'Do we need a visa to cross to Tangier?',
    answer:
      'Morocco is visa-free for most nationalities for stays of up to 90 days. Holders of passports from the UK, Ireland, the USA, Canada, Australia, New Zealand, European countries and many others do not need a visa to enter Morocco: only a valid passport is required.',
  },
  {
    question: 'Can Rassma Tours book ferry tickets for me?',
    answer: 'Yes. We can either help you find the best ferry schedule or buy the ferry tickets for your trip.',
  },
  {
    question: 'Can you arrange transfers from our accommodation to Tarifa port and back again when we return to Spain?',
    answer:
      'Yes, with great pleasure. We have worked with trusted transport companies in southern Spain for many years, so we can take care of all the logistics in Spain and Morocco and make your tour door to door.',
  },
]

/** Questions pratiques. */
/** Réponse propre à Tangier : retirée des excursions (Asilah, Chefchaouen), où les clients sont déjà au Maroc. */
export const dirhamsFaq: FaqItem = {
  question: 'Do we need to bring Moroccan dirhams (MAD) with us?',
  answer:
    'Tangier is very popular with day trippers who visit from Tarifa and return the same day, so most restaurants, cafés and shops are used to taking euros and credit cards.',
}

export const practicalFaq: FaqItem[] = [
  dirhamsFaq,
  {
    question: 'How does payment work?',
    answer:
      'We accept Moroccan dirhams or euros in cash at the end of the tour. A deposit is required for some tours and dates.',
  },
  {
    question: 'How do I book a tour?',
    answer:
      'Send us a message on WhatsApp, call us, email us or use the inquiry form on this site. We usually reply within 24 hours with availability and a proposal.',
  },
  {
    question: 'Which languages do your guides speak?',
    answer:
      'Our guides speak Arabic, French, English and Spanish. Let us know your preferred language when you book.',
  },
  {
    question: 'Can a tour be customised?',
    answer:
      'Yes. We adapt every tour to your interests, pace and schedule, and we build fully tailor-made days on request. Share your preferences and we will take it from there.',
  },
  {
    question: 'Are the tours private?',
    answer:
      'All our tours are private: only you and your travelling companions take part.',
  },
]

export const faq: FaqItem[] = [...spainFaq, ...practicalFaq]

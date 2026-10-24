/**
 * Questions fréquentes publiées sur la page Contact du site existant, reformulées légèrement.
 */
export type FaqItem = { question: string; answer: string }

export const faq: FaqItem[] = [
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
    question: 'How does payment work?',
    answer:
      'We accept cash payment in Moroccan dirhams on the day of the tour. For some excursions a deposit may be requested when you book.',
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
  {
    question: 'I am arriving from Spain by ferry. Can you help?',
    answer:
      'Yes. We assist with ferry tickets and can meet you at the port in Tangier. Tell us your crossing times and we will plan the day around them.',
  },
]

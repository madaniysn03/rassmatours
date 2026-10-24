import { images, type ImageAsset } from './images'
import type { FaqItem } from './faq'

/**
 * Excursions d’une journée à Tanger depuis le sud de l’Espagne.
 *
 * Faits vérifiés (site existant, 20/10/2026) : les tours commencent à Tanger, l’agence accueille ses
 * clients au port, aide à l’achat des billets de ferry et propose un accompagnement au port ; tous les
 * tours sont privés ; paiement en espèces le jour même. L’agence ne publie aucun service de transport
 * en Espagne : les villes sans ferry (Marbella, Malaga, Séville) sont traitées comme des points de
 * départ routiers vers Tarifa, pas comme des prestations. Les durées de traversée et de route sont des
 * ordres de grandeur publics, à confirmer (voir research/CLIENT_VALIDATION.md).
 */
export type DepartureKind = 'direct-ferry' | 'ferry-via-tanger-med' | 'drive-to-ferry'

export type DepartureCity = {
  slug: string
  name: string
  kind: DepartureKind
  /** Page dédiée (/day-trips-from-spain/<slug>/) ou simple section du guide. */
  hasPage: boolean
  /** Résumé d’une ligne. */
  summary: string
  /** Comment on rejoint le ferry, puis Tanger. */
  logistics: string[]
  /** Durées indicatives. */
  timing: { label: string; value: string }[]
  /** Ce qui rend la journée réaliste (ou non) depuis cette ville. */
  verdict: string
  faqs: FaqItem[]
  image: ImageAsset
  seo: { title: string; description: string }
}

export const spainCities: DepartureCity[] = [
  {
    slug: 'tarifa',
    name: 'Tarifa',
    kind: 'direct-ferry',
    hasPage: true,
    summary: 'The simplest Tangier day trip: a fast ferry of about an hour from Tarifa straight into the port in the centre of Tangier.',
    logistics: [
      'Fast ferries sail from the Tarifa terminal to Tangier Ville, the port in the city centre, in about one hour. Several sailings a day in season; timetables change, so we check them with you when you book.',
      'Tickets are bought from the ferry company. We help you choose the sailings and buy the tickets if you wish, and we tell you what to show at check-in.',
      'Your guide waits for you at the exit of the port. The medina starts a few minutes’ walk away, so the tour begins the moment you arrive.',
      'At the end of the day we walk you back to the terminal for your return sailing.',
    ],
    timing: [
      { label: 'Crossing', value: 'About 1 hour each way' },
      { label: 'Arrival port', value: 'Tangier Ville, city centre' },
      { label: 'Time in Tangier', value: 'Typically 6 to 8 hours between sailings' },
      { label: 'Tours that fit', value: 'Walking tour, Cap Spartel and Caves of Hercules, food tour, custom day' },
    ],
    verdict: 'Tarifa is where most of our day-trip guests cross from. The port-to-port timing leaves a full day for the medina, the coast and lunch.',
    faqs: [
      {
        question: 'Is the ferry ticket included in the tour?',
        answer: 'The ferry ticket is bought separately from the ferry company; we help you choose sailings and purchase it if you wish. Your quote states exactly what the tour itself includes.',
      },
      {
        question: 'Where do we meet in Tangier?',
        answer: 'At the exit of the Tangier Ville port, where the Tarifa ferry docks. Your guide will be waiting with your name; the medina is a short walk away.',
      },
      {
        question: 'How much time do we have in Tangier?',
        answer: 'It depends on the sailings you choose: with a morning crossing and an early-evening return, count six to eight hours on land. Tell us your times and we shape the day around them.',
      },
      {
        question: 'Can we do Chefchaouen from Tarifa in one day?',
        answer: 'Not comfortably: Chefchaouen is a full day from Tangier on its own. From Tarifa we recommend the city, Cap Spartel and the Caves of Hercules, or an overnight in Tangier if you want the blue town.',
      },
    ],
    image: images.bayFromBeach,
    seo: {
      title: 'Tangier Day Trip from Tarifa: Ferry & Guide',
      description: 'A Tangier day trip from Tarifa: one-hour ferry to the city port, a private guide at the exit, the medina or Cap Spartel, and back for the evening sailing.',
    },
  },
  {
    slug: 'algeciras',
    name: 'Algeciras',
    kind: 'ferry-via-tanger-med',
    hasPage: true,
    summary: 'Ferries from Algeciras arrive at Tanger Med, a cargo and passenger port about 45 kilometres from the city, so the day needs a transfer at each end.',
    logistics: [
      'Ferries from Algeciras cross to Tanger Med in roughly an hour and a half, with frequent sailings. Tanger Med is not in Tangier: it lies about 45 kilometres east of the city, around 45 minutes by road.',
      'Ask us about a private transfer between Tanger Med and the city: we meet you at the terminal and bring you to the start of your tour. Confirm this when you book.',
      'If you would rather walk straight into the medina, consider crossing from Tarifa instead: the Tarifa ferry docks in the city centre.',
      'We walk you back to your vehicle in time for the return crossing.',
    ],
    timing: [
      { label: 'Crossing', value: 'About 1 hour 30 each way' },
      { label: 'Arrival port', value: 'Tanger Med, about 45 km from the city' },
      { label: 'Transfer to the city', value: 'Around 45 minutes by road each way' },
      { label: 'Tours that fit', value: 'Walking tour, Cap Spartel and Caves of Hercules' },
    ],
    verdict: 'Algeciras works when Tarifa does not suit you, but the transfer at Tanger Med takes time out of the day. Plan the earliest practical crossing.',
    faqs: [
      {
        question: 'Does the Algeciras ferry arrive in Tangier itself?',
        answer: 'No. Algeciras ferries dock at Tanger Med, a large port about 45 kilometres east of the city. You need a transfer to reach Tangier; ask us to arrange it when you book.',
      },
      {
        question: 'Is the ferry ticket included?',
        answer: 'No, the ferry ticket is bought from the ferry company. We help with the choice of sailings and with the purchase if you wish.',
      },
      {
        question: 'Tarifa or Algeciras?',
        answer: 'For a day trip, Tarifa: the crossing is shorter and lands you in the city centre. Algeciras makes sense if you are already there, travel with a car, or the Tarifa sailings are full.',
      },
    ],
    image: images.coastRoadDusk,
    seo: {
      title: 'Tangier Day Trip from Algeciras via Tanger Med',
      description: 'A Tangier day trip from Algeciras: ferry to Tanger Med, transfer to the city, a local guide for the medina or Cap Spartel, and back for the evening crossing.',
    },
  },
  {
    slug: 'marbella',
    name: 'Marbella',
    kind: 'drive-to-ferry',
    hasPage: false,
    summary: 'No ferry leaves from Marbella: drive or take a bus to Tarifa (about 100 km), then cross to Tangier.',
    logistics: [
      'Tarifa is roughly 100 kilometres from Marbella, about an hour and a quarter by car along the A-7 and the N-340; Algeciras is a little closer but lands you at Tanger Med.',
      'Leave early enough for the morning sailing, park at the Tarifa terminal, and cross in about an hour.',
      'Our part of the day starts at the port in Tangier: a private guide waiting at the exit, the tour you have chosen, and the walk back for your return sailing.',
    ],
    timing: [
      { label: 'Road to Tarifa', value: 'About 100 km, 1 h 15 by car' },
      { label: 'Crossing', value: 'About 1 hour from Tarifa' },
      { label: 'Realistic day', value: 'Early start, 5 to 7 hours in Tangier' },
    ],
    verdict: 'Very doable with an early start. Most Marbella guests drive to Tarifa and take the first sailings out and the last ones back.',
    faqs: [],
    image: images.coastRocks,
    seo: { title: 'Tangier Day Trip from Marbella', description: 'How to do a Tangier day trip from Marbella: drive to Tarifa, ferry to the city, private guided tour.' },
  },
  {
    slug: 'malaga',
    name: 'Malaga',
    kind: 'drive-to-ferry',
    hasPage: false,
    summary: 'From Malaga, Tarifa is about 160 km away: a long but feasible day with the first ferry out.',
    logistics: [
      'Count about two hours by car from Malaga to the Tarifa terminal (roughly 160 km via the A-7 and the AP-7), a little less to Algeciras.',
      'With a sailing in the morning and one in the early evening, you keep five to six hours in Tangier.',
      'Our part of the day starts at the port in Tangier; the road and ferry in Spain are yours to arrange, with our help for the tickets.',
    ],
    timing: [
      { label: 'Road to Tarifa', value: 'About 160 km, 2 h by car' },
      { label: 'Crossing', value: 'About 1 hour from Tarifa' },
      { label: 'Realistic day', value: 'Very early start, 5 to 6 hours in Tangier' },
    ],
    verdict: 'Feasible for a focused day (medina plus Cap Spartel). If you can, sleep in Tarifa the night before, or stay a night in Tangier.',
    faqs: [],
    image: images.coastRoadDusk,
    seo: { title: 'Tangier Day Trip from Malaga', description: 'How to do a Tangier day trip from Malaga: road to Tarifa, ferry to the city, private guided tour.' },
  },
  {
    slug: 'seville',
    name: 'Seville',
    kind: 'drive-to-ferry',
    hasPage: false,
    summary: 'Seville to Tarifa is about 200 km: a day trip is possible with a very early start, an overnight makes it comfortable.',
    logistics: [
      'Tarifa is roughly two hours and a quarter from Seville by car (about 200 km via the A-4 and the A-381).',
      'Plan the first sailing out and a late-afternoon or evening sailing back; the day in Tangier is then five to six hours.',
      'Our part of the day starts at the port in Tangier: private guide, your chosen tour, and the walk back to the terminal.',
    ],
    timing: [
      { label: 'Road to Tarifa', value: 'About 200 km, 2 h 15 by car' },
      { label: 'Crossing', value: 'About 1 hour from Tarifa' },
      { label: 'Realistic day', value: 'Very early start, 5 to 6 hours in Tangier; overnight recommended' },
    ],
    verdict: 'Possible, but the best Seville-to-Tangier trips include a night in Tangier so the day is not spent on the road.',
    faqs: [],
    image: images.squarePalms,
    seo: { title: 'Tangier Day Trip from Seville', description: 'How to do a Tangier day trip from Seville: road to Tarifa, ferry to the city, private guided tour or overnight.' },
  },
]

export const getSpainCity = (slug: string) => spainCities.find((c) => c.slug === slug)

/** Guide pratique du ferry : faits publics et conseils, sans horaires ni prix. */
export const ferryGuide = {
  routes: [
    {
      name: 'Tarifa to Tangier Ville',
      crossing: 'About 1 hour, fast ferry',
      arrives: 'Port in the centre of Tangier, a few minutes on foot from the medina',
      bestFor: 'Day trips: the shortest crossing and the only one that lands in the city itself',
    },
    {
      name: 'Algeciras to Tanger Med',
      crossing: 'About 1 hour 30, several companies and frequent sailings',
      arrives: 'Tanger Med, a large port about 45 km east of the city; transfer needed',
      bestFor: 'Travellers with a car, or when Tarifa sailings are full',
    },
  ],
  checklist: [
    { title: 'Passport', text: 'A valid passport is required to enter Morocco; a national identity card is not enough. Check the entry rules for your nationality before you travel, and bring the passport you booked with.' },
    { title: 'Which port', text: 'Make sure your ticket says Tangier Ville (city) for the Tarifa route. Tanger Med is a different port, 45 km away.' },
    { title: 'Timing', text: 'Allow time for check-in and passport control on both sides. Morocco’s clock can differ from Spain’s by up to an hour depending on the season and Ramadan: check the local time when you land.' },
    { title: 'Money', text: 'Morocco uses the dirham. Cards are accepted in some places, but cash is useful in the medina and our tours are paid in cash on the day.' },
    { title: 'Return', text: 'Choose your return sailing when you book the outbound one, and tell us the time: we bring you back to the terminal with a margin.' },
  ],
  faqs: [
    {
      question: 'Do you sell the ferry tickets?',
      answer: 'We help you choose sailings and buy the tickets from the ferry company on your behalf if you wish, and we accompany you at the port. The ticket itself is not part of the tour price unless your quote says so.',
    },
    {
      question: 'Which ferry should I take for a day trip?',
      answer: 'From Tarifa to Tangier Ville: about an hour, and you step straight into the city. Algeciras ferries go to Tanger Med, which adds a transfer of around 45 minutes each way.',
    },
    {
      question: 'What happens when I arrive?',
      answer: 'After passport control, your guide is waiting at the exit of the terminal. The tour starts immediately; there is no need to find a taxi or an office.',
    },
    {
      question: 'What if the sea is rough?',
      answer: 'Ferries occasionally run late or are cancelled in strong winds, especially in Tarifa. We follow the sailings on the day and adapt the tour; tell us how to reach you by phone or WhatsApp.',
    },
  ] as FaqItem[],
}

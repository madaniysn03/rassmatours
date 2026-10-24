import { images, type ImageAsset } from './images'
import type { FaqItem } from './faq'

/**
 * Les cinq expériences proviennent de la page « Tours » de tangierbyguide.com (20/10/2026).
 * `summary` reprend le descriptif publié mot pour mot ; `story`, `day` et `faqs` sont rédigés
 * pour ce site à partir de ces descriptifs et de faits publics sur les lieux.
 * Aucun prix, horaire de départ ni inclusion non publiés ne sont affichés.
 */
export type TourCategory = 'tangier' | 'excursion'

export type Tour = {
  slug: string
  name: string
  /** Titre H1 et titre des cartes : nom publié, ou formulation portant le mot-clé principal. */
  headline: string
  /** Désignation courte en milieu de phrase (« the walking tour », « the Chefchaouen day trip »). */
  ref: string
  /** Titre court pour les cartes et le menu. */
  shortName: string
  category: TourCategory
  /** Durée publiée sur le site existant. */
  duration: string
  /** Une ligne d’accroche. */
  teaser: string
  /** Descriptif publié sur le site existant (verbatim). */
  summary: string
  /** Récit éditorial : ce que l’on vit pendant la journée. */
  story: string[]
  /** Déroulé indicatif, dérivé des descriptifs publiés. À valider par le client. */
  day: { title: string; text: string; place: string }[]
  highlights: string[]
  /** Ce qui est compris, d’après les atouts publiés (guide privé, véhicule privé climatisé). */
  included: string[]
  /** Informations pratiques vérifiées (FAQ et page « Tours » du site existant). */
  goodToKnow: string[]
  /** Questions propres à cette expérience. */
  faqs: FaqItem[]
  image: ImageAsset
  imagePortrait: ImageAsset
  gallery: ImageAsset[]
  destinationSlugs: string[]
  relatedSlugs: string[]
  seo: { title: string; description: string }
}

const PRIVATE = 'Private tour: only you and your group take part.'
const LANGUAGES = 'Guides speak Arabic, French, English and Spanish; tell us your preferred language when booking.'
const VEHICLE = 'Transport in a private, modern, air-conditioned vehicle with an accredited driver.'
const CRUISE = 'Suitable for cruise and ferry passengers: tell us your arrival and departure times and we plan around them.'

export const tours: Tour[] = [
  {
    slug: 'tangier-walking-tour',
    name: 'Tangier Walking Tour',
    headline: 'Tangier Walking Tour',
    ref: 'Tangier walking tour',
    shortName: 'Walking Tour',
    category: 'tangier',
    duration: '2 to 4 hours',
    teaser: 'A private city tour on foot: the medina, the Kasbah and the souks, at your pace.',
    summary:
      'Discover the vibrant soul of Tangier on foot. This guided walking tour takes you through the old Medina, Kasbah, and traditional souks. Learn about Tangier’s rich history, multicultural influences, and hidden corners only locals know. Ideal for first-time visitors.',
    story: [
      'A Tangier walking tour reads the city with your feet: this is our private city tour, the one most day-trip guests from Spain choose. The lanes of the medina tilt towards the bay, the Kasbah sits above them behind its walls, and between the two you cross centuries in a few hundred metres: Portuguese and British stones, Spanish balconies, the mosaic of the International Zone years, and the everyday life of the people who live here now.',
      'Your guide walks with you, not ahead of you. They explain what you are looking at, answer what you are curious about, and know which doorway, terrace or tea house is worth a pause. Because the tour is private, you decide the pace, the detours and the length of the stops.',
      'This is the right first morning in Tangier: by the end of it you can read the map of the old town, and you know where you want to come back to.',
    ],
    day: [
      { title: 'The old medina', place: 'Tangier Medina', text: 'Enter through one of the historic gates and follow the lanes that link the Grand Socco to the Petit Socco, the small square where cafés have watched the city go by for a century.' },
      { title: 'The Kasbah', place: 'Kasbah of Tangier', text: 'Climb to the fortified upper town, once the residence of the sultans’ governors, for views over the strait towards Spain.' },
      { title: 'The souks', place: 'Tangier souks', text: 'Walk through the market lanes with your guide: spices, fabrics, bread ovens and the craftsmen still at work.' },
    ],
    highlights: [
      'Old medina and its historic gates',
      'The Kasbah and its views over the strait',
      'Traditional souks and craft lanes',
      'Tangier’s multicultural history, told by a local',
      'Corners you would not find on your own',
    ],
    included: ['Private local guide for your group only', 'A route adapted to your interests and pace'],
    goodToKnow: [PRIVATE, LANGUAGES, 'Comfortable shoes recommended: the medina is cobbled and hilly.', CRUISE],
    faqs: [
      {
        question: 'Is the walking tour suitable for a ferry or cruise stop?',
        answer: 'Yes. At 2 to 4 hours it fits comfortably into a day trip from Spain or a port call. Tell us your arrival and departure times and we will meet you at the port and plan the route around them.',
      },
      {
        question: 'How much walking is involved?',
        answer: 'The old town is compact but hilly and cobbled, so expect two to four hours on foot with plenty of stops. Because the tour is private, the pace is yours; tell us about any mobility needs when you book.',
      },
      {
        question: 'Can we add Cap Spartel and the Caves of Hercules?',
        answer: 'Yes. Our Cap Spartel and Caves of Hercules tour combines the landmarks outside the city with the old town, or we can build a custom day around what you want to see.',
      },
    ],
    image: images.alleyToTheSea,
    imagePortrait: images.kasbahArch,
    gallery: [images.grandSoccoGate, images.medinaLane, images.kasbahOverPort, images.rueKasbahSign, images.cafeBaba, images.potteryShelves],
    destinationSlugs: ['tangier'],
    relatedSlugs: ['cap-spartel-hercules-caves', 'tangier-food-tour'],
    seo: {
      title: 'Tangier Walking Tour & Private City Tour',
      description: 'A private Tangier walking tour and city tour, 2 to 4 hours through the medina, Kasbah and souks with a local guide. Fits a day trip from Spain.',
    },
  },
  {
    slug: 'cap-spartel-hercules-caves',
    name: 'Tangier Highlights, Camels & Old Town Tour',
    headline: 'Cap Spartel & Caves of Hercules Tour from Tangier',
    ref: 'Cap Spartel and Caves of Hercules tour',
    shortName: 'Cap Spartel & Caves of Hercules',
    category: 'tangier',
    duration: '4 to 6 hours',
    teaser: 'Cap Spartel, the Caves of Hercules, a camel ride on the Atlantic and the old town in one day.',
    summary:
      'Experience the best of Tangier in one day! Visit iconic landmarks such as Cap Spartel, the Hercules Caves, enjoy a camel ride along the Atlantic coast, and explore the charming old town with a local guide. A perfect blend of nature, culture, and adventure.',
    story: [
      'Our Cap Spartel and Caves of Hercules tour, published as the Tangier Highlights, Camels & Old Town Tour, puts the ocean, a legend and a medina within a short drive of each other. West of Tangier the land ends at Cap Spartel, where the Mediterranean meets the Atlantic below a nineteenth-century lighthouse. A few minutes further down the coast, the Caves of Hercules open onto the sea through a gap in the rock that looks, famously, like a map of Africa.',
      'The beaches between them are long and wide, which is where the camels come in. The ride is short, unhurried and makes a better photograph than it has any right to. Then the car brings you back to the old town, and the second half of the day belongs to the medina and the Kasbah with your guide.',
      'This is the tour for a single day in Tangier, or for cruise and ferry passengers who want to see the essentials without rushing.',
    ],
    day: [
      { title: 'Cap Spartel', place: 'Cap Spartel', text: 'Drive out through the villas and pine woods of the Old Mountain to the cape and its lighthouse, where the two seas meet.' },
      { title: 'The Caves of Hercules', place: 'Caves of Hercules', text: 'Walk into the caves and look out at the Atlantic through the opening in the rock.' },
      { title: 'Camel ride on the Atlantic coast', place: 'Atlantic beaches of Tangier', text: 'A gentle ride along the beach, with time for photographs.' },
      { title: 'The old town', place: 'Tangier Medina', text: 'Back in Tangier, explore the medina and the Kasbah on foot with your guide.' },
    ],
    highlights: [
      'Cap Spartel and its lighthouse, where the Mediterranean meets the Atlantic',
      'The Caves of Hercules',
      'Camel ride along the Atlantic coast',
      'The old medina and the Kasbah',
      'Private air-conditioned vehicle between the sites',
    ],
    included: ['Private local guide for your group only', 'Private air-conditioned vehicle and accredited driver between the sites'],
    goodToKnow: [PRIVATE, VEHICLE, LANGUAGES, CRUISE],
    faqs: [
      {
        question: 'How far is Cap Spartel from the centre of Tangier?',
        answer: 'About 14 kilometres west of the city, roughly 20 to 30 minutes by car through the Old Mountain. The Caves of Hercules are a few minutes further along the coast.',
      },
      {
        question: 'Is the camel ride suitable for children?',
        answer: 'The ride is short and at walking pace along the beach. Tell us the ages of your group when you book so we can adapt the day, or leave the ride out if you prefer.',
      },
      {
        question: 'Can this tour start from the port or the ferry terminal?',
        answer: 'Yes. Many of our guests arrive by ferry from Tarifa or on a cruise call. We meet you at the port and return you in good time for your departure.',
      },
    ],
    image: images.capSpartelSunset,
    imagePortrait: images.herculesCavesWindow,
    gallery: [images.camelsBeach, images.herculesCavesSilhouette, images.capSpartelLighthouse, images.camelRide, images.kasbahWalls, images.coastRocks],
    destinationSlugs: ['tangier'],
    relatedSlugs: ['tangier-walking-tour', 'asilah-day-trip'],
    seo: {
      title: 'Cap Spartel & Caves of Hercules Tour, Tangier',
      description: 'Private Cap Spartel and Caves of Hercules tour from Tangier, 4 to 6 hours: lighthouse, sea caves, camel ride on the Atlantic beach and the old medina.',
    },
  },
  {
    slug: 'asilah-day-trip',
    name: 'Asilah Day Trip from Tangier',
    headline: 'Asilah Day Trip from Tangier',
    ref: 'Asilah day trip',
    shortName: 'Asilah Day Trip',
    category: 'excursion',
    duration: '4 to 6 hours',
    teaser: 'A coastal drive to a small white town of ramparts, murals and ocean air.',
    summary:
      'Take a scenic drive along the coast to Asilah, a picturesque seaside town known for its whitewashed streets, colorful murals, and calm beach vibes. Wander through the Medina, visit historic ramparts, and enjoy lunch by the ocean. A peaceful escape from the city.',
    story: [
      'An Asilah day trip from Tangier takes less than an hour along the Atlantic coast and lands you in a different tempo. The medina is small, whitewashed and edged in blue, enclosed by ramparts the Portuguese built in the fifteenth century. Every summer since the late 1970s an arts festival has left new murals on its walls, so the town changes a little each year.',
      'There is not much you need to do in Asilah, which is the point. Walk the walls above the sea, look at the murals, browse a gallery or two, and sit down to lunch with the ocean in front of you.',
      'A good choice for a slower day, for families, and for travellers who want the coast without the crowds.',
    ],
    day: [
      { title: 'The coastal road', place: 'Atlantic coast road from Tangier', text: 'Leave Tangier and follow the Atlantic south with your driver and guide.' },
      { title: 'The medina and the ramparts', place: 'Asilah Medina', text: 'Walk the white lanes and the Portuguese sea walls, with their views over the beach and the ocean.' },
      { title: 'Murals and galleries', place: 'Asilah murals', text: 'See the painted walls left by the annual arts festival.' },
      { title: 'Lunch by the ocean', place: 'Asilah seafront', text: 'Time for a relaxed meal before the drive back.' },
    ],
    highlights: [
      'Scenic drive along the Atlantic coast',
      'Whitewashed medina and its colourful murals',
      'Fifteenth-century Portuguese ramparts',
      'Lunch by the ocean',
      'A calm, unhurried pace',
    ],
    included: ['Private local guide for your group only', 'Private air-conditioned vehicle and accredited driver, Tangier to Asilah and back'],
    goodToKnow: [PRIVATE, VEHICLE, 'Lunch venue and cost are arranged on the day; ask us when booking.', LANGUAGES],
    faqs: [
      {
        question: 'How far is Asilah from Tangier?',
        answer: 'About 45 kilometres south along the Atlantic coast, around 45 minutes by car. The round trip and the visit fit into 4 to 6 hours.',
      },
      {
        question: 'Is lunch included?',
        answer: 'Lunch is arranged on the day at a restaurant by the sea and is paid locally; tell us your preferences when you book and we will advise on the options and the budget.',
      },
      {
        question: 'Can we combine Asilah with Cap Spartel or the old town of Tangier?',
        answer: 'Yes, as a longer custom day. Tell us how much time you have and we will suggest an itinerary and a quote.',
      },
    ],
    image: images.asilahBeachWaves,
    imagePortrait: images.asilahMedina,
    gallery: [images.asilahBlueWindow, images.asilahWindowMural, images.coastRoadDusk, images.asilahMedina],
    destinationSlugs: ['asilah'],
    relatedSlugs: ['chefchaouen-day-trip', 'cap-spartel-hercules-caves'],
    seo: {
      title: 'Asilah Day Trip from Tangier, Private Tour',
      description: 'A private Asilah day trip from Tangier, 4 to 6 hours: coastal drive, whitewashed medina, Portuguese ramparts, festival murals and lunch by the ocean.',
    },
  },
  {
    slug: 'chefchaouen-day-trip',
    name: 'Chefchaouen Day Trip from Tangier',
    headline: 'Chefchaouen Day Trip from Tangier',
    ref: 'Chefchaouen day trip',
    shortName: 'Chefchaouen Day Trip',
    category: 'excursion',
    duration: '7 to 9 hours',
    teaser: 'A full day in the blue town of the Rif Mountains.',
    summary:
      'Visit the world-famous Blue City of Chefchaouen, nestled in the Rif Mountains. Known for its striking blue alleys, artisan shops, and tranquil ambiance, this full-day tour offers breathtaking photo spots, mountain views, and a deep cultural experience.',
    story: [
      'Chefchaouen was founded in 1471 in a fold of the Rif Mountains, and its medina has been washed in shades of blue for generations. Photographs do not prepare you for how quiet it is: the lanes climb in steps, the doors are painted, the light bounces off the walls, and the mountains close the view at the end of every street.',
      'A Chefchaouen day trip from Tangier means a little over two hours each way through the hills, so this is a full day. Your guide leads you through the medina, to the Plaza Uta el-Hammam under the Kasbah walls, and to the viewpoints above the town; there is time for lunch, for the artisan shops, and for simply sitting down.',
      'If you have one day for an excursion from Tangier, this is the one most of our travellers choose.',
    ],
    day: [
      { title: 'Into the Rif', place: 'Rif Mountains road', text: 'Leave Tangier in the morning and drive south-east through the hills to Chefchaouen.' },
      { title: 'The blue medina', place: 'Chefchaouen Medina', text: 'Walk the painted lanes and stairways with your guide, from the main square to the quieter upper streets.' },
      { title: 'Artisans and lunch', place: 'Plaza Uta el-Hammam', text: 'Visit workshops and shops, then lunch in town.' },
      { title: 'Mountain views', place: 'Chefchaouen viewpoints', text: 'Take in the view of the blue town against the mountains before the drive back.' },
    ],
    highlights: [
      'The blue-washed lanes and stairways of the medina',
      'Plaza Uta el-Hammam and the Kasbah',
      'Artisan shops and workshops',
      'Views of the town against the Rif Mountains',
      'Photo spots your guide knows',
    ],
    included: ['Private local guide for your group only', 'Private air-conditioned vehicle and accredited driver, Tangier to Chefchaouen and back'],
    goodToKnow: [PRIVATE, VEHICLE, 'Around two hours’ drive each way; bring a layer, Chefchaouen sits at altitude and is cooler than the coast.', LANGUAGES],
    faqs: [
      {
        question: 'How long is the drive from Tangier to Chefchaouen?',
        answer: 'About 115 kilometres and two to two and a half hours each way through the Rif hills, which is why the tour lasts 7 to 9 hours. You travel in a private air-conditioned vehicle with a driver.',
      },
      {
        question: 'What should I bring?',
        answer: 'Comfortable shoes for the stairways, a layer for the mountain air, and some cash in dirhams for lunch and the artisan shops.',
      },
      {
        question: 'Is this a private tour or a shared one?',
        answer: 'Private, like all our tours: your group, your guide and your driver. The departure time and the stops are agreed with you.',
      },
    ],
    image: images.blueCityHillside,
    imagePortrait: images.blueAlley,
    gallery: [images.blueStairsMarket, images.utaElHammam, images.blueCourtyard, images.blueAlley],
    destinationSlugs: ['chefchaouen'],
    relatedSlugs: ['asilah-day-trip', 'tangier-walking-tour'],
    seo: {
      title: 'Chefchaouen Day Trip from Tangier, Private',
      description: 'A private Chefchaouen day trip from Tangier, full day in the blue town of the Rif Mountains: medina, artisans, viewpoints, lunch and a local guide.',
    },
  },
  {
    slug: 'tangier-food-tour',
    name: 'Tangier Food Tour',
    headline: 'Tangier Food Tour',
    ref: 'Tangier food tour',
    shortName: 'Food Tour',
    category: 'tangier',
    duration: '4 to 5 hours',
    teaser: 'Taste the city: fish market, food souks and the spices behind the dishes.',
    summary: 'Explore Tangier’s flavors through a culinary tour that will introduce you to Moroccan cuisine.',
    story: [
      'The best way to understand a Moroccan city is to eat your way through its market, which is what this Tangier food tour does. In Tangier that means the fish stalls, where the morning catch from the strait is laid out on ice, the vegetable and bread sellers, the olive merchants and the spice shops where your guide explains what goes into a tagine, a harira or a plate of couscous.',
      'The tour moves at a walking pace with stops to taste along the way, and ends with you knowing the difference between ras el hanout and cumin, and where locals go for the best of both.',
    ],
    day: [
      { title: 'The fish market and food souks', place: 'Tangier central market', text: 'Start where the city shops: the fish market and the market lanes of the medina.' },
      { title: 'Tastings', place: 'Tangier Medina', text: 'Try local specialities as you go, chosen by your guide.' },
      { title: 'Spices', place: 'Tangier spice souk', text: 'Learn about Moroccan spices and how they are used at home.' },
    ],
    highlights: ['Tasting of local specialities', 'Visit to the fish market and food souks', 'Learn about Moroccan spices'],
    included: ['Private local guide for your group only', 'A route through the markets adapted to your tastes'],
    goodToKnow: [PRIVATE, 'Tell us about allergies or dietary preferences when booking.', 'Mornings are the liveliest time at the market.', LANGUAGES],
    faqs: [
      {
        question: 'What will we taste?',
        answer: 'Local specialities chosen by your guide at the stalls and small kitchens of the market: the exact selection depends on the season and the day. Tastings are listed in your quote.',
      },
      {
        question: 'Can you cater for vegetarians or allergies?',
        answer: 'Yes. Tell us about dietary preferences and allergies when you book and the guide adapts the stops.',
      },
      {
        question: 'When is the best time for the food tour?',
        answer: 'Mornings, when the fish market and the food souks are at their busiest and freshest.',
      },
    ],
    image: images.spiceBags,
    imagePortrait: images.spiceMarket,
    gallery: [images.couscous, images.taginesClay, images.mintTea, images.teaPastries, images.tagineCeramic, images.moroccanTable],
    destinationSlugs: ['tangier'],
    relatedSlugs: ['tangier-walking-tour', 'cap-spartel-hercules-caves'],
    seo: {
      title: 'Tangier Food Tour: Markets, Souks & Spices',
      description: 'A private Tangier food tour, 4 to 5 hours through the fish market and food souks, with tastings of local specialities and an introduction to Moroccan spices.',
    },
  },
]

/** Services complémentaires publiés sur la page « Tours » du site existant. */
export const additionalServices = [
  {
    title: 'Tailor-made tours',
    text: 'We also offer customised tours tailored to your interests and schedule. Tell us what you would like to see and we will build the day around it.',
  },
  {
    title: 'Inter-city transfers',
    text: 'Comfortable private transport between Tangier and other Moroccan cities such as Fes, Casablanca, Rabat and Marrakech.',
  },
  {
    title: 'Multi-day circuits',
    text: 'Organisation of personalised multi-day itineraries to explore Morocco in depth.',
  },
  {
    title: 'Ferry assistance',
    text: 'Help with purchasing ferry tickets and port accompaniment for a stress-free crossing from Spain.',
  },
]

export const getTour = (slug: string) => tours.find((t) => t.slug === slug)
export const toursByCategory = (category: TourCategory) => tours.filter((t) => t.category === category)

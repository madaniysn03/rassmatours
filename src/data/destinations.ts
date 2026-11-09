import { images, type ImageAsset } from './images'
import type { FaqItem } from './faq'

/**
 * Destinations réellement desservies par les excursions publiées : Tangier, Asilah, Chefchaouen.
 * Les faits historiques et pratiques cités sont de notoriété publique ; aucune donnée commerciale inventée.
 */
export type Destination = {
  slug: string
  name: string
  /** Titre H1 de la page destination. */
  h1: string
  kicker: string
  intro: string
  paragraphs: string[]
  places: { name: string; text: string }[]
  /** Contexte pratique : accès, distances, saison. */
  practical: { label: string; text: string }[]
  faqs: FaqItem[]
  image: ImageAsset
  imageSecondary: ImageAsset
  tourSlugs: string[]
  seo: { title: string; description: string }
}

export const destinations: Destination[] = [
  {
    slug: 'tangier',
    name: 'Tangier',
    h1: 'Things to do in Tangier with a local guide',
    kicker: 'The city on the strait',
    intro: 'Where Africa looks at Europe across fourteen kilometres of water, and a white city climbs from the port to the Kasbah.',
    paragraphs: [
      'Tangier has been Phoenician, Roman, Portuguese, British and, for the first half of the twentieth century, an International Zone governed by several nations at once. That history is still in the streets: Spanish balconies above Moroccan doorways, a Catholic cathedral a few steps from the mosque, cafés that served writers and painters passing through.',
      'The medina slopes from the Grand Socco down to the port, and the Kasbah watches over both from the top of the hill. Beyond the city the coast runs west to Cap Spartel, where the Mediterranean and the Atlantic meet, and to the Caves of Hercules. It is a place best understood with someone who lives here.',
      'Most visitors have less than a day. The good news is that Tangier rewards a short visit: the old town can be walked in a morning, the landmarks on the coast are twenty minutes away, and the markets are open every day. The question is not what to see but who shows it to you.',
    ],
    places: [
      { name: 'The medina and the Petit Socco', text: 'Lanes, bread ovens, tea houses and the small square that was once the centre of the city’s social life.' },
      { name: 'The Kasbah', text: 'The fortified upper town, with the former governor’s palace and terraces looking over the strait to Spain.' },
      { name: 'The Grand Socco', text: 'The square between the new town and the medina, with its gardens, the Cinema Rif and the gate into the old city.' },
      { name: 'Cap Spartel', text: 'The north-western tip of Africa and its lighthouse, where two seas meet below the Old Mountain.' },
      { name: 'The Caves of Hercules', text: 'Sea caves opening onto the Atlantic through a gap in the rock shaped like the map of Africa.' },
      { name: 'The markets', text: 'The fish market and the food souks, liveliest in the morning, and the craft lanes of the medina.' },
    ],
    practical: [
      { label: 'From Spain', text: 'Ferries from Tarifa reach the port in the centre of Tangier in about an hour; crossings from Algeciras arrive at Tanger Med, roughly 45 minutes from the city by road. We help with tickets and meet you at the port.' },
      { label: 'By air and rail', text: 'Tangier Ibn Battouta airport is about 15 kilometres from the centre. The Al Boraq high-speed train links Tanger Ville station with Rabat and Casablanca.' },
      { label: 'Time needed', text: 'Half a day for the old town, a full day to add Cap Spartel, the Caves of Hercules and a camel ride on the Atlantic.' },
      { label: 'When to come', text: 'Pleasant year-round on the coast; spring and autumn are the most comfortable for walking, summer is the busiest.' },
    ],
    faqs: [
      {
        question: 'Can I visit Tangier in one day from Spain?',
        answer: 'Yes. With the Tarifa ferry you can be in the medina by mid-morning and back in Spain in the evening. Our walking tour and our Cap Spartel and Caves of Hercules tour are both designed around ferry and cruise timings.',
      },
      {
        question: 'Is Tangier safe for visitors?',
        answer: 'Tangier is a busy, welcoming port city where most visitors walk the old town without any trouble. Going with a local guide means you spend your time looking rather than navigating, and you learn how the city works.',
      },
      {
        question: 'What languages are spoken?',
        answer: 'Arabic and French are the everyday languages, Spanish is widely understood in the north, and English is common in tourism. Our guides speak all four.',
      },
    ],
    image: images.kasbahOverPort,
    imageSecondary: images.medinaRooftopsDusk,
    tourSlugs: ['tangier-walking-tour', 'cap-spartel-hercules-caves', 'tangier-food-tour'],
    seo: {
      title: 'Things to Do in Tangier with a Local Guide',
      description: 'Things to do in Tangier: the medina, the Kasbah, the Grand Socco, Cap Spartel and the Caves of Hercules, with practical tips and private tours by local guides.',
    },
  },
  {
    slug: 'asilah',
    name: 'Asilah',
    h1: 'Asilah, Morocco: the white town near Tangier',
    kicker: 'The white town on the Atlantic',
    intro: 'A small walled town an hour down the coast, known for its ramparts, its murals and its slow afternoons.',
    paragraphs: [
      'Asilah sits on the Atlantic south of Tangier, enclosed by sea walls built by the Portuguese in the fifteenth century. Inside them the medina is white with blue edges, and since the late 1970s an annual arts festival has covered many of its walls in murals that are repainted year after year.',
      'It is a town for walking the ramparts, looking at the ocean, browsing a gallery and sitting down to lunch, and it pairs naturally with a day that starts in Tangier.',
    ],
    places: [
      { name: 'The ramparts', text: 'Portuguese sea walls with walks above the beach and the ocean.' },
      { name: 'The medina', text: 'Whitewashed lanes, painted doors and the murals of the arts festival.' },
      { name: 'The beach', text: 'A long Atlantic beach just outside the walls.' },
    ],
    practical: [
      { label: 'Getting there', text: 'About 45 kilometres south of Tangier along the coast, around 45 minutes by car. We drive you there and back in a private vehicle.' },
      { label: 'Time needed', text: 'Half a day is enough for the medina, the ramparts and lunch; the full excursion lasts 5 to 6 hours from Tangier.' },
      { label: 'When to come', text: 'Any season; the summer arts festival brings crowds and new murals, the rest of the year the town is very quiet.' },
    ],
    faqs: [
      {
        question: 'Is Asilah worth a day trip from Tangier?',
        answer: 'If you want the coast at a slower pace, yes. It is close enough to do in half a day and different enough from Tangier to feel like a change of scene.',
      },
      {
        question: 'Can I combine Asilah with Chefchaouen?',
        answer: 'Not comfortably in one day: they are in opposite directions. Two separate days work well, or a custom multi-day itinerary.',
      },
    ],
    image: images.asilahMedina,
    imageSecondary: images.asilahBeachWaves,
    tourSlugs: ['asilah-day-trip'],
    seo: {
      title: 'Asilah, Morocco: The White Town near Tangier',
      description: 'Asilah, Morocco, 45 minutes south of Tangier: Portuguese ramparts, whitewashed medina, festival murals and Atlantic beach, with tips and a private day trip.',
    },
  },
  {
    slug: 'chefchaouen',
    name: 'Chefchaouen',
    h1: 'Chefchaouen, the blue city two hours from Tangier',
    kicker: 'The blue town of the Rif',
    intro: 'A mountain medina painted in blues, founded in 1471 and still one of the quietest places in northern Morocco.',
    paragraphs: [
      'Chefchaouen lies a little over two hours from Tangier in the Rif Mountains. Its medina climbs the slope in stairs and painted lanes, with the Kasbah and the Plaza Uta el-Hammam at its heart and the peaks of the Rif closing the view in every direction.',
      'Travellers come for the colour, and stay for the calm: artisan workshops, mountain air, and viewpoints above the town where the whole blue medina sits in the landscape.',
    ],
    places: [
      { name: 'The blue medina', text: 'Lanes, stairways and courtyards washed in blue.' },
      { name: 'Plaza Uta el-Hammam', text: 'The main square beneath the Kasbah walls, with its cafés and the Grand Mosque.' },
      { name: 'The viewpoints', text: 'Paths above the town with views of the medina against the mountains.' },
    ],
    practical: [
      { label: 'Getting there', text: 'About 115 kilometres from Tangier, two to two and a half hours by road through the Rif. The day trip lasts about 7 hours door to door.' },
      { label: 'Altitude and weather', text: 'The town sits around 600 metres above sea level: cooler than the coast, bring a layer outside summer.' },
      { label: 'Time needed', text: 'The day trip from Tangier gives two to three hours in town for the medina, lunch, the shops and a viewpoint.' },
    ],
    faqs: [
      {
        question: 'Can I visit Chefchaouen as a day trip from Tangier?',
        answer: 'Yes, it is the classic day trip from Tangier: about 7 hours with a private driver and guide, including two to three hours in the town itself.',
      },
      {
        question: 'Why is Chefchaouen blue?',
        answer: 'Several explanations circulate, from a tradition brought by Jewish refugees to a practical way of keeping houses cool and insects away. Your guide will tell you the versions locals believe.',
      },
    ],
    image: images.blueAlley,
    imageSecondary: images.blueCityHillside,
    tourSlugs: ['chefchaouen-day-trip'],
    seo: {
      title: 'Chefchaouen: The Blue City, 2 Hours from Tangier',
      description: 'Chefchaouen, the blue town of the Rif Mountains, two hours from Tangier: medina, Plaza Uta el-Hammam, viewpoints, practical tips and a private day trip.',
    },
  },
]

export const getDestination = (slug: string) => destinations.find((d) => d.slug === slug)

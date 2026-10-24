/**
 * Catalogue des images. Toutes sont des remplacements temporaires sous licence Unsplash
 * (voir research/image-catalog.md) : à remplacer par les photos de Rassma Tours.
 * Chaque entrée expose une variante 900 px pour le srcset.
 */
export type ImageAsset = {
  src: string
  src900: string
  alt: string
  width: number
  height: number
  /** Identifiant Unsplash du photographe (crédit). */
  credit: string
}

const landscape = (path: string, alt: string, credit: string): ImageAsset => ({
  src: `/images/${path}.jpg`,
  src900: `/images/${path}-900.jpg`,
  alt,
  width: 1800,
  height: 1200,
  credit,
})
const portrait = (path: string, alt: string, credit: string): ImageAsset => ({
  src: `/images/${path}.jpg`,
  src900: `/images/${path}-900.jpg`,
  alt,
  width: 1200,
  height: 1500,
  credit,
})

export const images = {
  heroTangierBay: landscape('hero/tangier-bay-dusk', 'Tangier bay and medina at dusk, seen from above, with the port lights along the water', 'raulcachophoto'),
  heroTangierBayPortrait: { ...portrait('hero/tangier-bay-dusk-portrait', 'Tangier bay and medina at dusk, seen from above', 'raulcachophoto'), height: 1700 },

  medinaRooftopsDusk: landscape('tangier/medina-rooftops-dusk', 'Rooftops of the Tangier medina at dusk, with the bay and seafront boulevard lit below', 'raulcachophoto'),
  kasbahOverPort: portrait('tangier/kasbah-over-port', 'Whitewashed houses of the Kasbah overlooking the port of Tangier and the blue sea', '0x0red'),
  kasbahWalls: landscape('tangier/kasbah-walls', 'The old walls and white houses of Tangier above the coast', 'alezyra'),
  medinaAerial: landscape('tangier/medina-aerial', 'Aerial view of the white and blue houses of the old town, sloping down to the sea', 'bilalkamal_bk'),
  alleyToTheSea: landscape('tangier/alley-to-the-sea', 'A silhouette walks down a shaded medina alley that opens onto the bright bay', 'theemanofoth'),
  cinemaRif: landscape('tangier/cinema-rif', 'The facade of the Cinema Rif on the Grand Socco, framed by palm leaves', 'theemanofoth'),
  elMinzah: landscape('tangier/el-minzah', 'The white facade and lantern of the El Minzah Hotel in Tangier', 'theemanofoth'),
  cafeBaba: landscape('tangier/cafe-baba', 'The painted sign of Cafe Baba on a white wall in the Kasbah', 'theemanofoth'),
  rueKasbahSign: landscape('tangier/rue-kasbah-sign', 'A blue enamel street sign reading Rue de la Kasbah, number 40', 'theemanofoth'),
  grandSoccoGate: landscape('tangier/grand-socco-gate', 'People walking through the white horseshoe gate between the Grand Socco and the medina', 'theemanofoth'),
  medinaGateStreet: landscape('tangier/medina-gate-street', 'A white arch framing a busy street at the edge of the Tangier medina', 'theemanofoth'),
  medinaLane: landscape('tangier/medina-lane', 'A narrow whitewashed lane in the medina leading towards bright sunlight', 'theemanofoth'),
  kasbahArch: portrait('tangier/kasbah-arch', 'An arched passage in the Kasbah with white walls and green doors', 'sediri_ayoub'),
  kasbahLanePlant: landscape('tangier/kasbah-lane-plant', 'A quiet stone lane in the old town with a potted plant and lanterns', 'kyllik'),
  marinaSunset: landscape('tangier/marina-sunset', 'Sailing boats moored in the Tangier marina at sunset', 'theemanofoth'),
  whiteFacadeGreenTrim: portrait('tangier/white-facade-green-trim', 'A white building with green shutters and a tree in front of it', 'haykad684'),
  squarePalms: landscape('tangier/square-palms', 'White Spanish-style facades and palm trees on a sunny square', 'lsgerbec'),

  capSpartelSunset: landscape('landmarks/cap-spartel-sunset', 'The Cap Spartel lighthouse among palm trees at sunset, the sea behind', 'todorandonov'),
  capSpartelLighthouse: landscape('landmarks/cap-spartel-lighthouse', 'The stone lighthouse of Cap Spartel with palm trees under a blue sky', 'leviaripronk'),
  capSpartelCliff: portrait('landmarks/cap-spartel-cliff', 'The Cap Spartel lighthouse on its green headland above the ocean', 'madbillzzz'),
  herculesCavesWindow: portrait('landmarks/hercules-caves-window', 'The sea seen through the famous opening of the Caves of Hercules', 'starkie_pics'),
  herculesCavesSea: portrait('landmarks/hercules-caves-sea', 'Waves breaking at the mouth of the Caves of Hercules', 'cosoproductions'),
  herculesCavesSilhouette: landscape('landmarks/hercules-caves-silhouette', 'A visitor in silhouette at the entrance of the cave, looking out to sea', 'youssmub'),
  camelsBeach: landscape('landmarks/camels-beach', 'A line of camels walking along a wide Atlantic beach', 'helixgames'),
  camelRide: portrait('landmarks/camel-ride', 'A rider on a camel at the water’s edge on a sandy beach', 'andri77'),
  coastRocks: landscape('landmarks/coast-rocks', 'Rocky coastline with green scrub above a calm sea', 'theemanofoth'),
  bayFromBeach: landscape('landmarks/bay-from-beach', 'Waves rolling onto the beach with the white city of Tangier in the distance', 'les_trippers'),
  coastRoadDusk: landscape('landmarks/coast-road-dusk', 'Dusk over the coastal road and the sea near Tangier', 'theemanofoth'),

  blueCityHillside: landscape('chefchaouen/blue-city-hillside', 'Blue and white houses of Chefchaouen climbing the hillside under the Rif Mountains', 'infinitexplorer'),
  blueAlley: portrait('chefchaouen/blue-alley', 'A narrow blue-washed alley with stairs and potted plants in Chefchaouen', 'find_something_pretty_everyday'),
  blueStairsMarket: portrait('chefchaouen/blue-stairs-market', 'Blue stairs lined with baskets and crafts in the Chefchaouen medina', 'mohammedlak'),
  blueCourtyard: landscape('chefchaouen/blue-courtyard', 'A blue courtyard with potted plants and traditional decoration in Chefchaouen', 'koullislp'),
  utaElHammam: landscape('chefchaouen/uta-el-hammam', 'People gathering on the main square of Chefchaouen, the mountains behind', 'bethchobanova'),

  asilahMedina: portrait('asilah/asilah-medina', 'Whitewashed houses with blue trim in the Asilah medina', 'mohammedlak'),
  asilahBlueWindow: portrait('asilah/blue-window', 'A blue wooden window set in a white wall', 'mohammedlak'),
  asilahWindowMural: portrait('asilah/window-mural', 'A wooden shutter and a painted mural on a white wall', 'abdelhamid_az'),
  asilahBeachWaves: landscape('asilah/beach-waves', 'A sandy Atlantic beach with waves and a white town on the headland', 'theemanofoth'),

  couscous: landscape('food/couscous', 'A plate of couscous with caramelised onions and raisins', 'theemanofoth'),
  tagineCeramic: landscape('food/tagine-ceramic', 'A ceramic tagine decorated with Arabic calligraphy', 'theemanofoth'),
  taginesClay: portrait('food/tagines-clay', 'Clay pots of slow-cooked meat and vegetables', 'altimod'),
  spiceMarket: portrait('food/spice-market', 'Pyramids of coloured spices and dried goods on a market stall', 'alessionord'),
  spiceBags: landscape('food/spice-bags', 'Colourful sacks of spices and dried flowers in a souk', 'packetdiscards'),
  mintTea: landscape('food/mint-tea', 'Glasses of mint tea in silver holders', 'jonathanpielmayer'),
  teaPastries: landscape('food/tea-pastries', 'A silver teapot and Moroccan pastries', 'rachidnl'),
  moroccanTable: landscape('food/moroccan-table', 'A table laid with Moroccan dishes, bread and tea', 'anniespratt'),

  potteryShelves: landscape('craft/pottery-shelves', 'Shelves of hand-painted pottery and plates in a shop', 'theemanofoth'),
  mirrors: landscape('craft/mirrors', 'Rows of small painted mirrors in a craft shop', 'theemanofoth'),
  potteryShop: portrait('craft/pottery-shop', 'A pottery shop with stacked bowls and plates', 'sandertraa'),
  carpetShop: portrait('craft/carpet-shop', 'A woman in a hat in front of a carpet shop in the souk', 'rumanamin'),
  soukLane: portrait('craft/souk-lane', 'A narrow lane in the souk with textiles hanging above the stalls', 'sandertraa'),
} satisfies Record<string, ImageAsset>

export type ImageKey = keyof typeof images

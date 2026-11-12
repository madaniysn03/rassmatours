import { images, type ImageAsset } from './images'

/**
 * Galerie défilante de la page Tours : photos originales de Rassma Tours (fournies par le client).
 * Fichiers dans public/images/gallery/ ; dimensions = celles du fichier maître (hauteur max 900 px).
 */
const photo = (name: string, alt: string, width: number, height: number): ImageAsset => ({
  src: `/images/gallery/${name}.jpg`,
  src900: `/images/gallery/${name}.jpg`,
  alt,
  width,
  height,
  credit: 'Rassma Tours',
})

export type GalleryItem =
  | { kind: 'image'; image: ImageAsset }
  | { kind: 'video'; src: string; poster: string; label: string; width: number; height: number }
  /** Image envoyée depuis /admin/ (stockée par backend-api) : une version pleine et une réduite, en WebP. */
  | { kind: 'upload'; id: string; src: string; small: string; alt: string; width: number; height: number }

const img = (image: ImageAsset): GalleryItem => ({ kind: 'image', image })

/** Deux rangées qui défilent en sens opposé : on alterne visages de clients et détails de Tangier. */
export const galleryRows: GalleryItem[][] = [
  [
    img(photo('guests-camel-ride-atlantic', 'Five guests waving from their camels on a clifftop above the Atlantic near Tangier', 1256, 900)),
    img(photo('painted-woodwork', 'Hand-painted woodwork with a yellow geometric star pattern', 675, 900)),
    img(photo('guests-cap-spartel-sign', 'Two guests with their guide at the Cap Spartel sign, where the Mediterranean meets the Atlantic', 693, 900)),
    img(photo('spice-basket', 'A woven basket of Moroccan spices, from cinnamon and star anise to turmeric and rosebuds', 590, 640)),
    img(photo('guests-asilah-ramparts', 'A couple on the ramparts of Asilah, with the white medina and the ocean behind', 1200, 900)),
    {
      kind: 'video',
      src: '/video/mint-tea-pouring.mp4',
      poster: '/video/mint-tea-pouring-poster.jpg',
      label: 'Mint tea poured from a silver teapot at a café table',
      width: 540,
      height: 960,
    },
    img(photo('medina-courtyard-doors', 'A whitewashed medina courtyard with carved wooden doors and potted plants', 480, 640)),
    img(photo('guests-cruise-port-welcome', 'Two cruise passengers with their guide at the port of Tangier, the ship behind them', 1382, 900)),
    img(photo('craft-shop-inlay', 'A craft shop full of mother-of-pearl inlaid furniture and painted pottery', 480, 640)),
    img(photo('guests-cafe-terrace-sea', 'Two guests with mint tea on a café terrace above the sea', 675, 900)),
  ],
  [
    img(photo('family-old-mountain-viewpoint', 'A family with their Rassma Tours guide at a viewpoint on the Old Mountain, sea mist over the strait', 1200, 900)),
    img(photo('leather-camel-souvenirs', 'Leather camel souvenirs lined up on a stall in a medina alley', 480, 640)),
    img(photo('guests-private-van-port', 'Guests and their guide beside the private van at the cruise terminal', 541, 900)),
    img(photo('synagogue-torah-ark', 'Torah scrolls in the open ark of a historic synagogue', 640, 557)),
    img(photo('guests-lunch-mint-tea', 'Guests at lunch on a shaded garden terrace as the waiter pours mint tea', 1200, 900)),
    img(photo('palm-sculpture-seafront', 'A palm tree and the sea framed by a keyhole-shaped metal sculpture', 360, 640)),
    img(images.guestsOldMountain),
    img(photo('craftsman-painted-woodwork', 'A craftsman working on painted woodwork and zellige above a doorway', 442, 640)),
    img(photo('guests-camel-misty-beach', 'Two guests greeting a resting camel on a misty beach', 480, 640)),
    img(photo('scented-stones-stall', 'Colourful heaps of scented stones and dried rosebuds at a medina stall', 480, 640)),
    img(photo('garden-fountain-palm', 'A marble fountain over a green zellige basin in a garden of palms', 675, 900)),
  ],
]

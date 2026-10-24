/**
 * Témoignages publiés sur la page d’accueil de tangierbyguide.com (20/10/2026), repris tels quels.
 * Le client doit confirmer qu’ils sont authentiques et autorisés avant mise en ligne.
 */
export type Testimonial = {
  quote: string
  name: string
  origin: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'Our guide Said was fantastic! He knew Tangier’s history perfectly and showed us beautiful places we would never have found on our own.',
    name: 'Marie L.',
    origin: 'France',
  },
  {
    quote:
      'Exceptional excursion to Chefchaouen. The journey was comfortable and our guide was very attentive and informative. I highly recommend!',
    name: 'John D.',
    origin: 'United States',
  },
  {
    quote:
      'Perfect tour of Tangier’s medina. Our guide spoke perfect English and answered all our questions. An authentic experience!',
    name: 'Sophie M.',
    origin: 'Spain',
  },
]

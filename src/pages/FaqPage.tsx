import { PageHero } from '../components/PageHero'
import { Faq } from '../components/Faq'
import { CtaBand } from '../components/CtaBand'
import { images } from '../data/images'
import { faq, practicalFaq, spainFaq } from '../data/faq'
import { absoluteUrl, useHead } from '../lib/head'

export function FaqPage() {
  useHead({
    title: 'FAQ: Tangier Day Trips from Spain & Private Tours',
    description:
      'Answers to common questions about a Tangier day trip from southern Spain: the Tarifa ferry, visas, currency, payment, transfers and our private tours.',
    path: '/faq/',
    image: images.marinaSunset,
    preload: { image: images.marinaSunset },
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'FAQ', path: '/faq/' },
    ],
    jsonLd: [
      {
        '@type': 'FAQPage',
        '@id': `${absoluteUrl('/faq/')}#faq`,
        mainEntity: faq.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.answer },
        })),
      },
    ],
  })

  return (
    <>
      <PageHero
        image={images.marinaSunset}
        eyebrow="FAQ"
        height="short"
        title={
          <>
            Your questions, <em className="font-display-italic">answered</em>
          </>
        }
        text="Everything you need to know before crossing from Spain and touring Tangier with us."
      />

      <section className="py-16 lg:py-24">
        <div className="wrap-narrow">
          <Faq items={spainFaq} eyebrow="From Spain" title="Coming from southern Spain" />
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-24">
        <div className="wrap-narrow">
          <Faq items={practicalFaq} eyebrow="Practical" title="Money, booking and tours" />
        </div>
      </section>

      <CtaBand />
    </>
  )
}

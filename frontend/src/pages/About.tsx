import { PageHero } from '../components/PageHero'
import { SectionHeading } from '../components/SectionHeading'
import { SmartImage } from '../components/SmartImage'
import { CtaBand } from '../components/CtaBand'
import { Button } from '../components/Button'
import { images } from '../data/images'
import { siteConfig } from '../data/site'
import { useHead } from '../lib/head'

/** Valeurs publiées sur la page « About » du site existant, reformulées. */
const values = [
  {
    title: 'Authenticity',
    text: 'We show you the real Morocco: its traditions, its food and its way of life, beyond the tourist clichés.',
  },
  {
    title: 'Passion',
    text: 'Our love for this country is in every tour and every conversation. We would rather show you one place well than ten in a hurry.',
  },
  {
    title: 'Connection',
    text: 'We build bridges between cultures and make room for real exchanges with the people you meet along the way.',
  },
]

const howWeWork = [
  ['Private only', 'Every tour is for you and your companions alone. No strangers, no fixed schedule.'],
  ['Shaped around you', 'Interests, pace, mobility, children, cruise or ferry times: we adapt the day to them.'],
  ['In your language', `Our guides speak ${siteConfig.languages.join(', ')}.`],
  ['Comfortable and safe', 'Private, modern, air-conditioned vehicles with accredited guides and drivers.'],
  ['Simple to arrange', `A message on WhatsApp or through our form is enough. ${siteConfig.contact.responseTime}`],
  ['Straightforward payment', 'Cash in dirhams or euros at the end of the tour; a deposit is required for some tours and dates.'],
]

export function About() {
  useHead({
    title: 'About Rassma Tours, Local Guides in Tangier',
    description:
      'Rassma Tours is a team of local guides in Tangier, offering private, personalised tours of the city and northern Morocco in English, French, Spanish and Arabic.',
    path: '/about/',
    image: images.kasbahWalls,
    preload: { image: images.kasbahWalls },
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about/' },
    ],
  })

  return (
    <>
      <PageHero
        image={images.kasbahWalls}
        eyebrow="About us"
        height="short"
        title={
          <>
            Local guides in Tangier, <em className="font-display-italic">hosts first</em>
          </>
        }
        text="A team of local guides who love Tangier and share it the way they would with friends."
      />

      <section className="py-24 lg:py-32" aria-labelledby="story-title">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Our story"
              title={
                <span id="story-title">
                  Born from a love of <em className="font-display-italic">Tangier</em>
                </span>
              }
            />
            <div className="prose-editorial reveal mt-8">
              <p>
                Rassma Tours was founded by enthusiasts of Tangier and its long, layered history. The agency grew out of a
                simple wish: to share the city we live in, and the treasures around it, with travellers from all over the
                world.
              </p>
              <p>
                From the beginning we have chosen to offer authentic, personalised experiences, with attention to service
                and to every detail of your day. Our team is made up of experienced local professionals who are passionate about
                their culture and heritage, and who speak several languages so that nothing stands between you and the
                place.
              </p>
              <p>
                Our mission is to help you experience the real Morocco, beyond the clichés: experiences that genuinely
                connect you with our culture, our history and our people.
              </p>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="grid grid-cols-5 gap-4">
              <SmartImage image={images.kasbahArch} className="reveal-image col-span-3 aspect-[4/5] rounded-2xl" sizes="(min-width: 1024px) 30vw, 60vw" />
              <div className="col-span-2 flex flex-col gap-4 pt-12">
                <SmartImage image={images.teaPastries} className="reveal-image aspect-square rounded-2xl" sizes="(min-width: 1024px) 20vw, 40vw" />
                <SmartImage image={images.cafeBaba} className="reveal-image aspect-square rounded-2xl" sizes="(min-width: 1024px) 20vw, 40vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-midnight py-24 text-ivory lg:py-32" aria-labelledby="values-title">
        <div className="wrap">
          <SectionHeading eyebrow="What we believe" tone="ivory" align="center" title={<span id="values-title">Three words we work by</span>} />
          <ul className="mt-14 grid gap-10 md:grid-cols-3">
            {values.map((v, i) => (
              <li key={v.title} className="reveal border-t border-ivory/15 pt-7" style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}>
                <h3 className="text-3xl">{v.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ivory/75" style={{ fontWeight: 300 }}>
                  {v.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 lg:py-32" aria-labelledby="how-title">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="How we work" title={<span id="how-title">What to expect from your private tour in Tangier</span>} text="The practical side of hospitality: the things that make a day easy." />
            <div className="reveal mt-9">
              <Button to="/contact/" variant="midnight">
                Get in touch
              </Button>
            </div>
          </div>
          <dl className="reveal grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7">
            {howWeWork.map(([title, text]) => (
              <div key={title} className="border-t border-line pt-5">
                <dt className="font-display text-2xl">{title}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink-soft" style={{ fontWeight: 300 }}>
                  {text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

import { useEffect, useRef, useState } from 'react'

export type ScrollVideoCaption = { eyebrow: string; title: string; text: string }

type ScrollVideoProps = {
  /** Fichier MP4 pour les écrans larges (encodé avec des images clés rapprochées). */
  src: string
  /** Variante plus légère pour les écrans étroits. */
  srcNarrow?: string
  poster: string
  /** Décrit la vidéo pour les lecteurs d’écran. */
  label: string
  captions: ScrollVideoCaption[]
  /** Crédit affiché discrètement en bas à droite. */
  credit?: string
}

/**
 * Vidéo pilotée par le défilement : la section est haute, le cadre reste collé à l’écran et la
 * lecture avance proportionnellement à la position de défilement (scrubbing). Les légendes
 * changent par étape. Sans JavaScript, avec « réduire les animations » ou tant que la vidéo n’est
 * pas chargée, l’affiche (poster) tient lieu de visuel. Le fichier n’est demandé qu’à l’approche
 * de la section, pour ne pas peser sur le premier affichage.
 */
export function ScrollVideo({ src, srcNarrow, poster, label, captions, credit }: ScrollVideoProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      // Événement externe (préférence système) : on fige la vidéo sur l’affiche.
      queueMicrotask(() => setReduced(true))
      return
    }

    const chosen = srcNarrow && window.innerWidth < 768 ? srcNarrow : src
    let ready = false
    let inView = false
    let target = 0
    let current = 0
    let raf = 0
    let lastActive = 0

    const seekTo = (p: number) => {
      if (!ready || !video.duration) return
      const t = p * Math.max(0, video.duration - 0.05)
      if (Math.abs(video.currentTime - t) > 0.015) video.currentTime = t
    }

    const onLoaded = () => {
      ready = true
      // Dès que la durée est connue, on aligne la première image sur la position courante.
      current = target
      seekTo(target)
    }
    video.addEventListener('loadedmetadata', onLoaded)

    // Chargement différé : la vidéo n’est demandée qu’à un écran de distance.
    const loader = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          video.src = chosen
          video.preload = 'auto'
          video.load()
          loader.disconnect()
        }
      },
      { rootMargin: '100% 0px 100% 0px' },
    )
    loader.observe(section)

    const measure = () => {
      const rect = section.getBoundingClientRect()
      const travel = section.offsetHeight - window.innerHeight
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0
      target = p
      section.style.setProperty('--progress', p.toFixed(4))
      const step = Math.min(captions.length - 1, Math.floor(p * captions.length))
      if (step !== lastActive) {
        lastActive = step
        setActive(step)
      }
      // Sans images d’animation (onglet en arrière-plan), on se cale directement sur la cible.
      if (document.hidden) {
        current = p
        seekTo(p)
      }
    }

    const tick = () => {
      // Lissage : la tête de lecture rattrape la cible en douceur plutôt qu’au pixel près.
      current += (target - current) * 0.16
      seekTo(current)
      if (inView) raf = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      if (!document.hidden && inView) {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    const visibility = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting)
        if (inView) {
          measure()
          cancelAnimationFrame(raf)
          raf = requestAnimationFrame(tick)
        }
      },
      { threshold: 0 },
    )
    visibility.observe(section)

    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    measure()

    return () => {
      cancelAnimationFrame(raf)
      loader.disconnect()
      visibility.disconnect()
      video.removeEventListener('loadedmetadata', onLoaded)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [src, srcNarrow, captions.length])

  return (
    <section ref={sectionRef} className="scroll-video relative bg-midnight-deep text-ivory" aria-label={label} style={{ height: reduced ? 'auto' : `${100 + captions.length * 80}vh` }}>
      <div className={`${reduced ? 'relative min-h-[70svh]' : 'sticky top-0 h-[100svh]'} overflow-hidden`}>
        {/* Affiche en image paresseuse (et non en attribut poster, chargé trop tôt) : visible sans JavaScript et avant la vidéo. */}
        <img src={poster} alt="" loading="lazy" decoding="async" width={1024} height={576} className="absolute inset-0 h-full w-full object-cover" />
        <video
          ref={videoRef}
          muted
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight-deep/85 via-midnight-deep/20 to-midnight-deep/30" />

        <div className="wrap relative flex h-full flex-col justify-end pb-14 lg:pb-20">
          <div className="relative min-h-[11rem] max-w-xl sm:min-h-[12rem]">
            {captions.map((c, i) => (
              <div
                key={c.title}
                className={`scroll-video__caption ${i === active || (reduced && i === 0) ? 'is-active' : ''}`}
                aria-hidden={i !== active}
              >
                <span className="eyebrow mb-4">{c.eyebrow}</span>
                <h3 className="display-md">{c.title}</h3>
                <p className="mt-4 text-lg text-ivory/85" style={{ fontWeight: 300 }}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>
          {!reduced && (
            <div className="mt-8 flex items-center gap-4" aria-hidden>
              <span className="scroll-video__bar h-px flex-1 bg-ivory/25">
                <span className="block h-full origin-left bg-brass" style={{ transform: 'scaleX(var(--progress, 0))' }} />
              </span>
              <span className="eyebrow-plain text-ivory/60">Scroll</span>
            </div>
          )}
          {credit && <p className="mt-4 text-[11px] text-ivory/45">{credit}</p>}
        </div>
      </div>
    </section>
  )
}

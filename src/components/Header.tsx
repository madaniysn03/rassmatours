import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { siteConfig } from '../data/site'
import { useScrolled } from '../hooks/useScrolled'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { whatsappLink } from '../lib/contact-links'
import { Button } from './Button'
import { Wordmark } from './Wordmark'
import { ArrowRightIcon, CloseIcon, MenuIcon, WhatsAppIcon } from './Icons'

/**
 * En-tête fixe : transparent sur le visuel d’ouverture de chaque page, puis ivoire au défilement.
 * Le panneau mobile est rendu hors du <header> (le flou d’arrière-plan créerait sinon un bloc conteneur).
 */
export function Header() {
  const scrolled = useScrolled(40)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useLockBodyScroll(open)
  const close = () => setOpen(false)

  // Fermeture clavier + retour du focus sur le bouton.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Retour au format bureau : on referme le panneau.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const solid = scrolled || open
  const headerClass = solid
    ? 'bg-ivory/92 text-ink shadow-[0_1px_0_rgb(27_26_23/0.08)] backdrop-blur-md'
    : 'bg-transparent text-ivory'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 motion-reduce:transition-none ${headerClass}`}
      >
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-6 lg:h-[5.5rem]">
          <Link to="/" className="rounded-md">
            <Wordmark tone={solid ? 'ink' : 'ivory'} size="sm" />
            <span className="sr-only">, home</span>
          </Link>

          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-9">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `link-line whitespace-nowrap rounded-sm ${isActive ? 'after:scale-x-100' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-current/30 transition-colors hover:bg-current/10"
              aria-label="Message us on WhatsApp"
            >
              <WhatsAppIcon size={18} />
            </a>
            <Button to="/contact/" size="sm" variant={solid ? 'midnight' : 'light'} className="whitespace-nowrap" data-cta="header_plan_trip">
              Plan your trip
            </Button>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-current/30 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-ivory text-ink lg:hidden"
      >
        <nav aria-label="Mobile navigation" className="wrap flex h-full flex-col py-8">
          <ul className="flex flex-col divide-y divide-line">
            <li>
              <Link to="/" onClick={close} className="flex items-center justify-between py-5 font-display text-3xl">
                Home
                <ArrowRightIcon size={22} className="text-brass" />
              </Link>
            </li>
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link to={item.href} onClick={close} className="flex items-center justify-between py-5 font-display text-3xl">
                  {item.label}
                  <ArrowRightIcon size={22} className="text-brass" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Button to="/contact/" size="lg" variant="midnight" onClick={close}>
              Plan your trip
            </Button>
            <Button href={whatsappLink()} target="_blank" rel="noopener noreferrer" size="lg" variant="outline" onClick={close}>
              <WhatsAppIcon size={18} />
              WhatsApp
            </Button>
            <p className="note text-center">
              {siteConfig.contact.phoneDisplay} · {siteConfig.contact.email}
            </p>
          </div>
        </nav>
      </div>
    </>
  )
}

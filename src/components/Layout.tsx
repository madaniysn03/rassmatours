import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollManager } from './ScrollManager'
import { WhatsAppFab } from './WhatsAppFab'
import { ConsentBanner } from './ConsentBanner'
import { attachClickTracking, initAnalytics, trackPageView } from '../lib/analytics'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    initAnalytics()
    return attachClickTracking()
  }, [])

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <main id="content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
      <ConsentBanner />
    </>
  )
}

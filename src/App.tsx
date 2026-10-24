import { Navigate, Route, Routes, useParams } from 'react-router'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Tours } from './pages/Tours'
import { TourDetail } from './pages/TourDetail'
import { Destinations } from './pages/Destinations'
import { DestinationDetail } from './pages/DestinationDetail'
import { SpainDayTrips } from './pages/SpainDayTrips'
import { SpainCity } from './pages/SpainCity'
import { FerryGuide } from './pages/FerryGuide'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Privacy } from './pages/Privacy'
import { NotFound } from './pages/NotFound'

/** Redirection client des anciennes URL /experiences/* (les hébergeurs font la même chose en 301). */
function LegacyTourRedirect() {
  const { slug = '' } = useParams()
  const target = slug === 'tangier-highlights' ? 'cap-spartel-hercules-caves' : slug
  return <Navigate to={`/tours/${target}/`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/tangier-highlights" element={<Navigate to="/tours/cap-spartel-hercules-caves/" replace />} />
        <Route path="tours/:slug" element={<TourDetail />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="destinations/:slug" element={<DestinationDetail />} />
        <Route path="day-trips-from-spain" element={<SpainDayTrips />} />
        <Route path="day-trips-from-spain/:slug" element={<SpainCity />} />
        <Route path="tangier-ferry-guide" element={<FerryGuide />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="experiences" element={<Navigate to="/tours/" replace />} />
        <Route path="experiences/:slug" element={<LegacyTourRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DiscoverPage from './pages/DiscoverPage'
import EventsPage from './pages/EventsPage'
import CommunityPage from './pages/CommunityPage'
import HealthPage from './pages/HealthPage'
import ProfilePage from './pages/ProfilePage'
import GpsTrackingPage from './pages/GpsTrackingPage'
import BottomNavigation from './components/BottomNavigation'
import OnboardingFlow from './components/OnboardingFlow'
import { EventsProvider } from './contexts/EventsContext'
import { CommunityProvider } from './contexts/CommunityContext'
import { HealthProvider } from './contexts/HealthContext'
import { GpsTrackingProvider } from './contexts/GpsTrackingContext'

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = React.useState(false)

  if (!isOnboardingComplete) {
    return <OnboardingFlow onComplete={() => setIsOnboardingComplete(true)} />
  }

  return (
    <HealthProvider>
      <CommunityProvider>
        <EventsProvider>
          <GpsTrackingProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <div className="pb-20"> {/* Add padding bottom for bottom navigation */}
                  <Routes>
                    <Route path="/" element={<DiscoverPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/health" element={<HealthPage />} />
                    <Route path="/gps-tracking" element={<GpsTrackingPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </div>
                <BottomNavigation />
              </div>
            </Router>
          </GpsTrackingProvider>
        </EventsProvider>
      </CommunityProvider>
    </HealthProvider>
  )
}

export default App

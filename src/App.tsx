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
import { ProfileProvider } from './contexts/ProfileContext'
import { useOnboarding } from './hooks/useOnboarding'

function App() {
  const { onboardingData, isLoading } = useOnboarding()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-earth-600 font-body">Loading...</p>
        </div>
      </div>
    )
  }

  if (!onboardingData.isCompleted) {
    return <OnboardingFlow onComplete={() => {}} />
  }

  return (
    <HealthProvider>
      <CommunityProvider>
        <EventsProvider>
          <GpsTrackingProvider>
            <ProfileProvider>
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
            </ProfileProvider>
          </GpsTrackingProvider>
        </EventsProvider>
      </CommunityProvider>
    </HealthProvider>
  )
}

export default App

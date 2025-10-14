import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DiscoverPage from './pages/DiscoverPage'
import EventsPage from './pages/EventsPage'
import CommunityPage from './pages/CommunityPage'
import HealthPage from './pages/HealthPage'
import ProfilePage from './pages/ProfilePage'
import MatchesPage from './pages/MatchesPage'
import ChatPage from './pages/ChatPage'
import BottomNavigation from './components/BottomNavigation'
import OnboardingFlow from './components/OnboardingFlow'
import LoadingScreen from './components/LoadingScreen'
import { EventsProvider } from './contexts/EventsContext'
import { CommunityProvider } from './contexts/CommunityContext'
import { HealthProvider } from './contexts/HealthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import { ChatProvider } from './contexts/ChatContext'
import { useOnboarding } from './hooks/useOnboarding'

function App() {
  const { onboardingData, isLoading } = useOnboarding()
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)

  // Check if onboarding was already completed on app load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pawfect-match-onboarding')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.isCompleted) {
          console.log('🚀 App loaded - onboarding already completed!')
          setOnboardingCompleted(true)
        }
      }
    } catch (error) {
      console.error('Error checking initial onboarding state:', error)
    }
  }, [])

  // Monitor onboarding completion from localStorage or hook
  useEffect(() => {
    if (onboardingData.isCompleted) {
      console.log('🎉 Onboarding completed - transitioning to main app!')
      setOnboardingCompleted(true)
    } else {
      // Fallback: Check localStorage directly
      try {
        const stored = localStorage.getItem('pawfect-match-onboarding')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.isCompleted) {
            console.log('🔍 Found completed onboarding in localStorage, forcing transition!')
            setOnboardingCompleted(true)
          }
        }
      } catch (error) {
        console.error('Error checking localStorage:', error)
      }
    }
  }, [onboardingData.isCompleted])

  // Force completion when callback is triggered
  const handleOnboardingComplete = () => {
    console.log('🔄 Onboarding completion callback received!')
    setOnboardingCompleted(true)
  }

  console.log('🏗️ App render - isLoading:', isLoading, 'isCompleted:', onboardingData.isCompleted, 'onboardingCompleted:', onboardingCompleted)

  if (isLoading) {
      console.log('⏳ Showing loading screen...')
      return <LoadingScreen message="Loading Pawmatch™..." />
  }

  if (!onboardingData.isCompleted && !onboardingCompleted) {
    console.log('📝 Showing onboarding flow...')
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  console.log('🎉 Showing main app interface!')

  return (
    <HealthProvider>
      <CommunityProvider>
        <EventsProvider>
            <ChatProvider>
              <ProfileProvider>
                <Router>
                <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
                  <div className="pb-20"> {/* Add padding bottom for bottom navigation */}
                    <Routes>
                      <Route path="/" element={<Navigate to="/discover" replace />} />
                      <Route path="/discover" element={<DiscoverPage />} />
                      <Route path="/matches" element={<MatchesPage />} />
                      <Route path="/chat/:conversationId" element={<ChatPage />} />
                      <Route path="/events" element={<EventsPage />} />
                      <Route path="/community" element={<CommunityPage />} />
                      <Route path="/health" element={<HealthPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                  </div>
                  <BottomNavigation />
                </div>
                </Router>
              </ProfileProvider>
            </ChatProvider>
        </EventsProvider>
      </CommunityProvider>
    </HealthProvider>
  )
}

export default App

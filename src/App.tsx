import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
import { NotificationProvider } from './contexts/NotificationContext'
import { useOnboarding } from './hooks/useOnboarding'
import { pageVariants } from './utils/animations'

// Page transition wrapper component
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// App content component that can use navigate hook
const AppContent: React.FC = () => {
  const navigate = useNavigate()
  const { onboardingData, isLoading } = useOnboarding()
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)

  // Check if onboarding was already completed on app load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pawfect-match-onboarding')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.isCompleted) {
          console.log('✅ Onboarding already completed, setting state')
          setOnboardingCompleted(true)
        }
      }
    } catch (error) {
      console.error('Error checking localStorage:', error)
    }
  }, [onboardingData.isCompleted])

  // Force completion when callback is triggered
  const handleOnboardingComplete = () => {
    console.log('🔄 Onboarding completion callback received!')
    setOnboardingCompleted(true)
    // Navigate to discover page after onboarding completion
    navigate('/discover')
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <div className="pb-28 sm:pb-24"> {/* Add more padding bottom for bottom navigation on mobile */}
        <PageTransition>
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
        </PageTransition>
      </div>
      <BottomNavigation />
    </div>
  )
}

function App() {
  return (
    <HealthProvider>
      <CommunityProvider>
        <EventsProvider>
          <NotificationProvider>
            <ChatProvider>
              <ProfileProvider>
                <Router>
                  <AppContent />
                </Router>
              </ProfileProvider>
            </ChatProvider>
          </NotificationProvider>
        </EventsProvider>
      </CommunityProvider>
    </HealthProvider>
  )
}

export default App

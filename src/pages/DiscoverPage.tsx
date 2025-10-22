import React, { useState, useEffect, useMemo } from 'react'
import { MapPin, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SwipeInterface from '../components/SwipeInterface'
import FeatureShowcase from '../components/FeatureShowcase'
import DogOfTheDay from '../components/DogOfTheDay'
import Logo from '../components/Logo'
import LoadingScreen from '../components/LoadingScreen'
import { buttonVariants, iconVariants } from '../utils/animations'
import { DogProfile } from '../components/DogProfileCard'
import NotificationPermissionBanner from '../components/NotificationPermissionBanner'
import { useNotifications } from '../contexts/NotificationContext'
import { useProfile } from '../contexts/ProfileContext'
import { UserProfile } from '../contexts/ProfileContext'
import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/localStorage'

// Mock data for dogs
const mockDogs: DogProfile[] = [
  {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 3,
    size: 'Large',
    energyLevel: 'High',
    friendliness: 'Very Friendly',
    distance: 0.5,
    location: 'Central Park',
    photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'],
    bio: 'Buddy is a friendly and energetic Golden Retriever who loves playing fetch and going on long walks. He\'s great with kids and other dogs!',
    ownerNotes: 'Loves tennis balls and swimming!'
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Border Collie',
    age: 2,
    size: 'Medium',
    energyLevel: 'High',
    friendliness: 'Friendly',
    distance: 1.2,
    location: 'Dogwood Park',
    photos: ['https://www.bellaandduke.com/wp-content/uploads/2025/07/A-guide-to-Border-Collies-Lifespan-temperament-health-and-the-best-food-for-them-featured-image.webp'],
    bio: 'Luna is a brilliant Border Collie who excels at herding and agility. She\'s incredibly smart and loves learning new tricks and commands.',
    ownerNotes: 'Fun Fact: Luna can count to 10 and knows all her colors!'
  }
]

// Function to convert UserProfile to DogProfile for matching
const convertUserProfileToDogProfile = (userProfile: UserProfile): DogProfile => {
  // Determine dog size based on breed (simplified logic)
  const getDogSize = (breed: string): 'Small' | 'Medium' | 'Large' | 'Extra Large' => {
    const smallBreeds = ['pomeranian', 'chihuahua', 'yorkshire', 'maltese', 'shih tzu']
    const largeBreeds = ['golden retriever', 'labrador', 'german shepherd', 'rottweiler', 'mastiff']
    
    const breedLower = breed.toLowerCase()
    if (smallBreeds.some(b => breedLower.includes(b))) return 'Small'
    if (largeBreeds.some(b => breedLower.includes(b))) return 'Large'
    return 'Medium'
  }

  // Determine energy level based on breed (simplified logic)
  const getEnergyLevel = (breed: string): 'Low' | 'Medium' | 'High' => {
    const highEnergyBreeds = ['border collie', 'australian shepherd', 'jack russell', 'beagle', 'husky']
    const lowEnergyBreeds = ['bulldog', 'basset hound', 'great dane', 'mastiff', 'saint bernard']
    
    const breedLower = breed.toLowerCase()
    if (highEnergyBreeds.some(b => breedLower.includes(b))) return 'High'
    if (lowEnergyBreeds.some(b => breedLower.includes(b))) return 'Low'
    return 'Medium'
  }

  // Estimate age from memberSince date
  const getEstimatedAge = (memberSince: string): number => {
    const memberDate = new Date(memberSince)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - memberDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, Math.min(10, Math.floor(diffDays / 30))) // 1-10 years based on membership
  }

  return {
    id: `user-${userProfile.id}`,
    name: userProfile.dogName || 'Unknown',
    breed: userProfile.dogBreed || 'Mixed Breed',
    age: getEstimatedAge(userProfile.memberSince),
    size: getDogSize(userProfile.dogBreed),
    energyLevel: getEnergyLevel(userProfile.dogBreed),
    friendliness: 'Friendly' as const,
    distance: Math.random() * 5 + 0.5, // Random distance 0.5-5.5 miles
    location: userProfile.location || 'Your Area',
    photos: userProfile.dogPhoto ? [userProfile.dogPhoto] : ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'],
    bio: userProfile.dogBio || `Meet ${userProfile.dogName || 'this dog'}, a wonderful companion!`,
    ownerNotes: `Owner: ${userProfile.name}`
  }
}

const DiscoverPage: React.FC = () => {
  const navigate = useNavigate()
  const { requestPermission, permission, sendTestNotification } = useNotifications()
  const { profile: currentUserProfile } = useProfile()
  
  // STATE: User's matched/connected dogs - loaded from localStorage for persistence
  const [connections, setConnections] = useState<DogProfile[]>(() => {
    const result = safeGetItem<DogProfile[]>('dogConnections')
    if (result.success && result.data) {
      return result.data
    }
    return []
  })
  
  // STATE: Dogs the user has skipped/passed on - for analytics and avoiding re-showing
  const [skipped, setSkipped] = useState<DogProfile[]>(() => {
    const result = safeGetItem<DogProfile[]>('dogSkipped')
    if (result.success && result.data) {
      return result.data
    }
    return []
  })
  
  // STATE: User preferences for filtering dogs - loaded from localStorage
  const [preferences] = useState<{
    preferredSizes: string[]
    preferredEnergyLevels: string[]
    maxDistance: number
    ageRange: [number, number]
    preferredBreeds: string[]
  }>(() => {
    const result = safeGetItem<{
      preferredSizes: string[]
      preferredEnergyLevels: string[]
      maxDistance: number
      ageRange: [number, number]
      preferredBreeds: string[]
    }>('dogPreferences')
    if (result.success && result.data) {
      return result.data
    }
    return {
      preferredSizes: ['Small', 'Medium', 'Large'],
      preferredEnergyLevels: ['Low', 'Medium', 'High'],
      maxDistance: 5,
      ageRange: [1, 10],
      preferredBreeds: []
    }
  })

  // STATE: Modal visibility controls
  const [showConnectionsModal, setShowConnectionsModal] = useState(false)
  
  // STATE: Loading and notification states
  const [isLoading, setIsLoading] = useState(true)
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle')

  // Load dogs data - combine mock dogs with real user profiles
  const [dogs] = useState<DogProfile[]>(() => {
    const allDogs = [...mockDogs]
    
    // Load all user profiles from localStorage and convert them to DogProfiles
    try {
      // Get all user profiles (in a real app, this would come from a backend)
      const userProfiles = []
      
      // Check if there's a current user profile
      if (currentUserProfile && currentUserProfile.name && currentUserProfile.dogName) {
        userProfiles.push(currentUserProfile)
      }
      
      // In a real app, you'd load other users' profiles from a backend
      // For now, we'll simulate by adding the current user if they have a complete profile
      const realUserProfiles = userProfiles.filter(profile => 
        profile.name && 
        profile.dogName && 
        profile.dogBreed &&
        profile.id !== 'user-1' // Don't include incomplete profiles
      )
      
      // Convert user profiles to dog profiles
      const userDogProfiles = realUserProfiles.map(convertUserProfileToDogProfile)
      
      // Add user profiles to the dogs array
      allDogs.push(...userDogProfiles)
      
      // Loaded dogs for matching
      
    } catch (error) {
      console.error('Error loading user profiles:', error)
    }
    
    return allDogs
  })

  // Filter dogs based on user preferences
  const filteredDogs = useMemo(() => {
    const matchedDogIds = new Set(connections.map(dog => dog.id))
    const skippedDogIds = new Set(skipped.map(dog => dog.id))
    
    return dogs.filter(dog => {
      // Don't show dogs that have already been matched or skipped
      if (matchedDogIds.has(dog.id) || skippedDogIds.has(dog.id)) {
        return false
      }
      
      // Don't show the current user's own profile
      if (dog.id === `user-${currentUserProfile.id}`) {
        return false
      }
      
      // Apply preference filters
      return (
        preferences.preferredSizes.includes(dog.size) &&
        preferences.preferredEnergyLevels.includes(dog.energyLevel) &&
        dog.distance <= preferences.maxDistance &&
        dog.age >= preferences.ageRange[0] &&
        dog.age <= preferences.ageRange[1]
      )
    })
  }, [dogs, connections, skipped, preferences, currentUserProfile.id])

  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Handle match
  const handleMatch = (dog: DogProfile) => {
    setConnections(prev => {
      const newConnections = [...prev, dog]
      const saveResult = safeSetItem('dogConnections', newConnections)
      if (!saveResult.success) {
        console.error('Failed to save match:', saveResult.error)
      }
      return newConnections
    })
  }

  // Handle dislike
  const handleDislike = (dog: DogProfile) => {
    setSkipped(prev => {
      const newSkipped = [...prev, dog]
      const saveResult = safeSetItem('dogSkipped', newSkipped)
      if (!saveResult.success) {
        console.error('Failed to save dislike:', saveResult.error)
      }
      return newSkipped
    })
  }

  // Handle undo
  const handleUndo = (dog: DogProfile) => {
    setConnections(prev => prev.filter(d => d.id !== dog.id))
    setSkipped(prev => prev.filter(d => d.id !== dog.id))
  }

  // Handle start over
  const handleStartOver = () => {
    setConnections([])
    setSkipped([])
    const removeConnections = safeRemoveItem('dogConnections')
    const removeSkipped = safeRemoveItem('dogSkipped')
    if (!removeConnections.success) {
      console.error('Failed to remove connections:', removeConnections.error)
    }
    if (!removeSkipped.success) {
      console.error('Failed to remove skipped:', removeSkipped.error)
    }
  }

  if (isLoading) {
    return <LoadingScreen message="Finding your perfect matches..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50 pb-32">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-teal-500 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 via-orange-800/70 to-teal-600/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-script font-bold text-white mb-4">
            Discover
          </h1>
          <p className="text-xl text-white/90 font-body max-w-2xl mx-auto">
            Find your perfect dog companion with our intuitive swipe interface
          </p>
        </div>
      </div>

      {/* Notification Permission Banner */}
      <NotificationPermissionBanner />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" showText={false} />
            <h1 className="text-2xl font-display font-bold text-earth-900">Discover</h1>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowConnectionsModal(true)}
                className="btn-icon"
                title="Location settings"
                aria-label="Location settings"
              >
                <MapPin className="w-5 h-5 text-teal-600" />
              </button>
              <motion.button 
                onClick={async () => {
                        if (permission === 'granted') {
                    setNotificationStatus('granted')
                    sendTestNotification()
                    setTimeout(() => setNotificationStatus('idle'), 3000)
                  } else if (permission !== 'denied') {
                    setNotificationStatus('requesting')
                    const success = await requestPermission()
                    if (success) {
                      setNotificationStatus('granted')
                      sendTestNotification()
                    } else {
                      setNotificationStatus('denied')
                    }
                    setTimeout(() => setNotificationStatus('idle'), 3000)
                  } else {
                    setNotificationStatus('denied')
                    alert('Notifications are blocked. Please enable them in your browser settings.')
                    setTimeout(() => setNotificationStatus('idle'), 3000)
                  }
                }}
                className={`btn-icon ${notificationStatus === 'granted' ? 'bg-green-500 hover:bg-green-600' : notificationStatus === 'denied' ? 'bg-red-500 hover:bg-red-600' : notificationStatus === 'requesting' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                title={notificationStatus === 'granted' ? 'Notifications enabled!' : notificationStatus === 'denied' ? 'Notifications blocked' : notificationStatus === 'requesting' ? 'Requesting permission...' : 'Notifications'}
                aria-label="Notifications"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.div
                  variants={iconVariants}
                  animate={notificationStatus === 'requesting' ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: notificationStatus === 'requesting' ? Infinity : 0 }}
                >
                  <Bell className={`w-5 h-5 ${notificationStatus === 'granted' ? 'text-white' : notificationStatus === 'denied' ? 'text-white' : notificationStatus === 'requesting' ? 'text-white' : 'text-teal-600'}`} />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-md mx-auto px-4 py-6 safe-area-bottom">

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-earth-200">
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-orange-500">{connections.length}</div>
                   <div className="text-sm text-earth-600 font-body">Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-teal-600">{dogs.length}</div>
            <div className="text-sm text-earth-600 font-body">Local Dogs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-red-500">{skipped.length}</div>
            <div className="text-sm text-earth-600 font-body">Skipped</div>
          </div>
        </div>

        {/* Discover Interface */}
        <div className="px-4 max-w-md mx-auto">
        <SwipeInterface
          dogs={filteredDogs}
          onMatch={handleMatch}
          onDislike={handleDislike}
            onUndo={handleUndo}
          onStartOver={handleStartOver}
        />

        </div>

        {/* Dog of the Day */}
        <div className="mt-8">
          <DogOfTheDay />
        </div>

        {/* Feature Showcase */}
        <FeatureShowcase />
      </div>

      {/* Connections Modal */}
      {showConnectionsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                <h2 className="text-2xl font-display font-bold">Your Connections</h2>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                  {connections.map((dog) => (
                  <div key={dog.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={dog.photos[0]} 
                        alt={dog.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{dog.name}</h3>
                      <p className="text-sm text-gray-600">{dog.breed}</p>
                      </div>
                    </div>
                  ))}
                </div>
              <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setShowConnectionsModal(false)}
                  className="btn-secondary btn-full"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowConnectionsModal(false)
                    navigate('/matches')
                  }}
                  className="btn-primary-orange btn-full mt-3"
                >
                  Start Matching
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DiscoverPage
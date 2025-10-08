import React, { useState, useEffect, useMemo } from 'react'
import { Filter, MapPin, Bell, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SwipeInterface from '../components/SwipeInterface'
import EventsSuggestion from '../components/EventsSuggestion'
import CommunitySuggestion from '../components/CommunitySuggestion'
import HealthSuggestion from '../components/HealthSuggestion'
import HealthAlert from '../components/HealthAlert'
import TrendingPosts from '../components/TrendingPosts'
import HeroSection from '../components/HeroSection'
import FeatureShowcase from '../components/FeatureShowcase'
import DogOfTheDay from '../components/DogOfTheDay'
import Logo from '../components/Logo'
import LoadingScreen from '../components/LoadingScreen'
import CurrentDogEvents from '../components/CurrentDogEvents'
import { DogProfile } from '../components/DogProfileCard'
import { useEvents } from '../contexts/EventsContext'
import { useCommunity } from '../contexts/CommunityContext'
import NotificationPermissionBanner from '../components/NotificationPermissionBanner'

/**
 * DISCOVER PAGE - Main dog matching interface for Pawmatch™
 * 
 * This is the core feature where users swipe through dog profiles to find potential 
 * playmates for their dogs. Key functionality includes:
 * 
 * 1. Dog Profile Display: Shows 30 diverse dog profiles with photos, bios, and details
 * 2. Swipe Interface: Left to pass, right to like/match
 * 3. Preference Filtering: Users can set size, energy, distance, and age preferences
 * 4. Match System: Saves liked dogs to connections/matches
 * 5. Event Suggestions: Shows relevant events for matched dogs
 * 6. Local Storage: Persists user preferences and matches across sessions
 * 
 * Data Flow:
 * - Loads 30 mock dog profiles from mockDogs array
 * - Filters dogs based on user preferences (size, energy, distance, age)
 * - Handles like/dislike actions and saves to localStorage
 * - Shows event suggestions after matches
 * - Provides preference management modal
 * 
 * State Management:
 * - dogs: Array of all available dog profiles (30 total)
 * - filteredDogs: Dogs that match user preferences (used for swiping)
 * - connections: Dogs the user has liked/matched
 * - preferences: User's filtering preferences (size, energy, distance, age)
 * - currentDogIndex: Index of currently displayed dog in swipe interface
 */

// Mock data for demonstration - 30 diverse dog profiles with realistic data
// Each dog has: id, name, breed, age, size, energyLevel, friendliness, distance, location, photos, bio, ownerNotes
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
    bio: 'Luna is a smart and active Border Collie who excels at agility training. She loves herding and playing with other energetic dogs.',
    ownerNotes: 'Very intelligent, needs mental stimulation!'
  },
  {
    id: '3',
    name: 'Max',
    breed: 'Labrador',
    age: 1,
    size: 'Small',
    energyLevel: 'High',
    friendliness: 'Very Friendly',
    distance: 0.8,
    location: 'Riverside Park',
    photos: ['https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=400&fit=crop'],
    bio: 'Max is a playful Labrador puppy who loves water and retrieving games. He\'s still learning but very eager to make friends!',
    ownerNotes: 'Still in training, very food motivated!'
  },
  {
    id: '4',
    name: 'Bella',
    breed: 'Cavalier King Charles Spaniel',
    age: 4,
    size: 'Small',
    energyLevel: 'Medium',
    friendliness: 'Very Friendly',
    distance: 1.5,
    photos: ['https://www.akc.org/wp-content/uploads/2017/11/Cavalier-King-Charles-Spaniel-standing-in-the-grass.jpg'],
    bio: 'Bella is a gentle and affectionate Cavalier who loves cuddles and gentle play. She gets along well with all dogs and people.',
    ownerNotes: 'Perfect for calm playdates!'
  },
  {
    id: '5',
    name: 'Charlie',
    breed: 'Beagle',
    age: 2,
    size: 'Medium',
    energyLevel: 'Medium',
    friendliness: 'Very Friendly',
    distance: 0.3,
    photos: ['https://images.unsplash.com/photo-1567014543648-e4391c989aab?w=400&h=400&fit=crop'],
    bio: 'Charlie is a curious and friendly Beagle who loves exploring and sniffing around. Great with families and other dogs!',
    ownerNotes: 'Loves treats and belly rubs!'
  },
  {
    id: '6',
    name: 'Daisy',
    breed: 'Poodle',
    age: 3,
    size: 'Medium',
    energyLevel: 'Medium',
    friendliness: 'Friendly',
    distance: 1.0,
    photos: ['https://www.borrowmydoggy.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F4ij0poqn%2Fproduction%2F3013812d78ef26ecb8f3dc6ef68716895ee3ddec-500x500.png%3Ffit%3Dmax%26auto%3Dformat&w=1080&q=75'],
    bio: 'Daisy is an intelligent and elegant Poodle who enjoys training and mental challenges. She\'s very well-behaved and loves attention.',
    ownerNotes: 'Excellent with children and other pets!'
  },
  // New Small Dogs
  {
    id: '7',
    name: 'Peanut',
    breed: 'Chihuahua',
    age: 2,
    size: 'Small',
    energyLevel: 'Medium',
    friendliness: 'Friendly',
    distance: 0.7,
    photos: ['https://www.animalbehaviorcollege.com/wp-content/uploads/2015/05/chihuahua.jpg'],
    bio: 'Peanut is a tiny but mighty Chihuahua with a big personality! He loves sunbathing and short walks around the neighborhood.',
    ownerNotes: 'Prefers smaller dogs and gentle play!'
  },
  {
    id: '8',
    name: 'Milo',
    breed: 'Pomeranian',
    age: 1,
    size: 'Small',
    energyLevel: 'High',
    friendliness: 'Very Friendly',
    distance: 1.1,
    photos: ['https://funnyfuzzy.com/cdn/shop/articles/11_1437f285-5b7f-4935-88f3-7090d5e5b221.jpg?v=1754034610&width=500'],
    bio: 'Milo is a fluffy Pomeranian ball of energy! He loves playing with toys and going on adventures. Very social and outgoing.',
    ownerNotes: 'Loves attention and being the center of everything!'
  },
  {
    id: '9',
    name: 'Ruby',
    breed: 'French Bulldog',
    age: 3,
    size: 'Small',
    energyLevel: 'Low',
    friendliness: 'Very Friendly',
    distance: 0.4,
    photos: ['https://images.squarespace-cdn.com/content/v1/5abef86f7e3c3a242ca0bd46/7bb5d762-74c3-445b-97d3-4b40f5038e7b/0Y2A6620.jpg'],
    bio: 'Ruby is a laid-back French Bulldog who enjoys short walks and lots of cuddles. She\'s great with kids and other small dogs.',
    ownerNotes: 'Perfect for relaxed playdates and cuddle sessions!'
  },
  // New Medium Dogs
  {
    id: '10',
    name: 'Rocky',
    breed: 'Australian Shepherd',
    age: 2,
    size: 'Medium',
    energyLevel: 'High',
    friendliness: 'Friendly',
    distance: 0.9,
    photos: ['https://www.akc.org/wp-content/uploads/2017/11/Australian-Shepherd.1.jpg'],
    bio: 'Rocky is an intelligent Australian Shepherd who loves herding and agility training. He needs an active playmate to keep up with!',
    ownerNotes: 'Very smart, loves learning new tricks and commands!'
  },
  {
    id: '11',
    name: 'Zoe',
    breed: 'Cocker Spaniel',
    age: 4,
    size: 'Medium',
    energyLevel: 'Medium',
    friendliness: 'Very Friendly',
    distance: 1.3,
    photos: ['https://dogtime.com/wp-content/uploads/sites/12/2025/02/GettyImages-2154039960-e1738598459869.jpg?w=1024'],
    bio: 'Zoe is a sweet and gentle Cocker Spaniel who loves being pampered and going on moderate walks. Great with families!',
    ownerNotes: 'Loves grooming sessions and gentle play with other dogs!'
  },
  {
    id: '12',
    name: 'Tucker',
    breed: 'Siberian Husky',
    age: 2,
    size: 'Medium',
    energyLevel: 'High',
    friendliness: 'Friendly',
    distance: 0.6,
    photos: ['https://www.dailypaws.com/thmb/B6yWhzGpQZsg3kxMzLn-hvGIF7M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/siberian-husky-100800827-2000-9449ca147e0e4b819bce5189c2411188.jpg'],
    bio: 'Tucker is a spirited Husky who loves running and exploring. He has a lot of energy and needs an active playmate!',
    ownerNotes: 'Very vocal and loves attention!'
  },
  // New Large Dogs
  {
    id: '13',
    name: 'Bear',
    breed: 'Bernese Mountain Dog',
    age: 3,
    size: 'Large',
    energyLevel: 'Medium',
    friendliness: 'Very Friendly',
    distance: 1.4,
    photos: ['https://upload.wikimedia.org/wikipedia/commons/c/cf/Standing_Bernese_Mountain_Dog_Female_%28cropped%29.jpg'],
    bio: 'Bear is a gentle giant Bernese Mountain Dog who loves hiking and being outdoors. He\'s very patient and great with children.',
    ownerNotes: 'Loves long walks and being in nature!'
  },
  {
    id: '14',
    name: 'Athena',
    breed: 'Great Dane',
    age: 2,
    size: 'Large',
    energyLevel: 'Low',
    friendliness: 'Very Friendly',
    distance: 0.8,
    photos: ['https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/07141952/Great-Dane-standing-in-profile-outdoors1.jpg'],
    bio: 'Athena is a majestic Great Dane who thinks she\'s a lap dog! Despite her size, she\'s very gentle and loves cuddles.',
    ownerNotes: 'Very gentle giant, perfect for calm playdates!'
  },
  {
    id: '15',
    name: 'Thor',
    breed: 'French Bulldog',
    age: 4,
    size: 'Small',
    energyLevel: 'Low',
    friendliness: 'Very Friendly',
    distance: 1.0,
    photos: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop'],
    bio: 'Thor is a charming French Bulldog who is incredibly gentle and loving. He enjoys leisurely walks and being around people.',
    ownerNotes: 'Loves being a therapy dog and gentle play with other small dogs!'
  },
  // Additional Small Dogs
  {
    id: '16',
    name: 'Coco',
    breed: 'Shih Tzu',
    age: 2,
    size: 'Small',
    energyLevel: 'Low',
    friendliness: 'Very Friendly',
    distance: 0.6,
    location: 'Sunset Park',
    photos: ['/dogs/cc91727848452a303745474f56c6655f.jpg'],
    bio: 'Coco is a regal Shih Tzu who loves being pampered and going on short, leisurely walks. She\'s very gentle and perfect for calm playdates.',
    ownerNotes: 'Loves grooming sessions and gentle cuddles!'
  },
  {
    id: '17',
    name: 'Oscar',
    breed: 'Dachshund',
    age: 3,
    size: 'Small',
    energyLevel: 'Medium',
    friendliness: 'Friendly',
    distance: 1.2,
    location: 'Maple Grove Park',
    photos: ['/dogs/download.webp'],
    bio: 'Oscar is a spunky Dachshund with a big personality! He loves digging and exploring, and gets along well with other small dogs.',
    ownerNotes: 'Very curious and loves to investigate everything!'
  },
  {
    id: '18',
    name: 'Lola',
    breed: 'Pug',
    age: 1,
    size: 'Small',
    energyLevel: 'Low',
    friendliness: 'Very Friendly',
    distance: 0.8,
    location: 'Riverside Park',
    photos: ['/dogs/R.jfif'],
    bio: 'Lola is a sweet Pug puppy who loves attention and cuddles. She\'s very social and gets along with everyone she meets.',
    ownerNotes: 'Still learning but very eager to please!'
  },
  {
    id: '19',
    name: 'Gizmo',
    breed: 'Yorkshire Terrier',
    age: 4,
    size: 'Small',
    energyLevel: 'High',
    friendliness: 'Friendly',
    distance: 0.9,
    location: 'Central Park',
    photos: ['/dogs/OIP.webp'],
    bio: 'Gizmo is a feisty Yorkshire Terrier with tons of energy! He loves playing and going on adventures, despite his small size.',
    ownerNotes: 'Very protective and loyal to his family!'
  },
  // Additional Medium Dogs
  {
    id: '20',
    name: 'Duke',
    breed: 'Boxer',
    age: 2,
    size: 'Medium',
    energyLevel: 'High',
    friendliness: 'Very Friendly',
    distance: 1.1,
    location: 'Dogwood Park',
    photos: ['/dogs/R (1).jfif'],
    bio: 'Duke is an energetic Boxer who loves playing and roughhousing. He\'s very friendly and great with active families.',
    ownerNotes: 'Loves playing fetch and needs lots of exercise!'
  },
  {
    id: '21',
    name: 'Sadie',
    breed: 'Cocker Spaniel',
    age: 3,
    size: 'Medium',
    energyLevel: 'Medium',
    friendliness: 'Very Friendly',
    distance: 0.7,
    location: 'Sunset Park',
    photos: ['/dogs/OIP (1).webp'],
    bio: 'Sadie is a gentle Cocker Spaniel who loves being around people and other dogs. She enjoys moderate exercise and lots of attention.',
    ownerNotes: 'Very sweet and loves being the center of attention!'
  },
  {
    id: '22',
    name: 'Rex',
    breed: 'German Shepherd',
    age: 3,
    size: 'Medium',
    energyLevel: 'High',
    friendliness: 'Friendly',
    distance: 1.5,
    location: 'Maple Grove Park',
    photos: ['/dogs/OIP (2).webp'],
    bio: 'Rex is an intelligent German Shepherd who loves training and mental challenges. He\'s very loyal and protective of his family.',
    ownerNotes: 'Very smart and loves learning new commands!'
  },
  {
    id: '23',
    name: 'Maya',
    breed: 'Australian Cattle Dog',
    age: 2,
    size: 'Medium',
    energyLevel: 'High',
    friendliness: 'Friendly',
    distance: 1.3,
    location: 'Riverside Park',
    photos: ['/dogs/OIP (3).webp'],
    bio: 'Maya is a hardworking Australian Cattle Dog who loves herding and staying active. She needs a playmate who can keep up with her energy!',
    ownerNotes: 'Very focused and loves having a job to do!'
  },
  {
    id: '24',
    name: 'Finn',
    breed: 'Irish Setter',
    age: 1,
    size: 'Medium',
    energyLevel: 'High',
    friendliness: 'Very Friendly',
    distance: 0.5,
    location: 'Central Park',
    photos: ['/dogs/OIP (4).webp'],
    bio: 'Finn is a playful Irish Setter puppy who loves running and playing. He\'s very social and gets along with everyone.',
    ownerNotes: 'Still learning but very eager to make friends!'
  },
  // Additional Large Dogs
  {
    id: '25',
    name: 'Zeus',
    breed: 'Rottweiler',
    age: 4,
    size: 'Large',
    energyLevel: 'Medium',
    friendliness: 'Friendly',
    distance: 1.6,
    location: 'Dogwood Park',
    photos: ['/dogs/OIP (5).webp'],
    bio: 'Zeus is a gentle giant Rottweiler who is very protective of his family. Despite his size, he\'s very gentle with children.',
    ownerNotes: 'Very loyal and protective, great with families!'
  },
  {
    id: '26',
    name: 'Luna',
    breed: 'Siberian Husky',
    age: 2,
    size: 'Large',
    energyLevel: 'High',
    friendliness: 'Friendly',
    distance: 1.8,
    location: 'Sunset Park',
    photos: ['/dogs/OIP.jfif'],
    bio: 'Luna is a beautiful Siberian Husky who loves running and exploring. She has a lot of energy and needs an active playmate!',
    ownerNotes: 'Very vocal and loves attention!'
  },
  {
    id: '27',
    name: 'Bruno',
    breed: 'Mastiff',
    age: 3,
    size: 'Large',
    energyLevel: 'Low',
    friendliness: 'Very Friendly',
    distance: 1.0,
    location: 'Maple Grove Park',
    photos: ['/dogs/OIP (6).webp'],
    bio: 'Bruno is a massive but gentle Mastiff who loves lounging around and getting belly rubs. He\'s very calm and patient.',
    ownerNotes: 'Perfect for calm playdates and cuddle sessions!'
  },
  {
    id: '28',
    name: 'Stella',
    breed: 'Golden Retriever',
    age: 2,
    size: 'Large',
    energyLevel: 'High',
    friendliness: 'Very Friendly',
    distance: 0.4,
    location: 'Riverside Park',
    photos: ['/dogs/OIP (7).webp'],
    bio: 'Stella is an energetic Golden Retriever who loves playing fetch and swimming. She\'s very friendly and great with kids.',
    ownerNotes: 'Loves water and playing with tennis balls!'
  },
  {
    id: '29',
    name: 'Apollo',
    breed: 'Doberman Pinscher',
    age: 3,
    size: 'Large',
    energyLevel: 'High',
    friendliness: 'Friendly',
    distance: 1.7,
    location: 'Central Park',
    photos: ['/dogs/doberman-pinscher-guide.jpg'],
    bio: 'Apollo is a sleek Doberman who loves training and mental challenges. He\'s very intelligent and needs an active playmate.',
    ownerNotes: 'Very smart and loves learning new tricks!'
  },
  {
    id: '30',
    name: 'Nala',
    breed: 'Labrador Retriever',
    age: 1,
    size: 'Large',
    energyLevel: 'High',
    friendliness: 'Very Friendly',
    distance: 0.3,
    location: 'Dogwood Park',
    photos: ['/dogs/OIP (8).webp'],
    bio: 'Nala is a playful Labrador puppy who loves water and retrieving games. She\'s very social and gets along with everyone.',
    ownerNotes: 'Still learning but very eager to please!'
  }
]

/**
 * DiscoverPage Component - Main dog matching interface
 * 
 * This component manages the entire dog discovery experience including:
 * - Loading and filtering dog profiles
 * - Managing user preferences and matches
 * - Handling swipe interactions (like/dislike)
 * - Persisting data to localStorage
 * - Showing loading states and modals
 */
const DiscoverPage: React.FC = () => {
  const navigate = useNavigate()
  const { events } = useEvents()
  const { posts } = useCommunity()
  
  // Initialize dog profiles array (30 total dogs)
  const [dogs] = useState<DogProfile[]>(mockDogs)
  
  // STATE: User's matched/connected dogs - loaded from localStorage for persistence
  const [connections, setConnections] = useState<DogProfile[]>(() => {
    // Load connections from localStorage on initial render
    const saved = localStorage.getItem('dogConnections')
    console.log('Loading connections from localStorage:', saved)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        console.log('Parsed connections:', parsed)
        return parsed
      } catch (e) {
        console.error('Failed to parse connections:', e)
      }
    }
    console.log('Using empty connections array')
    return []
  })
  
  // STATE: Dogs the user has skipped/passed on - for analytics and avoiding re-showing
  const [skipped, setSkipped] = useState<DogProfile[]>(() => {
    // Load skipped dogs from localStorage on initial render
    const saved = localStorage.getItem('dogSkipped')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse skipped dogs:', e)
      }
    }
    return []
  })
  // UI STATE: Current position in the dog swipe queue
  const [currentDogIndex, setCurrentDogIndex] = useState(0)
  
  // UI STATE: Start Over modal
  const [showStartOverModal, setShowStartOverModal] = useState(false)
  
  // UI STATE: Modal visibility controls
  const [showConnectionsModal, setShowConnectionsModal] = useState(false)
  const [showPreferencesModal, setShowPreferencesModal] = useState(false)
  
  // UI STATE: Loading and notification states
  const [isLoading, setIsLoading] = useState(true)
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  
  // STATE: User preferences for filtering dogs - loaded from localStorage
  const [preferences, setPreferences] = useState(() => {
    // Load preferences from localStorage on initial render
    const saved = localStorage.getItem('dogPreferences')
    console.log('Loading preferences from localStorage:', saved)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        console.log('Parsed preferences:', parsed)
        return parsed
      } catch (e) {
        console.error('Failed to parse preferences:', e)
      }
    }
    console.log('Using default preferences')
    return {
      preferredSizes: ['Small', 'Medium', 'Large'],
      preferredEnergyLevels: ['Low', 'Medium', 'High'],
      maxDistance: 5,
      ageRange: [1, 10],
      preferredBreeds: []
    }
  })

  // EFFECT: Simulate loading time for better UX (shows loading screen initially)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500) // 1.5 second loading time

    return () => clearTimeout(timer)
  }, [])

  /**
   * FUNCTION: Save user preferences to localStorage
   * Called when user clicks "Save Preferences" in the preferences modal
   * Saves size, energy, distance, and age preferences for filtering dogs
   */
  const savePreferences = () => {
    localStorage.setItem('dogPreferences', JSON.stringify(preferences))
    console.log('Preferences saved to localStorage:', preferences)
  }

  /**
   * COMPUTED: Filter dogs based on user preferences and exclude already matched/skipped dogs
   * This is the core filtering logic that determines which dogs the user sees
   * Filters by: size, energy level, distance, age range, and excludes matched/skipped dogs
   * 
   * Default preferences show all dogs:
   * - Sizes: Small, Medium, Large (all sizes)
   * - Energy: Low, Medium, High (all levels)
   * - Distance: Up to 5 miles
   * - Age: 1-10 years
   * - Excludes: Already matched or skipped dogs
   */
  const filteredDogs = useMemo(() => {
    console.log('Total dogs available:', dogs.length)
    console.log('Current preferences:', preferences)
    console.log('Already matched dogs:', connections.map(c => c.name))
    console.log('Already skipped dogs:', skipped.map(s => s.name))
    
    // Create sets of matched and skipped dog IDs for efficient lookup
    const matchedDogIds = new Set(connections.map(dog => dog.id))
    const skippedDogIds = new Set(skipped.map(dog => dog.id))
    
    // Filter dogs based on user preferences AND exclude matched/skipped dogs
    const filtered = dogs.filter(dog => {
      // EXCLUDE: Dogs that have already been matched
      if (matchedDogIds.has(dog.id)) {
        console.log(`Dog ${dog.name} filtered out: already matched`)
        return false
      }
      
      // EXCLUDE: Dogs that have already been skipped
      if (skippedDogIds.has(dog.id)) {
        console.log(`Dog ${dog.name} filtered out: already skipped`)
        return false
      }
      
      // Check size preference
      if (!preferences.preferredSizes.includes(dog.size)) {
        console.log(`Dog ${dog.name} filtered out: size ${dog.size} not in ${preferences.preferredSizes}`)
        return false
      }
      
      // Check energy level preference
      if (!preferences.preferredEnergyLevels.includes(dog.energyLevel)) {
        console.log(`Dog ${dog.name} filtered out: energy ${dog.energyLevel} not in ${preferences.preferredEnergyLevels}`)
        return false
      }
      
      // Check distance preference
      if (dog.distance > preferences.maxDistance) {
        console.log(`Dog ${dog.name} filtered out: distance ${dog.distance} > ${preferences.maxDistance}`)
        return false
      }
      
      // Check age range preference
      if (dog.age < preferences.ageRange[0] || dog.age > preferences.ageRange[1]) {
        console.log(`Dog ${dog.name} filtered out: age ${dog.age} not in range ${preferences.ageRange}`)
        return false
      }
      
      return true
    })
    
    console.log('Filtered dogs count (excluding matched/skipped):', filtered.length)
    return filtered
  }, [dogs, preferences, connections, skipped])

  // EFFECT: Reset current index when filtered dogs change (to prevent index out of bounds)
  useEffect(() => {
    if (currentDogIndex >= filteredDogs.length && filteredDogs.length > 0) {
      setCurrentDogIndex(0)
    }
  }, [filteredDogs.length, currentDogIndex])

  /**
   * EVENT HANDLER: When user likes/matches a dog
   * Adds the dog to connections array and saves to localStorage
   * Prevents duplicate matches by checking if dog is already matched
   * @param dog - The dog profile that was liked
   */
  const handleMatch = (dog: DogProfile) => {
    // Check if dog is already matched to prevent duplicates
    const isAlreadyMatched = connections.some(connection => connection.id === dog.id)
    if (isAlreadyMatched) {
      console.warn(`⚠️ Attempted to match with ${dog.name} again - already matched!`)
      return
    }
    
    setConnections(prev => {
      const updated = [...prev, dog]
      // Save to localStorage for persistence across sessions
      localStorage.setItem('dogConnections', JSON.stringify(updated))
      return updated
    })
    console.log(`✅ Matched with ${dog.name}! (Total matches: ${connections.length + 1})`)
  }

  /**
   * EVENT HANDLER: When user dislikes/passes on a dog
   * Adds the dog to skipped array and saves to localStorage
   * Prevents duplicate skips by checking if dog is already skipped
   * @param dog - The dog profile that was passed on
   */
  const handleDislike = (dog: DogProfile) => {
    // Check if dog is already skipped to prevent duplicates
    const isAlreadySkipped = skipped.some(skippedDog => skippedDog.id === dog.id)
    if (isAlreadySkipped) {
      console.warn(`⚠️ Attempted to skip ${dog.name} again - already skipped!`)
      return
    }
    
    setSkipped(prev => {
      const updated = [...prev, dog]
      // Save to localStorage for persistence across sessions
      localStorage.setItem('dogSkipped', JSON.stringify(updated))
      return updated
    })
    console.log(`👎 Passed on ${dog.name} (Total skipped: ${skipped.length + 1})`)
  }

  // Handler for Start Over button - shows modal with options
  const handleStartOver = () => {
    setShowStartOverModal(true)
  }

  // Reset just the swipe position (keep matches)
  const resetSwipePosition = () => {
    setCurrentDogIndex(0)
    setShowStartOverModal(false)
    console.log('🔄 Reset swipe position - keeping all matches and skipped dogs')
  }

  // Reset everything (matches, skipped, position, and preferences)
  const resetAllData = () => {
    setConnections([])
    setSkipped([])
    setCurrentDogIndex(0)
    
    // Reset preferences to default (include all sizes, energy levels, etc.)
    const defaultPreferences = {
      preferredSizes: ['Small', 'Medium', 'Large'],
      preferredEnergyLevels: ['Low', 'Medium', 'High'],
      maxDistance: 5,
      ageRange: [1, 10],
      preferredBreeds: []
    }
    setPreferences(defaultPreferences)
    
    // Clear localStorage
    localStorage.removeItem('dogConnections')
    localStorage.removeItem('dogSkipped')
    localStorage.removeItem('dogPreferences')
    
    // Save default preferences to localStorage
    localStorage.setItem('dogPreferences', JSON.stringify(defaultPreferences))
    
    setShowStartOverModal(false)
    console.log('🗑️ Reset all data - cleared matches, skipped dogs, position, and preferences')
    console.log('🔄 Reset preferences to default:', defaultPreferences)
  }

  // Reset only skipped dogs (keep matches)
  const resetSkippedOnly = () => {
    setSkipped([])
    setCurrentDogIndex(0)
    localStorage.removeItem('dogSkipped')
    setShowStartOverModal(false)
    console.log('🔄 Reset skipped dogs only - keeping matches, allowing re-swipe on passed dogs')
  }

  if (isLoading) {
    return <LoadingScreen message="Finding your perfect matches..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50">
      {/* Notification Permission Banner */}
      <NotificationPermissionBanner />
      
      {/* Hero Section */}
      <HeroSection 
               title="Swipe. Walk. Connect."
               subtitle="Find the perfect playmate for your dog"
        backgroundImage="https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&h=600&fit=crop"
        showStats={false}
      />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" showText={false} />
            <h1 className="text-2xl font-display font-bold text-earth-900">Discover</h1>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowPreferencesModal(true)}
                className="p-2 hover:bg-teal-100 rounded-full transition-colors"
                title="Filter options"
                aria-label="Filter options"
              >
                <Filter className="w-5 h-5 text-teal-600" />
              </button>
              <button 
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        alert(`Location updated! Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`)
                      },
                      () => {
                        alert('Unable to get location. Please enable location services.')
                      }
                    )
                  } else {
                    alert('Location services not supported by this browser.')
                  }
                }}
                className="p-2 hover:bg-teal-100 rounded-full transition-colors"
                title="Location settings"
                aria-label="Location settings"
              >
                <MapPin className="w-5 h-5 text-teal-600" />
              </button>
              <button 
                onClick={() => {
                  if ('Notification' in window) {
                    if (Notification.permission === 'granted') {
                      new Notification('Pawmatch™', {
                        body: 'You have new matches! Check them out.',
                        icon: '/paw match logo.png'
                      })
                    } else if (Notification.permission !== 'denied') {
                      Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                          new Notification('Pawmatch™', {
                            body: 'Notifications enabled! You\'ll be notified of new matches.',
                            icon: '/paw match logo.png'
                          })
                        }
                      })
                    } else {
                      alert('Notifications are blocked. Please enable them in your browser settings.')
                    }
                  } else {
                    alert('Notifications not supported by this browser.')
                  }
                }}
                className="p-2 hover:bg-teal-100 rounded-full transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-teal-600" />
              </button>
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
        <SwipeInterface
          dogs={filteredDogs}
          onMatch={handleMatch}
          onDislike={handleDislike}
          onCurrentDogChange={setCurrentDogIndex}
          onStartOver={handleStartOver}
        />

        {/* Quick Preferences Button - Right under swipe interface for easy access */}
        <div className="px-4 max-w-md mx-auto">
          <button 
            onClick={() => setShowPreferencesModal(true)}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Update Preferences
          </button>
        </div>

        {/* Dog of the Day */}
        <div className="mt-8">
          <DogOfTheDay />
        </div>

        {/* Current Dog Event Suggestions */}
        <CurrentDogEvents
          currentDog={filteredDogs[currentDogIndex]}
          currentDogIndex={currentDogIndex}
          totalDogs={filteredDogs.length}
        />

        {/* Health Alert */}
        <HealthAlert onViewHealth={() => navigate('/health')} />

        {/* Trending Posts */}
        <TrendingPosts />

        {/* Events Suggestion */}
        {filteredDogs[currentDogIndex] && (
          <EventsSuggestion
            dog={filteredDogs[currentDogIndex]}
            events={events}
            onViewEvents={() => navigate('/events')}
          />
        )}

        {/* Community Suggestion */}
        {filteredDogs[currentDogIndex] && (
          <CommunitySuggestion
            dog={filteredDogs[currentDogIndex]}
            posts={posts}
            onViewCommunity={() => navigate('/community')}
          />
        )}

        {/* Health Suggestion */}
        {filteredDogs[currentDogIndex] && (
          <HealthSuggestion
            dog={filteredDogs[currentDogIndex]}
            onViewHealth={() => navigate('/health')}
          />
        )}


        {/* Quick Actions */}
        <div className="mt-8 space-y-3">
          <button 
            onClick={() => navigate('/matches')}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            View Matches
          </button>
        </div>

        {/* Start Discovering Button */}
        <div className="mt-8">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
                 Start Matching
          </button>
        </div>
      </div>

      {/* Connections Modal */}
      {showConnectionsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Your Connections</h2>
                <button 
                  onClick={() => setShowConnectionsModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-orange-100 mt-2">You have {connections.length} connection{connections.length !== 1 ? 's' : ''}!</p>
            </div>

            {/* Connections List */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {connections.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🐕</div>
                  <h3 className="text-xl font-display font-semibold text-earth-900 mb-2">No Connections Yet</h3>
                  <p className="text-earth-600">Start discovering to find your perfect dog playmates!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {connections.map((dog) => (
                    <div key={dog.id} className="flex items-center gap-4 p-4 bg-earth-50 rounded-xl border border-earth-200">
                      <img 
                        src={dog.photos[0]} 
                        alt={dog.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-display font-semibold text-earth-900 text-lg">{dog.name}</h4>
                        <p className="text-earth-600 text-sm">{dog.breed} • {dog.age} years old</p>
                        <p className="text-earth-500 text-xs">{dog.size} • {dog.energyLevel} energy</p>
                      </div>
                      <div className="text-orange-500">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-earth-200">
              <button 
                onClick={() => setShowConnectionsModal(false)}
                className="w-full bg-gradient-to-r from-earth-500 to-earth-600 hover:from-earth-600 hover:to-earth-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowConnectionsModal(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="w-full mt-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                 Start Matching
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Update Preferences</h2>
                <button 
                  onClick={() => setShowPreferencesModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-teal-100 mt-2">Customize your discovery preferences</p>
            </div>

            {/* Preferences Form */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Dog Sizes */}
              <div className="mb-6">
                <h3 className="text-lg font-display font-semibold text-earth-900 mb-3">Preferred Dog Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        const newSizes = preferences.preferredSizes.includes(size)
                          ? preferences.preferredSizes.filter((s: string) => s !== size)
                          : [...preferences.preferredSizes, size]
                        setPreferences((prev: any) => ({ ...prev, preferredSizes: newSizes }))
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-body transition-all ${
                        preferences.preferredSizes.includes(size)
                          ? 'bg-teal-500 text-white'
                          : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Levels */}
              <div className="mb-6">
                <h3 className="text-lg font-display font-semibold text-earth-900 mb-3">Energy Levels</h3>
                <div className="flex flex-wrap gap-2">
                  {['Low', 'Medium', 'High'].map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        const newLevels = preferences.preferredEnergyLevels.includes(level)
                          ? preferences.preferredEnergyLevels.filter((l: string) => l !== level)
                          : [...preferences.preferredEnergyLevels, level]
                        setPreferences((prev: any) => ({ ...prev, preferredEnergyLevels: newLevels }))
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-body transition-all ${
                        preferences.preferredEnergyLevels.includes(level)
                          ? 'bg-orange-500 text-white'
                          : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Distance */}
              <div className="mb-6">
                <h3 className="text-lg font-display font-semibold text-earth-900 mb-3">
                  Maximum Distance: {preferences.maxDistance} miles
                </h3>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={preferences.maxDistance}
                  onChange={(e) => setPreferences((prev: any) => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-earth-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-earth-500 mt-1">
                  <span>1 mile</span>
                  <span>20 miles</span>
                </div>
              </div>

              {/* Age Range */}
              <div className="mb-6">
                <h3 className="text-lg font-display font-semibold text-earth-900 mb-3">
                  Age Range: {preferences.ageRange[0]} - {preferences.ageRange[1]} years
                </h3>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm text-earth-600 mb-1">Min Age</label>
                    <input
                      type="number"
                      min="1"
                      max={preferences.ageRange[1]}
                      value={preferences.ageRange[0]}
                      onChange={(e) => setPreferences((prev: any) => ({ 
                        ...prev, 
                        ageRange: [parseInt(e.target.value), prev.ageRange[1]] 
                      }))}
                      className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-earth-600 mb-1">Max Age</label>
                    <input
                      type="number"
                      min={preferences.ageRange[0]}
                      max="20"
                      value={preferences.ageRange[1]}
                      onChange={(e) => setPreferences((prev: any) => ({ 
                        ...prev, 
                        ageRange: [prev.ageRange[0], parseInt(e.target.value)] 
                      }))}
                      className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-earth-200">
              <button 
                onClick={() => {
                  savePreferences()
                  setCurrentDogIndex(0) // Reset to first dog in filtered list
                  setShowPreferencesModal(false)
                  setShowSaveNotification(true)
                  setTimeout(() => setShowSaveNotification(false), 3000)
                }}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Save Preferences
              </button>
              <button 
                onClick={() => {
                  setPreferences({
                    preferredSizes: ['Small', 'Medium', 'Large'],
                    preferredEnergyLevels: ['Low', 'Medium', 'High'],
                    maxDistance: 5,
                    ageRange: [1, 10],
                    preferredBreeds: []
                  })
                }}
                className="w-full mt-3 bg-gradient-to-r from-earth-500 to-earth-600 hover:from-earth-600 hover:to-earth-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Success Notification */}
      {showSaveNotification && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">Preferences saved successfully!</span>
          </div>
        </div>
      )}

      {/* Start Over Modal */}
      {showStartOverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-display font-bold text-earth-900 mb-2">Start Over</h3>
              <p className="text-earth-600 font-body">Choose what you'd like to reset:</p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={resetSwipePosition}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-left"
              >
                <div className="font-semibold">Just Reset Position</div>
                <div className="text-sm opacity-90">Keep all matches and skipped dogs, just go back to the first dog</div>
              </button>

              <button
                onClick={resetSkippedOnly}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-left"
              >
                <div className="font-semibold">Reset Skipped Dogs</div>
                <div className="text-sm opacity-90">Keep matches, but allow re-swiping on dogs you passed</div>
              </button>

              <button
                onClick={resetAllData}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-left"
              >
                <div className="font-semibold">Reset Everything</div>
                <div className="text-sm opacity-90">Clear all matches, skipped dogs, and reset preferences to default</div>
              </button>
            </div>

            <button
              onClick={() => setShowStartOverModal(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscoverPage

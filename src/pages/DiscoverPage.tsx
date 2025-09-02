import React, { useState } from 'react'
import { Filter, MapPin, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SwipeInterface from '../components/SwipeInterface'
import EventsSuggestion from '../components/EventsSuggestion'
import CommunitySuggestion from '../components/CommunitySuggestion'
import HealthSuggestion from '../components/HealthSuggestion'
import HealthAlert from '../components/HealthAlert'
import TrendingPosts from '../components/TrendingPosts'
import GpsTrackingSuggestion from '../components/GpsTrackingSuggestion'
import HeroSection from '../components/HeroSection'
import FeatureShowcase from '../components/FeatureShowcase'
import { DogProfile } from '../components/DogProfileCard'
import { useEvents } from '../contexts/EventsContext'
import { useCommunity } from '../contexts/CommunityContext'

// Mock data for demonstration
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
    photos: ['https://images.unsplash.com/photo-1507146426996-ef05306b0a70?w=400&h=400&fit=crop'],
    bio: 'Luna is a smart and active Border Collie who excels at agility training. She loves herding and playing with other energetic dogs.',
    ownerNotes: 'Very intelligent, needs mental stimulation!'
  },
  {
    id: '3',
    name: 'Max',
    breed: 'Labrador',
    age: 1,
    size: 'Large',
    energyLevel: 'High',
    friendliness: 'Very Friendly',
    distance: 0.8,
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
    photos: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop'],
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
    photos: ['https://images.unsplash.com/photo-1518791841217-8f162f1e1130?w=400&h=400&fit=crop'],
    bio: 'Daisy is an intelligent and elegant Poodle who enjoys training and mental challenges. She\'s very well-behaved and loves attention.',
    ownerNotes: 'Excellent with children and other pets!'
  }
]

const DiscoverPage: React.FC = () => {
  const navigate = useNavigate()
  const { events } = useEvents()
  const { posts } = useCommunity()
  const [dogs] = useState<DogProfile[]>(mockDogs)
  const [matches, setMatches] = useState<DogProfile[]>([])
  const [dislikes, setDislikes] = useState<DogProfile[]>([])
  const [currentDogIndex, setCurrentDogIndex] = useState(0)

  const handleMatch = (dog: DogProfile) => {
    setMatches(prev => [...prev, dog])
    // In a real app, you'd send this to your backend
    console.log(`Matched with ${dog.name}!`)
  }

  const handleDislike = (dog: DogProfile) => {
    setDislikes(prev => [...prev, dog])
    // In a real app, you'd send this to your backend
    console.log(`Disliked ${dog.name}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50">
      {/* Hero Section */}
      <HeroSection 
        title="Swipe. Walk. Connect."
        subtitle="Find your perfect dog companion and build lasting friendships in your community"
        backgroundImage="https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&h=600&fit=crop"
        showStats={false}
      />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold text-earth-900">Discover</h1>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-teal-100 rounded-full transition-colors">
                <Filter className="w-5 h-5 text-teal-600" />
              </button>
              <button className="p-2 hover:bg-teal-100 rounded-full transition-colors">
                <MapPin className="w-5 h-5 text-teal-600" />
              </button>
              <button className="p-2 hover:bg-teal-100 rounded-full transition-colors">
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
            <div className="text-2xl font-display font-bold text-orange-500">{matches.length}</div>
            <div className="text-sm text-earth-600 font-body">Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-teal-600">{dogs.length}</div>
            <div className="text-sm text-earth-600 font-body">Profiles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-red-500">{dislikes.length}</div>
            <div className="text-sm text-earth-600 font-body">Passed</div>
          </div>
        </div>

        {/* Swipe Interface */}
        <SwipeInterface
          dogs={dogs}
          onMatch={handleMatch}
          onDislike={handleDislike}
          onCurrentDogChange={setCurrentDogIndex}
        />

        {/* Health Alert */}
        <HealthAlert onViewHealth={() => navigate('/health')} />

        {/* Trending Posts */}
        <TrendingPosts
          posts={posts}
          onViewCommunity={() => navigate('/community')}
        />

        {/* Events Suggestion */}
        {dogs[currentDogIndex] && (
          <EventsSuggestion
            dog={dogs[currentDogIndex]}
            events={events}
            onViewEvents={() => navigate('/events')}
          />
        )}

        {/* Community Suggestion */}
        {dogs[currentDogIndex] && (
          <CommunitySuggestion
            dog={dogs[currentDogIndex]}
            posts={posts}
            onViewCommunity={() => navigate('/community')}
          />
        )}

        {/* Health Suggestion */}
        {dogs[currentDogIndex] && (
          <HealthSuggestion
            dog={dogs[currentDogIndex]}
            onViewHealth={() => navigate('/health')}
          />
        )}

        {/* GPS Tracking Suggestion */}
        {dogs[currentDogIndex] && (
          <GpsTrackingSuggestion
            dog={dogs[currentDogIndex]}
            onViewTracking={() => navigate('/gps-tracking')}
          />
        )}

        {/* Quick Actions */}
        <div className="mt-8 space-y-3">
          <button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            Update Preferences
          </button>
          <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            View Matches
          </button>
        </div>
      </div>

      {/* Feature Showcase */}
      <FeatureShowcase />
    </div>
  )
}

export default DiscoverPage

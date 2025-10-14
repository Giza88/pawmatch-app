import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, MapPin, Calendar, Phone, Mail, Star, Filter, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { DogProfile } from '../components/DogProfileCard'

// Mock matches data - in a real app, this would come from your backend
const mockMatches: (DogProfile & {
  matchDate: string
  lastMessage?: string
  unreadMessages: number
  isOnline: boolean
  owner: {
    name: string
    phone: string
    email: string
    location: string
  }
})[] = [
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
    ownerNotes: 'Loves tennis balls and swimming!',
    matchDate: '2024-01-15',
    lastMessage: 'Hey! Would love to set up a playdate soon!',
    unreadMessages: 2,
    isOnline: true,
    owner: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@email.com',
      location: 'Central Park, NYC',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    }
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
    photos: ['https://www.bellaandduke.com/wp-content/uploads/2025/07/A-guide-to-Border-Collies-Lifespan-temperament-health-and-the-best-food-for-them-featured-image.webp'],
    bio: 'Luna is a smart and active Border Collie who excels at agility training. She loves herding and playing with other energetic dogs.',
    ownerNotes: 'Very intelligent, needs mental stimulation!',
    matchDate: '2024-01-12',
    lastMessage: 'Luna had so much fun at the park yesterday!',
    unreadMessages: 0,
    isOnline: false,
    owner: {
      name: 'Mike Chen',
      phone: '+1 (555) 987-6543',
      email: 'mike.chen@email.com',
      location: 'Brooklyn, NYC',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '3',
    name: 'Bella',
    breed: 'Cavalier King Charles Spaniel',
    age: 4,
    size: 'Small',
    energyLevel: 'Medium',
    friendliness: 'Very Friendly',
    distance: 1.5,
    photos: ['https://www.akc.org/wp-content/uploads/2017/11/Cavalier-King-Charles-Spaniel-standing-in-the-grass.jpg'],
    bio: 'Bella is a gentle and affectionate Cavalier who loves cuddles and gentle play. She gets along well with all dogs and people.',
    ownerNotes: 'Perfect for calm playdates!',
    matchDate: '2024-01-10',
    lastMessage: 'Thanks for the great walk today!',
    unreadMessages: 1,
    isOnline: true,
    owner: {
      name: 'Emma Davis',
      phone: '+1 (555) 456-7890',
      email: 'emma.davis@email.com',
      location: 'Manhattan, NYC',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
    }
  }
]

const MatchesPage: React.FC = () => {
  const navigate = useNavigate()
  const [matches, setMatches] = useState(() => {
    // Load real matches from localStorage
    const saved = localStorage.getItem('dogConnections')
    if (saved) {
      try {
        const connections = JSON.parse(saved)
        // Transform connections into match format with additional data
        return connections.map((dog: DogProfile, index: number) => ({
          ...dog,
          matchDate: new Date(Date.now() - index * 86400000).toISOString().split('T')[0], // Stagger dates
          lastMessage: undefined,
          unreadMessages: 0,
          isOnline: Math.random() > 0.5,
          owner: {
            name: `${dog.name}'s Owner`,
            phone: '+1 (555) 000-0000',
            email: `${dog.name.toLowerCase()}@email.com`,
            location: dog.location || 'Local Park'
          }
        }))
      } catch (e) {
        console.error('Failed to parse matches:', e)
      }
    }
    // Return empty array for new profiles (no fallback to mock data)
    return []
  })
  const [selectedMatch, setSelectedMatch] = useState<typeof mockMatches[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOnline, setFilterOnline] = useState(false)

  // Sync matches when localStorage changes (e.g., new match from Discover page)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('dogConnections')
      if (saved) {
        try {
          const connections = JSON.parse(saved)
          const updatedMatches = connections.map((dog: DogProfile, index: number) => ({
            ...dog,
            matchDate: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
            lastMessage: undefined,
            unreadMessages: 0,
            isOnline: Math.random() > 0.5,
            owner: {
              name: `${dog.name}'s Owner`,
              phone: '+1 (555) 000-0000',
              email: `${dog.name.toLowerCase()}@email.com`,
              location: dog.location || 'Local Park'
            }
          }))
          setMatches(updatedMatches)
        } catch (e) {
          console.error('Failed to sync matches:', e)
        }
      }
    }

    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for same-tab updates
    const interval = setInterval(handleStorageChange, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOnline = !filterOnline || match.isOnline
    return matchesSearch && matchesOnline
  })

  const handleStartChat = (match: typeof mockMatches[0]) => {
    // Map match IDs to conversation IDs
    const conversationMap: { [key: string]: string } = {
      '1': 'conv-1', // Buddy
      '2': 'conv-2', // Luna  
      '3': 'conv-3'  // Bella
    }
    
    const conversationId = conversationMap[match.id]
    if (conversationId) {
      navigate(`/chat/${conversationId}`)
    } else {
      // Create new conversation if it doesn't exist
      console.log(`Creating new conversation for ${match.name}`)
      alert(`Chat feature coming soon! You'll be able to message ${match.owner.name} about ${match.name}.`)
    }
  }

  const handleCallOwner = (match: typeof mockMatches[0]) => {
    // In a real app, this would initiate a call
    console.log(`Calling ${match.owner.name}`)
    alert(`Calling ${match.owner.name} at ${match.owner.phone}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-teal-500 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 via-orange-800/70 to-teal-600/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-script font-bold text-white mb-4">
                 Your Matches
          </h1>
          <p className="text-xl text-white/90 font-body max-w-2xl mx-auto">
            Connect with local dog owners and their amazing furry friends
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" showText={false} />
                   <h2 className="text-2xl font-display font-bold text-earth-900">Matches</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOnline(!filterOnline)}
                className={`p-2 rounded-full transition-all ${
                  filterOnline ? 'bg-teal-100 text-teal-600' : 'text-earth-500 hover:text-earth-700'
                }`}
                title="Filter online matches"
                aria-label="Filter online matches"
              >
                <div className={`w-3 h-3 rounded-full ${filterOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-earth-400" />
          <input
            type="text"
                   placeholder="Search matches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent font-body"
          />
        </div>
      </div>

      {/* Matches List */}
      <div className="max-w-md mx-auto px-4 pb-6">
        <AnimatePresence>
          {filteredMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-earth-200 p-6 mb-4 cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedMatch(match)}
            >
              <div className="flex items-start gap-4">
                {/* Dog Photo */}
                <div className="relative">
                  <img
                    src={match.photos[0]}
                    alt={match.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                  />
                  {match.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Match Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-display font-bold text-earth-900 truncate">
                      {match.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-orange-500 fill-current" />
                      <span className="text-xs text-earth-500 font-body">
                        {new Date(match.matchDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-earth-600 font-body mb-2">
                    {match.breed} • {match.age} years old • {match.size}
                  </p>
                  
                  <p className="text-sm text-earth-500 font-body mb-3 line-clamp-2">
                    {match.lastMessage}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartChat(match)
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-body font-semibold rounded-lg transition-all duration-300"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Chat
                      {match.unreadMessages > 0 && (
                        <span className="bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {match.unreadMessages}
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCallOwner(match)
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-body font-semibold rounded-lg transition-all duration-300"
                    >
                      <Phone className="w-3 h-3" />
                      Call
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMatches.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-earth-700 mb-2">
                   {searchTerm || filterOnline ? 'No matches found' : 'No matches yet'}
            </h3>
            <p className="text-earth-500 font-body mb-6">
              {searchTerm || filterOnline 
                ? 'Try adjusting your search or filters' 
                : 'Start discovering to find your perfect dog playmates!'
              }
            </p>
            {!searchTerm && !filterOnline && (
              <button
                onClick={() => navigate('/discover')}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                     Start Matching
              </button>
            )}
          </div>
        )}
      </div>

      {/* Match Detail Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-earth-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-earth-900">
                  {selectedMatch.name}
                </h2>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="p-2 hover:bg-earth-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-earth-600" />
                </button>
              </div>

              {/* Dog Photo */}
              <div className="text-center mb-6">
                <img
                  src={selectedMatch.photos[0]}
                  alt={selectedMatch.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-orange-200 mx-auto mb-4"
                />
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="text-xl font-display font-bold text-earth-900">
                    {selectedMatch.name}
                  </h3>
                  {selectedMatch.isOnline && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-body">Online</span>
                    </div>
                  )}
                </div>
                <p className="text-earth-600 font-body">
                  {selectedMatch.breed} • {selectedMatch.age} years old • {selectedMatch.size}
                </p>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h4 className="text-lg font-display font-semibold text-earth-900 mb-2">About {selectedMatch.name}</h4>
                <p className="text-earth-600 font-body">{selectedMatch.bio}</p>
              </div>

              {/* Owner Info */}
              <div className="mb-6">
                <h4 className="text-lg font-display font-semibold text-earth-900 mb-3">Owner Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedMatch.owner.avatar}
                      alt={selectedMatch.owner.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-teal-200"
                    />
                    <span className="text-earth-700 font-body">{selectedMatch.owner.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-earth-600">
                    <MapPin className="w-4 h-4" />
                    <span className="font-body text-sm">{selectedMatch.owner.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-earth-600">
                    <Phone className="w-4 h-4" />
                    <span className="font-body text-sm">{selectedMatch.owner.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-earth-600">
                    <Mail className="w-4 h-4" />
                    <span className="font-body text-sm">{selectedMatch.owner.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedMatch(null)
                    handleStartChat(selectedMatch)
                  }}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chat
                </button>
                
                <button
                  onClick={() => {
                    setSelectedMatch(null)
                    handleCallOwner(selectedMatch)
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Owner
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MatchesPage

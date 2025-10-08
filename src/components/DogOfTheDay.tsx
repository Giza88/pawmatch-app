import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Heart, MapPin, Calendar, Share2, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface DogOfTheDay {
  id: string
  name: string
  breed: string
  age: number
  size: string
  energyLevel: string
  friendliness: string
  distance: number
  photos: string[]
  bio: string
  ownerNotes: string
  owner: {
    name: string
    location: string
    avatar: string
  }
  achievements: string[]
  funFact: string
  specialTrait: string
}

// Mock data for Dog of the Day
const dogsOfTheDay: DogOfTheDay[] = [
  {
    id: 'dotd-1',
    name: 'Max',
    breed: 'Golden Retriever',
    age: 2,
    size: 'Large',
    energyLevel: 'High',
    friendliness: 'Very Friendly',
    distance: 0.8,
    photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'],
    bio: 'Max is an incredibly intelligent and loving Golden Retriever who has won multiple agility competitions! He loves water, fetch, and making new friends.',
    ownerNotes: 'Max is a therapy dog who visits local hospitals and brings joy to patients!',
    owner: {
      name: 'Sarah Johnson',
      location: 'Central Park, NYC',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    achievements: ['Therapy Dog Certified', 'Agility Champion 2023', 'Community Hero Award'],
    funFact: 'Max can balance treats on his nose for over 30 seconds!',
    specialTrait: 'Therapy Dog'
  },
  {
    id: 'dotd-2',
    name: 'Luna',
    breed: 'Border Collie',
    age: 3,
    size: 'Medium',
    energyLevel: 'High',
    friendliness: 'Friendly',
    distance: 1.2,
    photos: ['https://www.bellaandduke.com/wp-content/uploads/2025/07/A-guide-to-Border-Collies-Lifespan-temperament-health-and-the-best-food-for-them-featured-image.webp'],
    bio: 'Luna is a brilliant Border Collie who excels at herding and agility. She\'s incredibly smart and loves learning new tricks and commands.',
    ownerNotes: 'Luna has learned over 50 different commands and can solve puzzle toys in seconds!',
    owner: {
      name: 'Mike Chen',
      location: 'Brooklyn, NYC',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    achievements: ['Agility Master', 'Trick Champion', 'Smartest Pup Award'],
    funFact: 'Luna can count to 10 and knows all her colors!',
    specialTrait: 'Genius Pup'
  },
  {
    id: 'dotd-3',
    name: 'Bella',
    breed: 'Cavalier King Charles Spaniel',
    age: 4,
    size: 'Small',
    energyLevel: 'Medium',
    friendliness: 'Very Friendly',
    distance: 1.5,
    photos: ['https://www.akc.org/wp-content/uploads/2017/11/Cavalier-King-Charles-Spaniel-standing-in-the-grass.jpg'],
    bio: 'Bella is the sweetest and most gentle dog you\'ll ever meet. She loves cuddles, gentle play, and being around people of all ages.',
    ownerNotes: 'Bella is perfect for families with children and other pets. She\'s incredibly patient and loving.',
    owner: {
      name: 'Emma Davis',
      location: 'Manhattan, NYC',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
    },
    achievements: ['Best Family Dog', 'Gentle Soul Award', 'Cuddle Champion'],
    funFact: 'Bella has never met a person she didn\'t immediately love!',
    specialTrait: 'Gentle Soul'
  }
]

const DogOfTheDay: React.FC = () => {
  const navigate = useNavigate()
  const [currentDog, setCurrentDog] = useState<DogOfTheDay>(dogsOfTheDay[0])
  const [isLiked, setIsLiked] = useState(false)

  // Rotate Dog of the Day daily
  useEffect(() => {
    const today = new Date().getDate()
    const dogIndex = today % dogsOfTheDay.length
    setCurrentDog(dogsOfTheDay[dogIndex])
  }, [])

  const handleLike = () => {
    setIsLiked(!isLiked)
    // In a real app, this would save the like to the backend
  }

  const handleShare = () => {
    // In a real app, this would open share options
    if (navigator.share) {
      navigator.share({
        title: `Meet ${currentDog.name} - Dog of the Day!`,
        text: `Check out ${currentDog.name}, today's featured dog on Pawmatch™!`,
        url: window.location.href
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${currentDog.name} is today's Dog of the Day on Pawmatch™!`)
      alert('Link copied to clipboard!')
    }
  }

  const handleViewProfile = () => {
    // In a real app, this would navigate to the dog's profile
    navigate('/discover')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl mb-6 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 border-2 border-white rounded-full"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-300" />
          <h2 className="text-xl font-display font-bold">Dog of the Day</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-all duration-300 ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dog Info */}
      <div className="relative z-10 flex items-start gap-4 mb-4">
        <div className="relative">
          <img
            src={currentDog.photos[0]}
            alt={currentDog.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
          />
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            ⭐
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-display font-bold mb-1">{currentDog.name}</h3>
          <p className="text-white/90 font-body mb-2">
            {currentDog.breed} • {currentDog.age} years old • {currentDog.size}
          </p>
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 text-yellow-300 fill-current" />
            <span className="text-sm font-body text-white/90">{currentDog.specialTrait}</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="relative z-10 mb-4">
        <p className="text-white/90 font-body leading-relaxed mb-3">
          {currentDog.bio}
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-3">
          <p className="text-sm font-body text-white/90">
            <span className="font-semibold">Fun Fact:</span> {currentDog.funFact}
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="relative z-10 mb-4">
        <h4 className="text-sm font-display font-semibold mb-2 text-white/90">Achievements</h4>
        <div className="flex flex-wrap gap-2">
          {currentDog.achievements.map((achievement, index) => (
            <span
              key={index}
              className="bg-white/20 backdrop-blur-sm text-white text-xs font-body px-3 py-1 rounded-full"
            >
              {achievement}
            </span>
          ))}
        </div>
      </div>

      {/* Owner Info */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={currentDog.owner.avatar}
            alt={currentDog.owner.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
          />
          <div>
            <p className="text-sm font-body text-white/90">Owned by</p>
            <p className="text-sm font-display font-semibold">{currentDog.owner.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-white/70" />
          <span className="text-sm font-body text-white/70">{currentDog.distance} miles away</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative z-10 mt-4">
        <button
          onClick={handleViewProfile}
          className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          View Profile & Match
        </button>
      </div>
    </motion.div>
  )
}

export default DogOfTheDay

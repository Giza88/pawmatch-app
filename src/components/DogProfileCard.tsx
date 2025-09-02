import React from 'react'
import { motion, PanInfo } from 'framer-motion'
import { MapPin, Dog, Calendar, Ruler } from 'lucide-react'

export interface DogProfile {
  id: string
  name: string
  breed: string
  age: number
  size: 'Small' | 'Medium' | 'Large' | 'Extra Large'
  energyLevel: 'Low' | 'Medium' | 'High'
  friendliness: 'Shy' | 'Friendly' | 'Very Friendly'
  distance: number
  photos: string[]
  bio: string
  ownerNotes: string
}

interface DogProfileCardProps {
  dog: DogProfile
  onSwipe: (direction: 'left' | 'right') => void
  isActive: boolean
}

const DogProfileCard: React.FC<DogProfileCardProps> = ({ dog, onSwipe, isActive }) => {
  const handleDragEnd = (_event: any, info: PanInfo) => {
    if (!isActive) return
    const swipeThreshold = 100
    if (info.offset.x > swipeThreshold) {
      onSwipe('right') // Like
    } else if (info.offset.x < -swipeThreshold) {
      onSwipe('left') // Dislike
    }
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      drag={isActive ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative w-full h-full">
        {/* Main Image */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <img
            src={dog.photos[0] || '/placeholder-dog.jpg'}
            alt={`${dog.name} the ${dog.breed}`}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-earth-900/70 via-transparent to-transparent" />
          
          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-3xl font-bold mb-1">{dog.name}</h2>
                <p className="text-lg opacity-90">{dog.age} years old</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{dog.distance} miles</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dog className="w-4 h-4" />
                  <span className="text-sm">{dog.breed}</span>
                </div>
              </div>
            </div>
            
            {/* Dog Stats */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                <span className="text-sm">{dog.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{dog.energyLevel} Energy</span>
              </div>
            </div>
            
            {/* Bio */}
            <p className="text-sm opacity-90 mb-3 line-clamp-2">{dog.bio}</p>
            
            {/* Owner Notes */}
            {dog.ownerNotes && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-2">
                <p className="text-xs opacity-90 line-clamp-2">
                  <strong>Owner Note:</strong> {dog.ownerNotes}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Swipe Indicators */}
        {isActive && (
          <>
            {/* Like Indicator (Right) */}
            <motion.div
              className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl transform rotate-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              LIKE
            </motion.div>
            
            {/* Dislike Indicator (Left) */}
            <motion.div
              className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl transform -rotate-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              NOPE
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default DogProfileCard

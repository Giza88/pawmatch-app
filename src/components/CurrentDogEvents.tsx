import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowRight, Star } from 'lucide-react'
import { DogProfile } from './DogProfileCard'
import { DogEvent } from '../pages/EventsPage'
import { useEvents } from '../contexts/EventsContext'

interface CurrentDogEventsProps {
  currentDog: DogProfile | null
  currentDogIndex: number
  totalDogs: number
}

const CurrentDogEvents: React.FC<CurrentDogEventsProps> = ({ 
  currentDog, 
  currentDogIndex, 
  totalDogs 
}) => {
  const { events, joinEvent } = useEvents()

  if (!currentDog) return null

  // Get events that match this dog's characteristics
  const compatibleEvents = events.filter(event => {
    const sizeMatch = event.dogSize === 'All Sizes' || event.dogSize === currentDog.size
    const energyMatch = event.energyLevel === 'All Levels' || event.energyLevel === currentDog.energyLevel
    return sizeMatch && energyMatch
  }).slice(0, 1) // Show only top 1 match to be less intrusive

  // Only show if there are good matches and user has been browsing for a bit
  if (compatibleEvents.length === 0 || currentDogIndex < 2) return null

  const getCompatibilityScore = (event: DogEvent) => {
    let score = 0
    if (event.dogSize === 'All Sizes' || event.dogSize === currentDog.size) score += 2
    if (event.energyLevel === 'All Levels' || event.energyLevel === currentDog.energyLevel) score += 2
    if (event.eventType === 'Playdate') score += 1
    return score
  }

  const getCompatibilityColor = (event: DogEvent) => {
    const score = getCompatibilityScore(event)
    if (score >= 4) return "from-green-500 to-green-600"
    if (score >= 3) return "from-blue-500 to-blue-600"
    return "from-orange-500 to-orange-600"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-earth-200 p-3 mb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-earth-900">
            Perfect Events for {currentDog.name}
          </h3>
          <p className="text-sm text-earth-600 font-body">
            Based on {currentDog.name}'s {currentDog.size} size and {currentDog.energyLevel} energy
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-earth-500 font-body">
            {currentDogIndex + 1} of {totalDogs}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {compatibleEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={`p-3 rounded-lg border-2 bg-gradient-to-r ${getCompatibilityColor(event)}/5 border-gradient-to-r ${getCompatibilityColor(event)}/20`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-display font-bold text-earth-900 text-sm mb-1">
                  {event.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCompatibilityColor(event)} text-white`}>
                    <Star className="w-3 h-3 inline mr-1" />
                    Perfect Match
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.eventType === 'Playdate' ? 'bg-blue-100 text-blue-800' :
                    event.eventType === 'Walk' ? 'bg-green-100 text-green-800' :
                    event.eventType === 'Training' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.eventType}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1 text-xs text-earth-600 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                <span>{event.currentDogs}/{event.maxDogs} dogs • Organized by {event.organizer}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => joinEvent(event.id)}
                disabled={event.currentDogs >= event.maxDogs}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 ${
                  event.currentDogs >= event.maxDogs
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : `bg-gradient-to-r ${getCompatibilityColor(event)} hover:shadow-md text-white`
                }`}
              >
                {event.currentDogs >= event.maxDogs ? 'Event Full' : 'Join Event'}
              </motion.button>
              <button
                onClick={() => window.location.href = '/events'}
                className="px-3 py-2 rounded-lg text-xs font-medium text-earth-700 bg-white border border-earth-300 hover:bg-earth-50 transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-earth-200">
        <button
          onClick={() => window.location.href = '/events'}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium text-earth-700 bg-earth-100 hover:bg-earth-200 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Browse All Events
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default CurrentDogEvents

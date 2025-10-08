import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, ArrowRight, X } from 'lucide-react'
import { DogEvent } from '../pages/EventsPage'
import { DogProfile } from './DogProfileCard'
import { useEvents } from '../contexts/EventsContext'

interface EventSuggestionsProps {
  dog: DogProfile
  onClose: () => void
  onJoinEvent: (eventId: string) => void
}

const EventSuggestions: React.FC<EventSuggestionsProps> = ({ 
  dog, 
  onClose, 
  onJoinEvent 
}) => {
  const { getEventsForDog, getEventsNearby } = useEvents()
  const [suggestedEvents, setSuggestedEvents] = useState<DogEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      // Get events that match the dog's characteristics
      const compatibleEvents = getEventsForDog(dog.size, dog.energyLevel)
      
      // Get nearby events (within 2 miles)
      const nearbyEvents = getEventsNearby(dog.location || 'Central Park', 2)
      
      // Combine and filter unique events, prioritizing compatible ones
      const allEvents = [...compatibleEvents, ...nearbyEvents]
      const uniqueEvents = allEvents.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
      )
      
      // Sort by compatibility (size and energy match first)
      const sortedEvents = uniqueEvents.sort((a, b) => {
        const aCompatible = (a.dogSize === 'All Sizes' || a.dogSize === dog.size) && 
                           (a.energyLevel === 'All Levels' || a.energyLevel === dog.energyLevel)
        const bCompatible = (b.dogSize === 'All Sizes' || b.dogSize === dog.size) && 
                           (b.energyLevel === 'All Levels' || b.energyLevel === dog.energyLevel)
        
        if (aCompatible && !bCompatible) return -1
        if (!aCompatible && bCompatible) return 1
        return 0
      })
      
      setSuggestedEvents(sortedEvents.slice(0, 3)) // Show top 3 suggestions
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [dog, getEventsForDog, getEventsNearby])

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

  const getCompatibilityScore = (event: DogEvent) => {
    let score = 0
    if (event.dogSize === 'All Sizes' || event.dogSize === dog.size) score += 2
    if (event.energyLevel === 'All Levels' || event.energyLevel === dog.energyLevel) score += 2
    if (event.eventType === 'Playdate') score += 1 // Prefer playdates for connections
    return score
  }

  const getCompatibilityText = (event: DogEvent) => {
    const score = getCompatibilityScore(event)
    if (score >= 4) return "Perfect Match!"
    if (score >= 3) return "Great Match"
    if (score >= 2) return "Good Match"
    return "Nearby Event"
  }

  const getCompatibilityColor = (event: DogEvent) => {
    const score = getCompatibilityScore(event)
    if (score >= 4) return "from-green-500 to-green-600"
    if (score >= 3) return "from-blue-500 to-blue-600"
    if (score >= 2) return "from-orange-500 to-orange-600"
    return "from-gray-500 to-gray-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-orange-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-display font-bold">Perfect Events for {dog.name}!</h2>
          <p className="text-white/90 mt-2">
            Based on {dog.name}'s size ({dog.size}) and energy level ({dog.energyLevel})
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-100 rounded-xl p-4 animate-pulse"
                >
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </motion.div>
              ))}
            </div>
          ) : suggestedEvents.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {suggestedEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-earth-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                  >
                    {/* Compatibility Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCompatibilityColor(event)}`}>
                        {getCompatibilityText(event)}
                      </span>
                      <span className="text-sm text-earth-600 font-body">
                        {event.currentDogs}/{event.maxDogs} dogs
                      </span>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-lg font-display font-bold text-earth-900 mb-2">
                      {event.title}
                    </h3>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-earth-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-body">
                          {formatDate(event.date)} at {formatTime(event.time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-earth-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-body">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-earth-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-body">
                          Organized by {event.organizer}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-earth-700 text-sm font-body mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Join Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onJoinEvent(event.id)}
                      disabled={event.currentDogs >= event.maxDogs}
                      className={`w-full py-3 px-4 rounded-xl font-body font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                        event.currentDogs >= event.maxDogs
                          ? 'bg-gray-400 cursor-not-allowed'
                          : `bg-gradient-to-r ${getCompatibilityColor(event)} hover:shadow-lg`
                      }`}
                    >
                      {event.currentDogs >= event.maxDogs ? (
                        <>
                          <X className="w-5 h-5" />
                          Event Full
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5" />
                          Join Event
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-earth-400 mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold text-earth-700 mb-2">
                No Events Found
              </h3>
              <p className="text-earth-500 font-body">
                No matching events found for {dog.name} right now. Check back later!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-earth-200 bg-earth-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-body font-semibold text-earth-700 bg-white border border-earth-300 hover:bg-earth-50 transition-all duration-300"
            >
              Close
            </button>
            <button
              onClick={() => window.location.href = '/events'}
              className="flex-1 bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white font-body font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Browse All Events
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default EventSuggestions

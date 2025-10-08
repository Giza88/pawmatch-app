import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { DogEvent } from '../pages/EventsPage'
import { DogProfile } from './DogProfileCard'
import { useEvents } from '../contexts/EventsContext'

interface EventsSuggestionProps {
  dog: DogProfile
  events: DogEvent[]
  onViewEvents: () => void
}

const EventsSuggestion: React.FC<EventsSuggestionProps> = ({ dog, events, onViewEvents }) => {
  const { joinEvent } = useEvents()
  
  // Filter events that would be good for this dog
  const relevantEvents = events.filter(event => {
    const sizeMatch = event.dogSize === 'All Sizes' || event.dogSize === dog.size
    const energyMatch = event.energyLevel === 'All Levels' || event.energyLevel === dog.energyLevel
    return sizeMatch && energyMatch
  }).slice(0, 2) // Show max 2 events

  if (relevantEvents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4"
      >
        <div className="text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found for {dog.name}</h3>
          <p className="text-gray-500 mb-3">Check out all available events or create your own!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewEvents}
            className="btn-primary py-2 px-6 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Browse Events
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Events for {dog.name}</h3>
        <button
          onClick={onViewEvents}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {relevantEvents.map((event) => (
          <div
            key={event.id}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                event.eventType === 'Playdate' ? 'bg-blue-100 text-blue-800' :
                event.eventType === 'Walk' ? 'bg-green-100 text-green-800' :
                event.eventType === 'Training' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {event.eventType}
              </span>
            </div>
            
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {event.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{event.currentDogs}/{event.maxDogs} dogs</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => joinEvent(event.id)}
              disabled={event.currentDogs >= event.maxDogs}
              className={`w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-300 ${
                event.currentDogs >= event.maxDogs
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
            >
              {event.currentDogs >= event.maxDogs ? 'Event Full' : 'Quick Join'}
            </motion.button>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onViewEvents}
        className="w-full mt-3 btn-primary py-2 text-sm flex items-center justify-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        Browse More Events
      </motion.button>
    </motion.div>
  )
}

export default EventsSuggestion

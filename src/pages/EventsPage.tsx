import React, { useState } from 'react'
import { Calendar, MapPin, Users, Plus, Clock, Filter, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEvents } from '../contexts/EventsContext'
import CreateEventForm from '../components/CreateEventForm'

export interface DogEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  maxDogs: number
  currentDogs: number
  organizer: string
  organizerPhoto: string
  eventType: 'Walk' | 'Playdate' | 'Training' | 'Social' | 'Other'
  dogSize: 'All Sizes' | 'Small' | 'Medium' | 'Large' | 'Extra Large'
  energyLevel: 'All Levels' | 'Low' | 'Medium' | 'High'
  isPublic: boolean
  coordinates?: { lat: number; lng: number }
}

const EventsPage: React.FC = () => {
  const { events, joinEvent, leaveEvent } = useEvents()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All')

  const eventTypes = ['All', 'Walk', 'Playdate', 'Training', 'Social', 'Other']

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'All' || event.eventType === selectedType
    return matchesSearch && matchesType
  })

  const handleJoinEvent = (eventId: string) => {
    joinEvent(eventId)
  }

  const handleLeaveEvent = (eventId: string) => {
    leaveEvent(eventId)
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
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-orange-500 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/70 to-orange-600/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-script font-bold text-white mb-4">
            Dog Events & Meetups
          </h1>
          <p className="text-xl text-white/90 font-body max-w-2xl mx-auto">
            Discover amazing events happening in your area and create unforgettable memories with your furry friends
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-earth-900">Events</h2>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-3 rounded-xl font-body font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
            />
          </div>

          {/* Event Type Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                    : 'bg-white/80 text-earth-700 hover:bg-teal-50 border border-earth-200 backdrop-blur-sm'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-md mx-auto px-4 pb-6">
        <AnimatePresence>
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 p-4 mb-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold text-earth-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-earth-600 line-clamp-2 font-body">{event.description}</p>
                </div>
                <div className="ml-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium font-body ${
                    event.eventType === 'Playdate' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                    event.eventType === 'Walk' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                    event.eventType === 'Training' ? 'bg-nature-100 text-nature-800 border border-nature-200' :
                    'bg-earth-100 text-earth-800 border border-earth-200'
                  }`}>
                    {event.eventType}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-earth-600 font-body">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-earth-600 font-body">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-earth-600 font-body">
                  <Users className="w-4 h-4 text-nature-500" />
                  <span>{event.currentDogs}/{event.maxDogs} dogs</span>
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-teal-50/50 rounded-lg border border-teal-200/50">
                <img
                  src={event.organizerPhoto}
                  alt={event.organizer}
                  className="w-8 h-8 rounded-full object-cover border-2 border-teal-200"
                />
                <div>
                  <p className="text-sm font-medium text-earth-900 font-body">Organized by</p>
                  <p className="text-sm text-earth-600 font-body">{event.organizer}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {event.currentDogs < event.maxDogs ? (
                  <button
                    onClick={() => handleJoinEvent(event.id)}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-2 px-4 rounded-xl text-sm font-medium font-body transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Join Event
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-earth-300 text-earth-500 py-2 px-4 rounded-xl cursor-not-allowed font-body"
                  >
                    Event Full
                  </button>
                )}
                
                {event.currentDogs > 0 && (
                  <button
                    onClick={() => handleLeaveEvent(event.id)}
                    className="px-4 py-2 border border-earth-200 rounded-xl text-earth-700 hover:bg-earth-50 transition-all duration-300 font-body bg-white/80 backdrop-blur-sm"
                  >
                    Leave
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-teal-400 mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-earth-700 mb-2">No events found</h3>
            <p className="text-earth-500 font-body">Try adjusting your search or create a new event!</p>
          </div>
        )}
      </div>

            {/* Create Event Form */}
      <CreateEventForm 
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
      />
    </div>
  )
}

export default EventsPage

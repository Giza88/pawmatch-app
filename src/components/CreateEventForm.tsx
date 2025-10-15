import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, X } from 'lucide-react'
import { useEvents } from '../contexts/EventsContext'
import { useProfile } from '../contexts/ProfileContext'

interface CreateEventFormProps {
  isOpen: boolean
  onClose: () => void
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ isOpen, onClose }) => {
  const { createEvent } = useEvents()
  const { profile } = useProfile()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: 10,
    eventType: 'walk',
    isPrivate: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const newEvent = {
        id: Date.now().toString(),
        ...formData,
        date: new Date(`${formData.date}T${formData.time}`).toISOString(),
        createdAt: new Date().toISOString(),
        organizer: profile.name,
        organizerPhoto: profile.avatar,
        attendees: [],
        status: 'upcoming'
      }
      
      await createEvent(newEvent)
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxAttendees: 10,
        eventType: 'walk',
        isPrivate: false
      })
      onClose()
    } catch (error) {
      console.error('Error creating event:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

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
        className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-earth-200 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-earth-900">Create New Event</h2>
                <button
                  onClick={onClose}
                  className="btn-icon-sm"
                  aria-label="Close form"
                >
                  <X className="w-5 h-5 text-earth-600" />
                </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-earth-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="Morning Park Walk"
            />
          </div>

          {/* Event Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-earth-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              placeholder="Tell others about your event..."
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-earth-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-earth-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-earth-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="Central Park, Main Entrance"
            />
          </div>

          {/* Event Type and Max Attendees */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-earth-700 mb-2">
                Event Type
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="walk">Walk</option>
                <option value="playdate">Playdate</option>
                <option value="training">Training</option>
                <option value="social">Social Meetup</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="maxAttendees" className="block text-sm font-medium text-earth-700 mb-2">
                Max Attendees
              </label>
              <input
                type="number"
                id="maxAttendees"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                min="1"
                max="50"
                className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleInputChange}
              className="w-4 h-4 text-teal-600 border-earth-300 rounded focus:ring-teal-500"
            />
            <label htmlFor="isPrivate" className="ml-2 text-sm text-earth-700">
              Private event (invite only)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary-teal btn-full"
          >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CreateEventForm

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, User, X, Phone } from 'lucide-react'
import { useHealth } from '../contexts/HealthContext'

interface CreateAppointmentFormProps {
  isOpen: boolean
  onClose: () => void
}

const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = ({ isOpen, onClose }) => {
  const { addAppointment } = useHealth()
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    time: '',
    vet: '',
    location: '',
    phone: '',
    notes: '',
    isCompleted: false
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
      const newAppointment = {
        id: Date.now().toString(),
        type: formData.type as 'Checkup' | 'Vaccination' | 'Surgery' | 'Emergency' | 'Follow-up' | 'Other',
        date: formData.date,
        time: formData.time,
        vet: formData.vet,
        location: formData.location,
        phone: formData.phone,
        notes: formData.notes,
        isCompleted: formData.isCompleted
      }
      
      await addAppointment(newAppointment)
      setFormData({
        type: '',
        date: '',
        time: '',
        vet: '',
        location: '',
        phone: '',
        notes: '',
        isCompleted: false
      })
      onClose()
    } catch (error) {
      console.error('Error adding appointment:', error)
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
          <h2 className="text-2xl font-display font-bold text-earth-900">Add Appointment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-earth-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-earth-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Appointment Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-earth-700 mb-2">
              Appointment Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="">Select type</option>
              <option value="Checkup">Checkup</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Surgery">Surgery</option>
              <option value="Emergency">Emergency</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Other">Other</option>
            </select>
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
                className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Vet/Doctor */}
          <div>
            <label htmlFor="vet" className="block text-sm font-medium text-earth-700 mb-2">
              Vet/Doctor
            </label>
            <input
              type="text"
              id="vet"
              name="vet"
              value={formData.vet}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Vet name"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-earth-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Clinic name and address"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-earth-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-earth-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              placeholder="Any special instructions or concerns..."
            />
          </div>

          {/* Completed Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isCompleted"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleInputChange}
              className="w-4 h-4 text-orange-600 border-earth-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="isCompleted" className="ml-2 text-sm text-earth-700">
              Appointment completed
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-earth-300 disabled:to-earth-400 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding Appointment...' : 'Add Appointment'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CreateAppointmentForm

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Syringe, Calendar, AlertCircle, X } from 'lucide-react'
import { useHealth } from '../contexts/HealthContext'

interface CreateVaccinationFormProps {
  isOpen: boolean
  onClose: () => void
}

const CreateVaccinationForm: React.FC<CreateVaccinationFormProps> = ({ isOpen, onClose }) => {
  const { addVaccination } = useHealth()
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    nextDueDate: '',
    vet: '',
    notes: '',
    isRequired: true
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
      const newVaccination = {
        name: formData.name,
        dateGiven: formData.date,
        nextDueDate: formData.nextDueDate || '',
        isOverdue: false,
        isUpcoming: formData.nextDueDate ? new Date(formData.nextDueDate) > new Date() : false,
        vet: formData.vet,
        notes: formData.notes
      }
      
      addVaccination(newVaccination)
      setFormData({
        name: '',
        date: '',
        nextDueDate: '',
        vet: '',
        notes: '',
        isRequired: true
      })
      onClose()
    } catch (error) {
      console.error('Error adding vaccination:', error)
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
          <h2 className="text-2xl font-display font-bold text-earth-900">Add Vaccination</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-earth-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-earth-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vaccination Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-earth-700 mb-2">
              Vaccination Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="e.g., Rabies, DHPP, Bordetella"
            />
          </div>

          {/* Date Given */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-earth-700 mb-2">
              Date Given *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Next Due Date */}
          <div>
            <label htmlFor="nextDueDate" className="block text-sm font-medium text-earth-700 mb-2">
              Next Due Date
            </label>
            <input
              type="date"
              id="nextDueDate"
              name="nextDueDate"
              value={formData.nextDueDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-earth-500 mt-1">Leave blank if not applicable</p>
          </div>

          {/* Vet/Clinic */}
          <div>
            <label htmlFor="vet" className="block text-sm font-medium text-earth-700 mb-2">
              Vet/Clinic
            </label>
            <input
              type="text"
              id="vet"
              name="vet"
              value={formData.vet}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Vet clinic name"
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
              placeholder="Any additional notes about the vaccination..."
            />
          </div>

          {/* Required Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRequired"
              name="isRequired"
              checked={formData.isRequired}
              onChange={handleInputChange}
              className="w-4 h-4 text-orange-600 border-earth-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="isRequired" className="ml-2 text-sm text-earth-700">
              Required vaccination
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-earth-300 disabled:to-earth-400 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding Vaccination...' : 'Add Vaccination'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CreateVaccinationForm

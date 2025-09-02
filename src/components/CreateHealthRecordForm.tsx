import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Calendar, X, Upload } from 'lucide-react'
import { useHealth } from '../contexts/HealthContext'

interface CreateHealthRecordFormProps {
  isOpen: boolean
  onClose: () => void
}

const CreateHealthRecordForm: React.FC<CreateHealthRecordFormProps> = ({ isOpen, onClose }) => {
  const { addHealthRecord } = useHealth()
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    vet: '',
    notes: '',
    fileUrl: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const newHealthRecord = {
        id: Date.now().toString(),
        title: formData.title,
        type: formData.type as 'Vaccination' | 'Test Results' | 'Prescription' | 'Surgery Report' | 'Other',
        date: formData.date,
        vet: formData.vet,
        fileUrl: formData.fileUrl || undefined,
        notes: formData.notes
      }
      
      await addHealthRecord(newHealthRecord)
      setFormData({
        title: '',
        type: '',
        date: '',
        vet: '',
        notes: '',
        fileUrl: ''
      })
      onClose()
    } catch (error) {
      console.error('Error adding health record:', error)
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
          <h2 className="text-2xl font-display font-bold text-earth-900">Add Health Record</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-earth-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-earth-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Record Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-earth-700 mb-2">
              Record Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="e.g., Blood test results, Surgery report"
            />
          </div>

          {/* Date */}
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
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Record Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-earth-700 mb-2">
              Record Type *
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
              <option value="Vaccination">Vaccination</option>
              <option value="Test Results">Test Results</option>
              <option value="Prescription">Prescription</option>
              <option value="Surgery Report">Surgery Report</option>
              <option value="Other">Other</option>
            </select>
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

          {/* File URL */}
          <div>
            <label htmlFor="fileUrl" className="block text-sm font-medium text-earth-700 mb-2">
              File URL (Optional)
            </label>
            <input
              type="url"
              id="fileUrl"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="https://example.com/document.pdf"
            />
            <p className="text-xs text-earth-500 mt-1">Link to digital copy of the record</p>
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
              placeholder="Any additional information about this record..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-earth-300 disabled:to-earth-400 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding Record...' : 'Add Health Record'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CreateHealthRecordForm

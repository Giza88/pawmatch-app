import React from 'react'
import { motion } from 'framer-motion'
import { User, Dog, Calendar, Shield, CheckCircle } from 'lucide-react'
import { OnboardingData } from '../hooks/useOnboarding'

interface OnboardingDataViewerProps {
  data: OnboardingData
  onClose: () => void
}

const OnboardingDataViewer: React.FC<OnboardingDataViewerProps> = ({ data, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-earth-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-earth-900">Onboarding Data</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-earth-100 rounded-full transition-colors"
          >
            <CheckCircle className="w-5 h-5 text-earth-600" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Personal Information */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-teal-600" />
              <h3 className="font-medium text-teal-900">Personal Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div><strong>Name:</strong> {data.fullName}</div>
              <div><strong>Email:</strong> {data.email}</div>
              <div><strong>Phone:</strong> {data.phone}</div>
            </div>
          </div>

          {/* Dog Information */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Dog className="w-5 h-5 text-orange-600" />
              <h3 className="font-medium text-orange-900">Dog Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div><strong>Name:</strong> {data.dogName}</div>
              <div><strong>Breed:</strong> {data.breed}</div>
              <div><strong>Age:</strong> {data.age} {data.age === 1 ? 'year' : 'years'} old</div>
              <div><strong>Size:</strong> {data.size}</div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-purple-900">Preferences</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div><strong>Notifications:</strong> {data.preferences.notifications ? 'Enabled' : 'Disabled'}</div>
              <div><strong>Location Sharing:</strong> {data.preferences.locationSharing ? 'Enabled' : 'Disabled'}</div>
              <div><strong>Profile Visibility:</strong> {data.preferences.profileVisibility}</div>
            </div>
          </div>

          {/* Completion Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-green-900">Account Status</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div><strong>Status:</strong> {data.isCompleted ? 'Completed' : 'In Progress'}</div>
              {data.completedAt && (
                <div><strong>Completed:</strong> {formatDate(data.completedAt)}</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-earth-200">
          <p className="text-xs text-earth-500 text-center">
            This data is stored locally on your device and can be reset from your profile settings.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default OnboardingDataViewer

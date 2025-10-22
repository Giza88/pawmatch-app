import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera, User, Dog, Cake, Ruler, Bell, MapPin, Shield, CheckCircle } from 'lucide-react'
import { useOnboarding } from '../hooks/useOnboarding'
import Logo from './Logo'
import DogPhotoUpload from './DogPhotoUpload'

interface OnboardingFlowProps {
  onComplete: () => void
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { onboardingData, updateOnboardingData, completeOnboarding } = useOnboarding()
  const [currentStep, setCurrentStep] = useState(1)
  const [dogPhoto, setDogPhoto] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string | number) => {
    updateOnboardingData({ [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!onboardingData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!onboardingData.email?.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(onboardingData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!onboardingData.phone?.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-\(\)\+]+$/.test(onboardingData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!onboardingData.dogName?.trim()) {
      newErrors.dogName = 'Dog name is required'
    }
    
    if (!onboardingData.breed?.trim()) {
      newErrors.breed = 'Dog breed is required'
    }
    
    if (!onboardingData.age || onboardingData.age < 1) {
      newErrors.age = 'Please enter a valid age (1 year or older)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePreferenceChange = (key: string, value: any) => {
    updateOnboardingData({
      preferences: {
        ...onboardingData.preferences,
        [key]: value
      }
    })
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Convert file to Base64 string for persistence
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setDogPhoto(base64String)
        // Store the Base64 string in onboarding data
        updateOnboardingData({ dogPhoto: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const nextStep = () => {
    // Validate current step before proceeding
    let isValid = true
    
    if (currentStep === 1) {
      isValid = validateStep1()
    } else if (currentStep === 2) {
      isValid = validateStep2()
    }
    
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else if (isValid && currentStep === 4) {
      completeOnboarding()
      onComplete()
    }
  }

  const skipPhotoStep = () => {
    // Skip the photo step and go to preferences
    setCurrentStep(4)
  }

  const handleCreateAccount = () => {
    try {
      // Mark onboarding as completed
      completeOnboarding()
      
      // Wait a moment for the state to update and save to localStorage
      setTimeout(() => {
        onComplete()
      }, 100)
      
    } catch (error) {
      console.error('❌ Error creating account:', error)
    }
  }

  const handleSkipOnboarding = () => {
    try {
      completeOnboarding()
      
      // Wait a moment for the state to update and save to localStorage
      setTimeout(() => {
        onComplete()
      }, 100)
    } catch (error) {
      console.error('❌ Error skipping onboarding:', error)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="mb-6">
          <Logo size="lg" showText={true} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Pawmatch™!</h2>
        <p className="text-gray-600">Let's get to know you and your furry friend to create the perfect matching experience.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={onboardingData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Full Name"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">@</div>
            <input
              type="email"
              value={onboardingData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Email Address"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">📞</div>
            <input
              type="tel"
              value={onboardingData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Phone Number"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">i</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Why we need this</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• To create your personalized profile</li>
              <li>• To connect you with nearby dog owners</li>
              <li>• To send important updates about events</li>
              <li>• To ensure a safe and verified community</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your dog</h2>
        <p className="text-gray-600">Help us find the perfect matches for your furry friend.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dog's Name</label>
          <div className="relative">
            <Dog className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={onboardingData.dogName}
              onChange={(e) => handleInputChange('dogName', e.target.value)}
              placeholder="Dog's Name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
          <div className="relative">
            <Dog className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={onboardingData.breed}
              onChange={(e) => handleInputChange('breed', e.target.value)}
              placeholder="e.g., Golden Retriever, Labrador, etc."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
            <div className="relative">
              <Cake className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min="0"
                max="25"
                value={onboardingData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 1)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={onboardingData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💡</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Matching Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Accurate breed info helps find compatible playmates</li>
              <li>• Size matters for safe play interactions</li>
              <li>• Age helps match energy levels</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add a photo of your dog</h2>
        <p className="text-gray-600">A great photo helps other dog owners get to know your furry friend better.</p>
      </div>

      <DogPhotoUpload
        existingPhotos={dogPhoto || onboardingData.dogPhoto ? [dogPhoto || onboardingData.dogPhoto].filter(Boolean) as string[] : []}
        onPhotosSelect={(files) => {
          if (files.length > 0) {
            const file = files[0]
            const reader = new FileReader()
            reader.onloadend = () => {
              const base64String = reader.result as string
              setDogPhoto(base64String)
              updateOnboardingData({ dogPhoto: base64String })
            }
            reader.readAsDataURL(file)
          }
        }}
        maxPhotos={3}
        className="max-w-md mx-auto"
      />

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">��</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Photo Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use natural lighting for the best results</li>
              <li>• Show your dog's face clearly</li>
              <li>• Capture their personality and energy</li>
              <li>• Avoid blurry or dark photos</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set your preferences</h2>
        <p className="text-gray-600">Customize your experience and control your privacy settings.</p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="font-medium text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-600">Get notified about matches and events</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={onboardingData.preferences.notifications}
              onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Location Sharing */}
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="font-medium text-gray-900">Location Sharing</h3>
              <p className="text-sm text-gray-600">Find nearby dog owners and events</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={onboardingData.preferences.locationSharing}
              onChange={(e) => handlePreferenceChange('locationSharing', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* Profile Visibility */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-purple-500" />
            <div>
              <h3 className="font-medium text-gray-900">Profile Visibility</h3>
              <p className="text-sm text-gray-600">Control who can see your profile</p>
            </div>
          </div>
          <select
            value={onboardingData.preferences.profileVisibility}
            onChange={(e) => handlePreferenceChange('profileVisibility', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="public">Public - Anyone can see your profile</option>
            <option value="friends">Friends Only - Only matched users can see</option>
            <option value="private">Private - Only you can see</option>
          </select>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Privacy First</h4>
            <p className="text-sm text-gray-600">
              You can change these settings anytime in your profile. We never share your personal information with third parties.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="p-2 hover:bg-teal-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-teal-600" />
              </button>
            )}
            <h1 className="text-xl font-display font-semibold text-earth-900">Create Account</h1>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="text-sm text-earth-600 mb-2 font-body">Step {currentStep} of 4</div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    step <= currentStep ? 'bg-gradient-to-r from-teal-500 to-teal-600' : 'bg-earth-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-md mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-earth-200 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={currentStep === 4 ? handleCreateAccount : nextStep}
            className="btn-primary-teal btn-full text-lg"
          >
            {currentStep === 4 ? 'Create Account' : 'Continue'}
          </button>
          
          {currentStep === 3 && (
            <button 
              onClick={skipPhotoStep}
              className="w-full text-center text-teal-600 py-2 mt-2 font-body hover:text-teal-700 transition-colors"
            >
              Skip photo for now
            </button>
          )}
          
          {currentStep === 4 && (
            <button 
              onClick={handleSkipOnboarding}
              className="w-full text-center text-teal-600 py-2 mt-2 font-body hover:text-teal-700 transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingFlow

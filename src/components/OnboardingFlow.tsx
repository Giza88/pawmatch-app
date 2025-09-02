import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera, User, Dog, Cake, Ruler } from 'lucide-react'

interface OnboardingFlowProps {
  onComplete: () => void
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dogName: '',
    breed: '',
    age: 1,
    size: 'Medium' as 'Small' | 'Medium' | 'Large' | 'Extra Large'
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
        <p className="text-gray-600">We need some basic information to create your profile and connect you with other dog owners.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">@</div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">📞</div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Phone Number"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">i</span>
            </div>
          </div>
          <p className="ml-3 text-sm text-green-800">
            Your information is secure and will only be used to connect you with other dog owners in your area.
          </p>
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
        <p className="text-gray-600">Help us find the perfect playmates by sharing your dog's details.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dog's Name</label>
          <div className="relative">
            <Dog className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.dogName}
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
            <select
              value={formData.breed}
              onChange={(e) => handleInputChange('breed', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="">Select Breed</option>
              <option value="Golden Retriever">Golden Retriever</option>
              <option value="Labrador">Labrador</option>
              <option value="Border Collie">Border Collie</option>
              <option value="German Shepherd">German Shepherd</option>
              <option value="Mixed Breed">Mixed Breed</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">▼</div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <div className="flex items-center gap-4">
            <Cake className="w-5 h-5 text-gray-400" />
            <button
              onClick={() => handleInputChange('age', Math.max(1, formData.age - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              -
            </button>
            <span className="text-lg font-medium min-w-[80px] text-center">
              {formData.age} {formData.age === 1 ? 'year' : 'years'} old
            </span>
            <button
              onClick={() => handleInputChange('age', formData.age + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <div className="grid grid-cols-4 gap-2">
            {(['Small', 'Medium', 'Large', 'Extra Large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => handleInputChange('size', size)}
                className={`py-2 px-3 rounded-lg border transition-colors ${
                  formData.size === size
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💡</span>
            </div>
          </div>
          <p className="ml-3 text-sm text-orange-800">
            Did you know? Dogs of similar sizes and energy levels often make the best playmates!
          </p>
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

      <div className="flex justify-center">
        <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center hover:border-primary-400 transition-colors cursor-pointer">
          <Camera className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">Add Dog Photo</span>
          <span className="text-xs text-gray-500">Tap to select</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💡</span>
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
            <div className="text-sm text-earth-600 mb-2 font-body">Step {currentStep} of 3</div>
            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
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
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-earth-200 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={nextStep}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg"
          >
            {currentStep === 3 ? 'Create Account' : 'Continue'}
          </button>
          
          {currentStep === 3 && (
            <button className="w-full text-center text-teal-600 py-2 mt-2 font-body hover:text-teal-700 transition-colors">
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingFlow

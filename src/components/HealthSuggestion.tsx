import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Syringe, Pill, AlertCircle, ArrowRight } from 'lucide-react'
import { DogProfile } from './DogProfileCard'

interface HealthSuggestionProps {
  dog: DogProfile
  onViewHealth: () => void
}

const HealthSuggestion: React.FC<HealthSuggestionProps> = ({ dog, onViewHealth }) => {
  // Determine health suggestions based on dog characteristics
  const getHealthSuggestions = () => {
    const suggestions = []
    
    // Age-based suggestions
    if (dog.age <= 2) {
      suggestions.push({
        icon: Syringe,
        title: 'Puppy Vaccinations',
        description: `${dog.name} may need core vaccinations`,
        priority: 'high'
      })
    } else if (dog.age >= 7) {
      suggestions.push({
        icon: Heart,
        title: 'Senior Health Check',
        description: 'Consider annual wellness exams',
        priority: 'medium'
      })
    }
    
    // Size-based suggestions
    if (dog.size === 'Large' || dog.size === 'Extra Large') {
      suggestions.push({
        icon: Heart,
        title: 'Joint Health',
        description: 'Large breeds benefit from joint supplements',
        priority: 'medium'
      })
    }
    
    // Energy level suggestions
    if (dog.energyLevel === 'High') {
      suggestions.push({
        icon: Pill,
        title: 'Preventive Care',
        description: 'Active dogs need regular parasite prevention',
        priority: 'medium'
      })
    }
    
    return suggestions.slice(0, 2) // Show max 2 suggestions
  }

  const healthSuggestions = getHealthSuggestions()

  if (healthSuggestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4"
      >
        <div className="text-center">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Keep {dog.name} Healthy!</h3>
          <p className="text-gray-500 mb-3">Track vaccinations, medications, and vet visits</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewHealth}
            className="btn-primary py-2 px-6 flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            View Health Dashboard
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
        <h3 className="text-lg font-semibold text-gray-900">Health for {dog.name}</h3>
        <button
          onClick={onViewHealth}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {healthSuggestions.map((suggestion, index) => {
          const Icon = suggestion.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  suggestion.priority === 'high' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    suggestion.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                  <p className="text-xs text-gray-600">{suggestion.description}</p>
                </div>
                {suggestion.priority === 'high' && (
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onViewHealth}
        className="w-full mt-3 btn-primary py-2 text-sm flex items-center justify-center gap-2"
      >
        <Heart className="w-4 h-4" />
        Manage Health Records
      </motion.button>
    </motion.div>
  )
}

export default HealthSuggestion

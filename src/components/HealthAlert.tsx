import React from 'react'
import { AlertCircle, Syringe, Calendar, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

interface HealthAlertProps {
  onViewHealth: () => void
}

const HealthAlert: React.FC<HealthAlertProps> = ({ onViewHealth }) => {
  // Mock health alerts - in a real app, these would come from the health context
  const healthAlerts = [
    {
      id: '1',
      type: 'vaccination',
      message: 'Bordetella vaccination due in 2 weeks',
      priority: 'high',
      icon: Syringe
    },
    {
      id: '2',
      type: 'appointment',
      message: 'Annual wellness exam scheduled for next week',
      priority: 'medium',
      icon: Calendar
    }
  ]

  if (healthAlerts.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-2">Health Reminders</h3>
          <div className="space-y-2">
            {healthAlerts.map((alert) => {
              const Icon = alert.icon
              return (
                <div key={alert.id} className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${
                    alert.priority === 'high' ? 'text-red-600' : 'text-orange-600'
                  }`} />
                  <span className="text-sm text-red-800">{alert.message}</span>
                </div>
              )
            })}
          </div>
          <button
            onClick={onViewHealth}
            className="mt-3 text-sm font-medium text-red-700 hover:text-red-800 underline"
          >
            View all health details →
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default HealthAlert

import React from 'react'
import { Bell, TestTube } from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'
import { notificationService } from '../services/notificationService'

/**
 * NOTIFICATION TEST COMPONENT
 * 
 * This component provides a way to test all notification types
 * Useful for development and debugging
 */
const NotificationTest: React.FC = () => {
  const { permission, requestPermission, sendTestNotification, isSupported } = useNotifications()

  const handleTestMatchNotification = () => {
    notificationService.sendMatchNotification('Buddy', 'Golden Retriever', 'Sarah Johnson')
  }

  const handleTestEventNotification = () => {
    notificationService.sendEventReminder('Dog Park Meetup', '2:00 PM', 'Central Dog Park')
  }

  const handleTestMessageNotification = () => {
    notificationService.sendMessageNotification('Mike', 'Hey! Want to set up a playdate?', 'Buddy')
  }

  const handleTestCommunityNotification = () => {
    notificationService.sendCommunityNotification('Best Dog Parks in the City', 'Lisa')
  }

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-800 text-sm">Notifications not supported on this device</p>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-earth-200 p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TestTube className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-display font-semibold text-earth-900">Notification Testing</h3>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className={`w-4 h-4 ${
            permission === 'granted' ? 'text-green-500' : 
            permission === 'denied' ? 'text-red-500' : 
            'text-yellow-500'
          }`} />
          <span className="text-sm font-medium text-earth-700">
            Status: {permission === 'granted' ? 'Enabled' : permission === 'denied' ? 'Blocked' : 'Not Set'}
          </span>
        </div>
        
        {permission !== 'granted' && (
          <button
            onClick={requestPermission}
            className="btn-primary text-sm py-2 px-3"
          >
            Enable Notifications
          </button>
        )}
      </div>

      {permission === 'granted' && (
        <div className="space-y-2">
          <button
            onClick={sendTestNotification}
            className="w-full btn-secondary text-sm py-2"
          >
            🧪 Test Basic Notification
          </button>
          
          <button
            onClick={handleTestMatchNotification}
            className="w-full btn-secondary text-sm py-2"
          >
            💕 Test Match Notification
          </button>
          
          <button
            onClick={handleTestEventNotification}
            className="w-full btn-secondary text-sm py-2"
          >
            📅 Test Event Notification
          </button>
          
          <button
            onClick={handleTestMessageNotification}
            className="w-full btn-secondary text-sm py-2"
          >
            💬 Test Message Notification
          </button>
          
          <button
            onClick={handleTestCommunityNotification}
            className="w-full btn-secondary text-sm py-2"
          >
            📢 Test Community Notification
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationTest

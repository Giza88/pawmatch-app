import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X } from 'lucide-react'
import { requestNotificationPermission, getNotificationSettings } from '../utils/notifications'

/**
 * NOTIFICATION PERMISSION BANNER
 * 
 * Shows a banner to request notification permission from users
 * Only appears if notifications are not yet enabled
 */
const NotificationPermissionBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    // Check if we should show the banner
    const settings = getNotificationSettings()
    const shouldShow = !settings.enabled && Notification.permission === 'default'
    
    // Only show after a delay to not be too pushy
    const timer = setTimeout(() => {
      setShowBanner(shouldShow)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleEnableNotifications = async () => {
    setIsRequesting(true)
    try {
      const permission = await requestNotificationPermission()
      if (permission === 'granted') {
        setShowBanner(false)
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error)
    } finally {
      setIsRequesting(false)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    // Store dismissal preference
    localStorage.setItem('pawmatch-notification-banner-dismissed', 'true')
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
      >
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-teal-100" />
            <div className="flex-1">
              <p className="text-sm font-medium">Stay updated with notifications!</p>
              <p className="text-xs text-teal-100">Get notified about matches and events</p>
            </div>
            <button
              onClick={handleEnableNotifications}
              disabled={isRequesting}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            >
              {isRequesting ? 'Enabling...' : 'Enable'}
            </button>
            <button
              onClick={handleDismiss}
              className="text-teal-100 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationPermissionBanner

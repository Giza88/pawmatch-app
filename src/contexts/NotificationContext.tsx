import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { requestNotificationPermission, onForegroundMessage } from '../config/firebase'

interface NotificationContextType {
  isSupported: boolean
  permission: NotificationPermission
  token: string | null
  requestPermission: () => Promise<boolean>
  sendTestNotification: () => void
  isInitialized: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [token, setToken] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check if notifications are supported
  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator
    setIsSupported(supported)
    
    if (supported) {
      setPermission(Notification.permission)
      
      // Get stored token
      const storedToken = localStorage.getItem('fcm-token')
      if (storedToken) {
        setToken(storedToken)
      }
    }
    
    setIsInitialized(true)
  }, [])

  // Set up foreground message listener
  useEffect(() => {
    if (isSupported && permission === 'granted') {
      onForegroundMessage()
    }
  }, [isSupported, permission])

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.log('❌ Notifications not supported on this device')
      return false
    }

    try {
      const token = await requestNotificationPermission()
      
      if (token) {
        setToken(token)
        setPermission('granted')
        return true
      } else {
        setPermission('denied')
        return false
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error)
      setPermission('denied')
      return false
    }
  }

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('🐾 Pawmatch™ Test', {
        body: 'Notifications are working perfectly!',
        icon: '/paw-icon.png',
        badge: '/paw-badge.png',
        tag: 'pawmatch-test'
      })
    }
  }

  const value: NotificationContextType = {
    isSupported,
    permission,
    token,
    requestPermission,
    sendTestNotification,
    isInitialized
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

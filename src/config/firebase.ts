import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// Firebase configuration
// Note: In production, you'll need to replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "pawmatch-app.firebaseapp.com",
  projectId: "pawmatch-app",
  storageBucket: "pawmatch-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id-here"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app)

// Request permission and get token for push notifications
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      console.log('✅ Notification permission granted')
      
      // Get the registration token
      const token = await getToken(messaging, {
        vapidKey: 'your-vapid-key-here' // Replace with your VAPID key
      })
      
      if (token) {
        console.log('🔑 Registration token:', token)
        // Store token in localStorage for now (in production, send to your backend)
        localStorage.setItem('fcm-token', token)
        return token
      } else {
        console.log('❌ No registration token available')
        return null
      }
    } else {
      console.log('❌ Notification permission denied')
      return null
    }
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error)
    return null
  }
}

// Listen for foreground messages
export const onForegroundMessage = () => {
  return onMessage(messaging, (payload) => {
    console.log('📨 Message received in foreground:', payload)
    
    // Show custom notification
    const notificationTitle = payload.notification?.title || 'Pawmatch™'
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new notification',
      icon: '/paw-icon.png', // Add your app icon
      badge: '/paw-badge.png', // Add your badge icon
      tag: 'pawmatch-notification',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }

    // Show browser notification
    if ('serviceWorker' in navigator && 'Notification' in window) {
      new Notification(notificationTitle, notificationOptions)
    }
  })
}

export default app

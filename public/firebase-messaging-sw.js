// Firebase Service Worker for Push Notifications
// This file handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

// Initialize Firebase in the service worker
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "pawmatch-app.firebaseapp.com",
  projectId: "pawmatch-app",
  storageBucket: "pawmatch-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id-here"
}

firebase.initializeApp(firebaseConfig)

// Initialize Firebase Messaging
const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('📨 Received background message:', payload)

  const notificationTitle = payload.notification?.title || 'Pawmatch™'
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/paw-icon.png',
    badge: '/paw-badge.png',
    tag: 'pawmatch-notification',
    requireInteraction: true,
    data: payload.data,
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

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event)

  event.notification.close()

  // Handle different notification types
  const data = event.notification.data || {}
  let url = '/'

  switch (data.type) {
    case 'match':
      url = '/matches'
      break
    case 'message':
      url = '/chat'
      break
    case 'event':
      url = '/events'
      break
    case 'community':
      url = '/community'
      break
    default:
      url = '/'
  }

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          client.navigate(url)
          return
        }
      }
      // If app is not open, open it
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

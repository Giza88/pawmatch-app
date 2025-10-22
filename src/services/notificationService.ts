/**
 * NOTIFICATION SERVICE - Handles all notification logic for Pawmatch™
 * 
 * This service manages:
 * - Match notifications
 * - Event reminders
 * - Message notifications
 * - Community updates
 * - Test notifications
 */

export interface NotificationData {
  type: 'match' | 'event' | 'message' | 'community' | 'test'
  title: string
  body: string
  data?: Record<string, any>
  icon?: string
  badge?: string
  tag?: string
}

class NotificationService {
  private isSupported: boolean
  private permission: NotificationPermission

  constructor() {
    this.isSupported = 'Notification' in window
    this.permission = this.isSupported ? Notification.permission : 'denied'
  }

  /**
   * Send a match notification when someone likes your dog
   */
  sendMatchNotification = (dogName: string, dogBreed: string, ownerName: string) => {
    const notification: NotificationData = {
      type: 'match',
      title: '🐾 New Match!',
      body: `${ownerName} liked ${dogName} the ${dogBreed}! Start a conversation!`,
      data: { type: 'match', dogName, ownerName },
      icon: '/paw-icon.png',
      badge: '/paw-badge.png',
      tag: `match-${dogName}`
    }

    this.sendNotification(notification)
  }

  /**
   * Send an event reminder notification
   */
  sendEventReminder = (eventTitle: string, eventTime: string, location: string) => {
    const notification: NotificationData = {
      type: 'event',
      title: '📅 Event Reminder',
      body: `${eventTitle} starts at ${eventTime} at ${location}`,
      data: { type: 'event', eventTitle, eventTime, location },
      icon: '/paw-icon.png',
      badge: '/paw-badge.png',
      tag: `event-${eventTitle}`
    }

    this.sendNotification(notification)
  }

  /**
   * Send a message notification
   */
  sendMessageNotification = (senderName: string, message: string, dogName: string) => {
    const notification: NotificationData = {
      type: 'message',
      title: `💬 New message from ${senderName}`,
      body: `${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
      data: { type: 'message', senderName, dogName },
      icon: '/paw-icon.png',
      badge: '/paw-badge.png',
      tag: `message-${senderName}`
    }

    this.sendNotification(notification)
  }

  /**
   * Send a community update notification
   */
  sendCommunityNotification = (postTitle: string, authorName: string) => {
    const notification: NotificationData = {
      type: 'community',
      title: '📢 New Community Post',
      body: `${authorName} posted: ${postTitle}`,
      data: { type: 'community', postTitle, authorName },
      icon: '/paw-icon.png',
      badge: '/paw-badge.png',
      tag: `community-${postTitle}`
    }

    this.sendNotification(notification)
  }

  /**
   * Send a test notification
   */
  sendTestNotification = () => {
    const notification: NotificationData = {
      type: 'test',
      title: '🐾 Pawmatch™ Test',
      body: 'Notifications are working perfectly!',
      data: { type: 'test' },
      icon: '/paw-icon.png',
      badge: '/paw-badge.png',
      tag: 'test-notification'
    }

    this.sendNotification(notification)
  }

  /**
   * Core notification sending method
   */
  private sendNotification = (notification: NotificationData) => {
    if (!this.isSupported || this.permission !== 'granted') {
      console.log('❌ Notifications not supported or permission denied')
      return
    }

    try {
      const notificationOptions: NotificationOptions = {
        body: notification.body,
        icon: notification.icon || '/paw-icon.png',
        badge: notification.badge || '/paw-badge.png',
        tag: notification.tag || 'pawmatch-notification',
        requireInteraction: true,
        data: notification.data
      }

      const browserNotification = new Notification(notification.title, notificationOptions)

      // Handle notification click
      browserNotification.onclick = (event) => {
        event.preventDefault()
        window.focus()
        
        // Handle different notification types
        switch (notification.type) {
          case 'match':
            // Navigate to matches page
            window.location.href = '/matches'
            break
          case 'message':
            // Navigate to chat page
            window.location.href = '/chat'
            break
          case 'event':
            // Navigate to events page
            window.location.href = '/events'
            break
          case 'community':
            // Navigate to community page
            window.location.href = '/community'
            break
          default:
            // Navigate to home page
            window.location.href = '/'
        }
        
        browserNotification.close()
      }

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        browserNotification.close()
      }, 5000)

      console.log(`📨 Sent ${notification.type} notification:`, notification.title)
    } catch (error) {
      console.error('❌ Error sending notification:', error)
    }
  }

  /**
   * Update permission status
   */
  updatePermission = (newPermission: NotificationPermission) => {
    this.permission = newPermission
  }

  /**
   * Get current permission status
   */
  getPermission = (): NotificationPermission => {
    return this.permission
  }

  /**
   * Check if notifications are supported
   */
  getSupported = (): boolean => {
    return this.isSupported
  }
}

// Create and export singleton instance
export const notificationService = new NotificationService()
export default notificationService

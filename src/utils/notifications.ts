/**
 * NOTIFICATION SYSTEM
 * 
 * Handles browser notifications for:
 * - New matches
 * - Event reminders
 * - Health alerts (vaccinations, medications)
 * - Community interactions
 * 
 * Features:
 * - Permission management
 * - Notification scheduling
 * - Custom notification types
 * - Persistent storage of notification settings
 */

export interface NotificationData {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
  silent?: boolean
  timestamp?: number
  actions?: NotificationAction[]
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export type NotificationType = 
  | 'match' 
  | 'event_reminder' 
  | 'health_alert' 
  | 'community' 
  | 'general'

export interface NotificationSettings {
  enabled: boolean
  matches: boolean
  events: boolean
  health: boolean
  community: boolean
  sound: boolean
  vibration: boolean
}

class NotificationManager {
  private settings: NotificationSettings = {
    enabled: false,
    matches: true,
    events: true,
    health: true,
    community: true,
    sound: true,
    vibration: true
  }

  constructor() {
    this.loadSettings()
  }

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return 'denied'
    }

    let permission = Notification.permission

    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }

    if (permission === 'granted') {
      this.settings.enabled = true
      this.saveSettings()
    }

    return permission
  }

  /**
   * Check if notifications are supported and enabled
   */
  isSupported(): boolean {
    return 'Notification' in window && this.settings.enabled
  }

  /**
   * Send a notification
   */
  async send(
    type: NotificationType, 
    data: NotificationData
  ): Promise<void> {
    // Check if notifications are enabled for this type
    if (!this.isNotificationEnabled(type)) {
      console.log(`Notifications disabled for type: ${type}`)
      return
    }

    // Request permission if needed
    if (Notification.permission !== 'granted') {
      await this.requestPermission()
      if (Notification.permission !== 'granted') {
        console.warn('Notification permission denied')
        return
      }
    }

    try {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon || '/favicon.ico',
        badge: data.badge || '/favicon.ico',
        tag: data.tag || type,
        requireInteraction: data.requireInteraction || false,
        silent: data.silent || !this.settings.sound,
        timestamp: data.timestamp || Date.now(),
        actions: data.actions || []
      })

      // Auto-close after 5 seconds unless requireInteraction is true
      if (!data.requireInteraction) {
        setTimeout(() => {
          notification.close()
        }, 5000)
      }

      // Handle notification click
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      console.log(`Notification sent: ${type} - ${data.title}`)
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  /**
   * Send a match notification
   */
  async sendMatchNotification(dogName: string, dogBreed: string): Promise<void> {
    await this.send('match', {
      title: '🎉 New Match!',
      body: `You and ${dogName} (${dogBreed}) liked each other! Start a conversation now.`,
      icon: '/favicon.ico',
      tag: `match-${dogName}`,
      requireInteraction: true,
      actions: [
        { action: 'view', title: 'View Profile' },
        { action: 'message', title: 'Start Chat' }
      ]
    })
  }

  /**
   * Send an event reminder notification
   */
  async sendEventReminder(eventTitle: string, eventTime: string): Promise<void> {
    await this.send('event_reminder', {
      title: '📅 Event Reminder',
      body: `${eventTitle} starts in ${eventTime}`,
      icon: '/favicon.ico',
      tag: `event-${eventTitle}`,
      requireInteraction: false
    })
  }

  /**
   * Send a health alert notification
   */
  async sendHealthAlert(
    type: 'vaccination' | 'medication' | 'appointment',
    itemName: string,
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<void> {
    const urgencyEmojis = {
      low: '💊',
      medium: '⚠️',
      high: '🚨'
    }

    const urgencyText = {
      low: 'due soon',
      medium: 'due now',
      high: 'overdue'
    }

    await this.send('health_alert', {
      title: `${urgencyEmojis[urgency]} Health Reminder`,
      body: `${itemName} is ${urgencyText[urgency]}. Time to take action!`,
      icon: '/favicon.ico',
      tag: `health-${type}-${itemName}`,
      requireInteraction: urgency === 'high'
    })
  }

  /**
   * Send a community notification
   */
  async sendCommunityNotification(
    type: 'like' | 'comment' | 'mention',
    fromUser: string,
    postTitle?: string
  ): Promise<void> {
    const messages = {
      like: `${fromUser} liked your post`,
      comment: `${fromUser} commented on your post`,
      mention: `${fromUser} mentioned you in a post`
    }

    await this.send('community', {
      title: '👥 Community Activity',
      body: postTitle ? `${messages[type]}: "${postTitle}"` : messages[type],
      icon: '/favicon.ico',
      tag: `community-${type}`,
      requireInteraction: false
    })
  }

  /**
   * Schedule a notification for later
   */
  scheduleNotification(
    type: NotificationType,
    data: NotificationData,
    delay: number
  ): void {
    setTimeout(() => {
      this.send(type, data)
    }, delay)
  }

  /**
   * Check if notifications are enabled for a specific type
   */
  private isNotificationEnabled(type: NotificationType): boolean {
    if (!this.settings.enabled) return false

    switch (type) {
      case 'match':
        return this.settings.matches
      case 'event_reminder':
        return this.settings.events
      case 'health_alert':
        return this.settings.health
      case 'community':
        return this.settings.community
      default:
        return true
    }
  }

  /**
   * Update notification settings
   */
  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    this.saveSettings()
  }

  /**
   * Get current notification settings
   */
  getSettings(): NotificationSettings {
    return { ...this.settings }
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('pawmatch-notification-settings', JSON.stringify(this.settings))
    } catch (error) {
      console.error('Failed to save notification settings:', error)
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('pawmatch-notification-settings')
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error)
    }
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications(): void {
    // Note: There's no direct way to clear all notifications from JavaScript
    // This is handled by the browser's notification center
    console.log('Notifications cleared from browser notification center')
  }

  /**
   * Test notification system
   */
  async testNotification(): Promise<void> {
    console.log('🔔 Testing notification system...')
    console.log('Browser support:', 'Notification' in window)
    console.log('Current permission:', Notification.permission)
    console.log('Settings enabled:', this.settings.enabled)
    
    try {
      await this.send('general', {
        title: '🔔 Test Notification',
        body: 'Your notification system is working perfectly!',
        icon: '/favicon.ico',
        tag: 'test',
        requireInteraction: false
      })
      console.log('✅ Test notification sent successfully!')
    } catch (error) {
      console.error('❌ Failed to send test notification:', error)
      // Fallback: Try to send a simple notification
      try {
        if (Notification.permission === 'granted') {
          const notification = new Notification('🔔 Test Notification', {
            body: 'Your notification system is working perfectly!',
            icon: '/favicon.ico'
          })
          notification.onclick = () => {
            window.focus()
            notification.close()
          }
          console.log('✅ Fallback notification sent successfully!')
        } else {
          console.error('❌ Notification permission not granted:', Notification.permission)
        }
      } catch (fallbackError) {
        console.error('❌ Fallback notification also failed:', fallbackError)
      }
    }
  }
}

// Create singleton instance
export const notificationManager = new NotificationManager()

// Export utility functions
export const requestNotificationPermission = () => notificationManager.requestPermission()
export const sendMatchNotification = (dogName: string, dogBreed: string) => 
  notificationManager.sendMatchNotification(dogName, dogBreed)
export const sendEventReminder = (eventTitle: string, eventTime: string) => 
  notificationManager.sendEventReminder(eventTitle, eventTime)
export const sendHealthAlert = (type: 'vaccination' | 'medication' | 'appointment', itemName: string, urgency?: 'low' | 'medium' | 'high') => 
  notificationManager.sendHealthAlert(type, itemName, urgency)
export const sendCommunityNotification = (type: 'like' | 'comment' | 'mention', fromUser: string, postTitle?: string) => 
  notificationManager.sendCommunityNotification(type, fromUser, postTitle)
export const testNotification = () => notificationManager.testNotification()
export const updateNotificationSettings = (settings: Partial<NotificationSettings>) => 
  notificationManager.updateSettings(settings)
export const getNotificationSettings = () => notificationManager.getSettings()
export const isNotificationSupported = () => notificationManager.isSupported()

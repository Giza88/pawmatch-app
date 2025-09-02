import { useState, useEffect } from 'react'

export interface OnboardingData {
  fullName: string
  email: string
  phone: string
  dogName: string
  breed: string
  age: number
  size: 'Small' | 'Medium' | 'Large' | 'Extra Large'
  dogPhoto?: string
  isCompleted: boolean
  completedAt?: string
  preferences: {
    notifications: boolean
    locationSharing: boolean
    profileVisibility: 'public' | 'friends' | 'private'
  }
}

const STORAGE_KEY = 'pawfect-match-onboarding'

export const useOnboarding = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    fullName: '',
    email: '',
    phone: '',
    dogName: '',
    breed: '',
    age: 1,
    size: 'Medium',
    isCompleted: false,
    preferences: {
      notifications: true,
      locationSharing: true,
      profileVisibility: 'public'
    }
  })

  const [isLoading, setIsLoading] = useState(true)

  // Load onboarding data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setOnboardingData(parsed)
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error)
      // If there's an error, start with default data
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save onboarding data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingData))
      } catch (error) {
        console.error('Error saving onboarding data:', error)
      }
    }
  }, [onboardingData, isLoading])

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({
      ...prev,
      ...updates
    }))
  }

  const completeOnboarding = () => {
    setOnboardingData(prev => ({
      ...prev,
      isCompleted: true,
      completedAt: new Date().toISOString()
    }))
  }

  const resetOnboarding = () => {
    const defaultData: OnboardingData = {
      fullName: '',
      email: '',
      phone: '',
      dogName: '',
      breed: '',
      age: 1,
      size: 'Medium',
      isCompleted: false,
      preferences: {
        notifications: true,
        locationSharing: true,
        profileVisibility: 'public'
      }
    }
    setOnboardingData(defaultData)
    localStorage.removeItem(STORAGE_KEY)
  }

  const updatePreferences = (preferences: Partial<OnboardingData['preferences']>) => {
    setOnboardingData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...preferences
      }
    }))
  }

  return {
    onboardingData,
    updateOnboardingData,
    completeOnboarding,
    resetOnboarding,
    updatePreferences,
    isLoading
  }
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/localStorage'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  memberSince: string
  avatar: string
  dogPhoto: string
  dogName: string
  dogBreed: string
  dogBio: string
  preferences: {
    notifications: boolean
    locationSharing: boolean
    profileVisibility: 'public' | 'friends' | 'private'
  }
}

interface ProfileContextType {
  profile: UserProfile
  isLoading: boolean
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  updateAvatar: (avatarUrl: string) => Promise<void>
  updateDogPhoto: (photoUrl: string) => Promise<void>
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<void>
  signOut: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

interface ProfileProviderProps {
  children: ReactNode
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    // SIMPLE LOGIC: Always check onboarding data first
    const onboardingResult = safeGetItem<any>('pawfect-match-onboarding')
    
    if (onboardingResult.success && onboardingResult.data) {
      try {
        const parsed = onboardingResult.data
        
        if (parsed.isCompleted && parsed.fullName) {
          // Clear ALL old data for new user
          safeRemoveItem('dogConnections')
          safeRemoveItem('dogSkipped')
          safeRemoveItem('dogPreferences')
          
          // Create profile from onboarding data
          const newProfile: UserProfile = {
            id: 'user-1',
            name: parsed.fullName,
            email: parsed.email || '',
            phone: parsed.phone || '',
            location: parsed.location || 'Your Location',
            memberSince: parsed.completedAt 
              ? new Date(parsed.completedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            avatar: parsed.profilePhoto || parsed.dogPhoto || '',
            dogPhoto: '',
            dogName: parsed.dogName || '',
            dogBreed: parsed.breed || '',
            dogBio: parsed.dogName ? `Meet ${parsed.dogName}, a ${parsed.age || 'young'}-year-old ${parsed.breed || 'lovable dog'}!` : '',
            preferences: {
              notifications: true,
              locationSharing: true,
              profileVisibility: 'public'
            }
          }
          
          // Save the new profile
          const saveResult = safeSetItem('userProfile', newProfile)
          if (!saveResult.success) {
            console.error('Failed to save profile:', saveResult.error)
          }
          return newProfile
        }
      } catch (error) {
        console.error('Error parsing onboarding data:', error)
      }
    }
    
    // Try to load existing profile
    const savedProfileResult = safeGetItem<UserProfile>('userProfile')
    if (savedProfileResult.success && savedProfileResult.data) {
      return savedProfileResult.data
    }
    
    // Default empty profile
    return {
      id: 'user-1',
      name: '',
      email: '',
      phone: '',
      location: '',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      avatar: '',
      dogPhoto: '',
      dogName: '',
      dogBreed: '',
      dogBio: '',
      preferences: {
        notifications: true,
        locationSharing: true,
        profileVisibility: 'public'
      }
    }
  })
  
  const [isLoading, setIsLoading] = useState(true)

  // Set loading to false after initialization
  useEffect(() => {
    setIsLoading(false)
  }, [])

  // Monitor profile changes
  useEffect(() => {
    // Profile state updated
  }, [profile])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)
      
      const saveResult = safeSetItem('userProfile', updatedProfile)
      if (!saveResult.success) {
        console.error('Failed to save profile updates:', saveResult.error)
        throw new Error(saveResult.error)
      }
      
    } catch (error) {
      console.error('❌ Error updating profile:', error)
      throw error
    }
  }

  const updateAvatar = async (avatarUrl: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedProfile = { ...profile, avatar: avatarUrl }
      setProfile(updatedProfile)
      
      const saveResult = safeSetItem('userProfile', updatedProfile)
      if (!saveResult.success) {
        console.error('Failed to save avatar:', saveResult.error)
        throw new Error(saveResult.error)
      }
      
    } catch (error) {
      console.error('❌ Error updating avatar:', error)
      throw error
    }
  }

  const updateDogPhoto = async (photoUrl: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedProfile = { ...profile, dogPhoto: photoUrl }
      setProfile(updatedProfile)
      
      const saveResult = safeSetItem('userProfile', updatedProfile)
      if (!saveResult.success) {
        console.error('Failed to save dog photo:', saveResult.error)
        throw new Error(saveResult.error)
      }
      
    } catch (error) {
      console.error('❌ Error updating dog photo:', error)
      throw error
    }
  }

  const updatePreferences = async (preferences: Partial<UserProfile['preferences']>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedProfile = {
        ...profile,
        preferences: { ...profile.preferences, ...preferences }
      }
      setProfile(updatedProfile)
      
      const saveResult = safeSetItem('userProfile', updatedProfile)
      if (!saveResult.success) {
        console.error('Failed to save preferences:', saveResult.error)
        throw new Error(saveResult.error)
      }
      
    } catch (error) {
      console.error('❌ Error updating preferences:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      
      // Reset to default profile
      setProfile({
        id: 'user-1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        memberSince: 'March 2023',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        dogPhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
        dogName: 'Buddy',
        dogBreed: 'Golden Retriever',
        dogBio: 'Always ready for adventures! 🐾',
        preferences: {
          notifications: true,
          locationSharing: true,
          profileVisibility: 'public'
        }
      })
    } catch (error) {
      console.error('❌ Error signing out:', error)
      throw error
    }
  }

  const value: ProfileContextType = {
    profile,
    isLoading,
    updateProfile,
    updateAvatar,
    updateDogPhoto,
    updatePreferences,
    signOut
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}
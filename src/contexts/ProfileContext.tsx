import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
    console.log('🔍 ProfileContext - Starting profile initialization...')
    
    const onboardingData = localStorage.getItem('pawfect-match-onboarding')
    console.log('📦 Raw onboarding data:', onboardingData)
    
    if (onboardingData) {
      try {
        const parsed = JSON.parse(onboardingData)
        console.log('📋 Parsed onboarding data:', parsed)
        
        if (parsed.isCompleted && parsed.fullName) {
          console.log('✅ NEW USER FOUND - Creating profile for:', parsed.fullName)
          
          // Clear ALL old data for new user
          console.log('🧹 Clearing old data for new user...')
          localStorage.removeItem('dogConnections')
          localStorage.removeItem('dogSkipped')
          localStorage.removeItem('dogPreferences')
          
          // Create profile from onboarding data
          // Fix: Use dogPhoto as avatar since that's what the user uploaded during onboarding
          const newProfile: UserProfile = {
            id: 'user-1',
            name: parsed.fullName,
            email: parsed.email || '',
            phone: parsed.phone || '',
            location: parsed.location || 'Your Location',
            memberSince: parsed.completedAt 
              ? new Date(parsed.completedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            avatar: parsed.profilePhoto || parsed.dogPhoto || '', // Use dogPhoto as fallback for avatar
            dogPhoto: '', // Clear dog photo since user uploaded their own photo
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
          localStorage.setItem('userProfile', JSON.stringify(newProfile))
          console.log('💾 Profile saved for new user:', newProfile)
          return newProfile
        }
      } catch (error) {
        console.error('❌ Error parsing onboarding data:', error)
      }
    }
    
    // Try to load existing profile
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        console.log('📁 Loaded existing profile:', parsed)
        return parsed
      } catch (error) {
        console.error('❌ Error loading saved profile:', error)
      }
    }
    
    // Default empty profile
    console.log('🆕 Using default empty profile')
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
    console.log('🏁 ProfileContext - Initialization complete, setting loading to false')
    setIsLoading(false)
  }, [])

  // Monitor profile changes
  useEffect(() => {
    console.log('👤 Profile state updated:', profile)
  }, [profile])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
      
      console.log('✅ Profile updated:', updates)
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
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
      
      console.log('✅ Avatar updated:', avatarUrl)
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
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
      
      console.log('✅ Dog photo updated:', photoUrl)
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
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
      
      console.log('✅ Preferences updated:', preferences)
    } catch (error) {
      console.error('❌ Error updating preferences:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('👋 User signed out')
      
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
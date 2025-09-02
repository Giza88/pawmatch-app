import React, { createContext, useContext, useState, ReactNode } from 'react'

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
  const [profile, setProfile] = useState<UserProfile>({
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

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProfile(prev => ({
        ...prev,
        ...updates
      }))
      
      // In a real app, you'd save to backend here
      console.log('Profile updated:', updates)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const updateAvatar = async (avatarUrl: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProfile(prev => ({
        ...prev,
        avatar: avatarUrl
      }))
      
      console.log('Avatar updated:', avatarUrl)
    } catch (error) {
      console.error('Error updating avatar:', error)
      throw error
    }
  }

  const updateDogPhoto = async (photoUrl: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProfile(prev => ({
        ...prev,
        dogPhoto: photoUrl
      }))
      
      console.log('Dog photo updated:', photoUrl)
    } catch (error) {
      console.error('Error updating dog photo:', error)
      throw error
    }
  }

  const updatePreferences = async (preferences: Partial<UserProfile['preferences']>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProfile(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ...preferences
        }
      }))
      
      console.log('Preferences updated:', preferences)
    } catch (error) {
      console.error('Error updating preferences:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In a real app, you'd clear tokens, redirect, etc.
      console.log('User signed out')
      
      // For demo purposes, just reset to default profile
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
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value: ProfileContextType = {
    profile,
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

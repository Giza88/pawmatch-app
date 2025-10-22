import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Camera, Edit3, Settings, Heart, MapPin, Calendar, Phone, Mail, Shield, LogOut, X } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { useProfile } from '../contexts/ProfileContext'
import { useOnboarding } from '../hooks/useOnboarding'
import Logo from '../components/Logo'
import { getNotificationSettings, updateNotificationSettings, requestNotificationPermission, testNotification } from '../utils/notifications'
import ProfilePhotoUpload from '../components/ProfilePhotoUpload'
import DogPhotoUpload from '../components/DogPhotoUpload'

const ProfilePage: React.FC = () => {
  const { profile, isLoading, updateProfile, updateAvatar, updateDogPhoto, updatePreferences, signOut } = useProfile()
  const { onboardingData, resetOnboarding } = useOnboarding()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPhotos, setIsChangingPhotos] = useState(false)
  const [isChangingPreferences, setIsChangingPreferences] = useState(false)
  const [isChangingPrivacy, setIsChangingPrivacy] = useState(false)
  
  // Confirmation dialog state
  const [notificationSettings, setNotificationSettings] = useState(getNotificationSettings())
  const [showResetOnboarding, setShowResetOnboarding] = useState(false)
  const profilePhotoInputRef = React.useRef<HTMLInputElement>(null)
  const dogPhotoInputRef = React.useRef<HTMLInputElement>(null)
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    dogName: profile.dogName,
    dogBreed: profile.dogBreed,
    dogBio: profile.dogBio
  })

  // Update form when profile changes
  React.useEffect(() => {
    setEditForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      dogName: profile.dogName,
      dogBreed: profile.dogBreed,
      dogBio: profile.dogBio
    })
  }, [profile])

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Profile loaded
  React.useEffect(() => {
    // Profile state updated
  }, [profile])

  // Get real stats from localStorage or default to 0 for new profiles
  const getRealStats = () => {
    try {
      const connections = localStorage.getItem('dogConnections')
      const events = localStorage.getItem('events')
      
      const matchesCount = connections ? JSON.parse(connections).length : 0
      const eventsCount = events ? JSON.parse(events).length : 0
      
      return {
        matches: matchesCount,
        events: eventsCount,
        checkIns: 0 // We don't have check-ins implemented yet, so always 0
      }
    } catch (error) {
      console.error('Error getting stats:', error)
      return { matches: 0, events: 0, checkIns: 0 }
    }
  }

  const realStats = getRealStats()
  
  const stats = [
    { label: 'Matches', value: realStats.matches.toString(), icon: Heart, color: 'text-orange-500' },
    { label: 'Events', value: realStats.events.toString(), icon: Calendar, color: 'text-teal-500' },
    { label: 'Check-ins', value: realStats.checkIns.toString(), icon: MapPin, color: 'text-nature-500' }
  ]

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await updateProfile({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        location: editForm.location,
        dogName: editForm.dogName,
        dogBreed: editForm.dogBreed,
        dogBio: editForm.dogBio
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = async (type: 'avatar' | 'dogPhoto', file: File) => {
    try {
      // Convert file to Base64 string for persistence
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        
        if (type === 'avatar') {
          await updateAvatar(base64String)
        } else {
          await updateDogPhoto(base64String)
        }
        setIsChangingPhotos(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error updating photo:', error)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'dogPhoto') => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB')
        return
      }
      
      handlePhotoChange(type, file)
    }
  }

  const handlePhotoClick = (type: 'avatar' | 'dogPhoto') => {
    if (type === 'avatar') {
      profilePhotoInputRef.current?.click()
    } else {
      dogPhotoInputRef.current?.click()
    }
  }

  const handlePreferenceChange = async (key: keyof typeof profile.preferences, value: any) => {
    try {
      await updatePreferences({ [key]: value })
    } catch (error) {
      console.error('Error updating preferences:', error)
    }
  }

  const handleNotificationPermissionRequest = async () => {
    try {
      const permission = await requestNotificationPermission()
      if (permission === 'granted') {
        setNotificationSettings(prev => ({ ...prev, enabled: true }))
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }



  const handleNotificationSettingChange = (key: keyof typeof notificationSettings, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value }
    setNotificationSettings(newSettings)
    updateNotificationSettings(newSettings)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      // In a real app, you'd redirect to login
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }


  const menuItems = [
    { icon: User, label: 'Edit Profile', action: () => setIsEditing(true) },
    { icon: Camera, label: 'Change Photos', action: () => setIsChangingPhotos(true) },
    { icon: Settings, label: 'Preferences', action: () => setIsChangingPreferences(true) },
    { icon: Shield, label: 'Privacy', action: () => setIsChangingPrivacy(true) },
    { icon: LogOut, label: 'Sign Out', action: handleSignOut }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50 pb-32">
      {/* Hero Section with Dog Using Phone */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-orange-500 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/70 to-orange-600/60" />
        
        {/* Background Image - Dog Using Phone */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${profile.dogPhoto})` }}
        />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-script font-bold text-white mb-4">
            Your Profile
          </h1>
          <p className="text-xl text-white/90 font-body max-w-2xl mx-auto">
            Manage your account and connect with your furry friends
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Logo size="md" showText={false} />
            <h2 className="text-2xl font-display font-bold text-earth-900 ml-3">Profile</h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-earth-600">Loading profile...</p>
          </div>
        )}
        
        {!isLoading && (
          <>
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-earth-200 p-6"
        >
          {/* Profile Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-teal-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-teal-600" />
                </div>
              )}
              <button 
                onClick={() => setIsChangingPhotos(true)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-2xl font-display font-bold text-earth-900 mb-2">{profile.name}</h3>
            <p className="text-earth-600 font-body">Member since {profile.memberSince}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center mx-auto mb-2 border border-earth-200`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-display font-bold text-earth-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-earth-600 font-body">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-teal-50/50 rounded-xl border border-teal-200/50">
              <Mail className="w-5 h-5 text-teal-600" />
              <span className="text-earth-700 font-body">{profile.email}</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl border border-orange-200/50">
              <Phone className="w-5 h-5 text-orange-600" />
              <span className="text-earth-700 font-body">{profile.phone}</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-nature-50/50 rounded-xl border border-nature-200/50">
              <MapPin className="w-5 h-5 text-nature-600" />
              <span className="text-earth-700 font-body">{profile.location}</span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary-teal btn-full btn-icon-left"
          >
            <Edit3 className="w-5 h-5" />
            Edit Profile
          </button>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-earth-200 overflow-hidden"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-4 hover:bg-earth-50 transition-all duration-300 border-b border-earth-100 last:border-b-0"
              >
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <span className="text-earth-700 font-body font-medium">{item.label}</span>
                <div className="ml-auto">
                  <Edit3 className="w-4 h-4 text-earth-400" />
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Dog Photo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-earth-200 p-6 text-center"
        >
          <h3 className="text-xl font-display font-bold text-earth-900 mb-4">Your Furry Friend</h3>
          <div className="relative">
            {profile.dogPhoto ? (
              <img
                src={profile.dogPhoto}
                alt="Dog using phone"
                className="w-full h-48 object-cover rounded-xl border border-earth-200"
              />
            ) : (
              <div className="w-full h-48 bg-teal-100 rounded-xl border border-earth-200 flex items-center justify-center">
                <div className="text-center">
                  <User className="w-16 h-16 text-teal-600 mx-auto mb-2" />
                  <p className="text-teal-600 font-medium">No photo yet</p>
                  <p className="text-teal-500 text-sm">Add your dog's photo</p>
                </div>
              </div>
            )}
            {profile.dogPhoto && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 via-transparent to-transparent rounded-xl" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-body font-medium">{profile.dogName} the {profile.dogBreed}</p>
                  <p className="text-sm opacity-90">{profile.dogBio}</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
          </>
        )}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-earth-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-display font-bold text-earth-900 mb-4">Edit Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2 font-body">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2 font-body">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2 font-body">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2 font-body">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2 font-body">Dog Name</label>
                  <input
                    type="text"
                    name="dogName"
                    value={editForm.dogName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2 font-body">Dog Breed</label>
                  <input
                    type="text"
                    name="dogBreed"
                    value={editForm.dogBreed}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2 font-body">Dog Bio</label>
                  <textarea
                    name="dogBio"
                    value={editForm.dogBio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body resize-none"
                    placeholder="Tell us about your dog..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={isSubmitting}
                  className="btn-primary-teal flex-1"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Photos Modal */}
      <AnimatePresence>
        {isChangingPhotos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsChangingPhotos(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-earth-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-earth-900">Change Photos</h2>
                <button
                  onClick={() => setIsChangingPhotos(false)}
                  className="btn-icon-sm"
                  aria-label="Close photos modal"
                >
                  <X className="w-5 h-5 text-earth-600" />
                </button>
              </div>
              
              <div className="space-y-8">
                {/* Profile Photo */}
                <div>
                  <h3 className="text-lg font-medium text-earth-900 mb-4">Profile Photo</h3>
                  <ProfilePhotoUpload
                    currentPhoto={profile.avatar}
                    onPhotoSelect={async (file) => {
                      if (file) {
                        try {
                          // Convert to base64 for storage
                          const reader = new FileReader()
                          reader.onload = async () => {
                            const base64String = reader.result as string
                            await updateAvatar(base64String)
                          }
                          reader.readAsDataURL(file)
                        } catch (error) {
                          console.error('Error updating profile photo:', error)
                        }
                      }
                    }}
                    size="lg"
                    className="flex justify-center"
                  />
                </div>

                {/* Dog Photos */}
                <div>
                  <h3 className="text-lg font-medium text-earth-900 mb-4">Dog Photos</h3>
                  <DogPhotoUpload
                    existingPhotos={profile.dogPhoto ? [profile.dogPhoto] : []}
                    onPhotosSelect={async (files) => {
                      if (files.length > 0) {
                        try {
                          // For now, use the first photo as the main dog photo
                          const file = files[0]
                          const reader = new FileReader()
                          reader.onload = async () => {
                            const base64String = reader.result as string
                            await updateDogPhoto(base64String)
                          }
                          reader.readAsDataURL(file)
                        } catch (error) {
                          console.error('Error updating dog photos:', error)
                        }
                      }
                    }}
                    maxPhotos={6}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {isChangingPreferences && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsChangingPreferences(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-earth-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-earth-900">Preferences</h2>
                <button
                  onClick={() => setIsChangingPreferences(false)}
                  className="p-2 hover:bg-earth-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-earth-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Notification Permission */}
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-earth-900">🔔 Browser Notifications</h3>
                      <p className="text-sm text-earth-600">Enable notifications for matches and updates</p>
                      <p className="text-xs text-earth-500 mt-1">
                        Status: {Notification.permission} | Settings: {notificationSettings.enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <button
                      onClick={handleNotificationPermissionRequest}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        notificationSettings.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                      }`}
                    >
                      {notificationSettings.enabled ? 'Enabled' : 'Enable'}
                    </button>
                  </div>
                </div>

                {/* Notification Types */}
                {notificationSettings.enabled && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-earth-900">Notification Types</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-earth-900">New Matches</h3>
                        <p className="text-sm text-earth-600">Get notified when you match with someone</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.matches}
                          onChange={(e) => handleNotificationSettingChange('matches', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-earth-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-earth-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-earth-900">Event Reminders</h3>
                        <p className="text-sm text-earth-600">Reminders for upcoming events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.events}
                          onChange={(e) => handleNotificationSettingChange('events', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-earth-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-earth-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-earth-900">Health Alerts</h3>
                        <p className="text-sm text-earth-600">Vaccination and medication reminders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.health}
                          onChange={(e) => handleNotificationSettingChange('health', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-earth-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-earth-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-earth-900">Community Activity</h3>
                        <p className="text-sm text-earth-600">Likes, comments, and mentions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.community}
                          onChange={(e) => handleNotificationSettingChange('community', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-earth-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-earth-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-earth-900">Sound Effects</h3>
                        <p className="text-sm text-earth-600">Play sounds with notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.sound}
                          onChange={(e) => handleNotificationSettingChange('sound', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-earth-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-earth-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>

                    {/* Test Notification Button */}
                    <div className="pt-4 border-t border-earth-200">
                      <button
                        onClick={async () => {
                          try {
                            await testNotification()
                          } catch (error) {
                            console.error('❌ Test notification function failed:', error)
                          }
                        }}
                        className="w-full bg-teal-100 hover:bg-teal-200 text-teal-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      >
                        🔔 Test Notification
                      </button>
                    </div>
                  </div>
                )}

                {/* Other Preferences */}
                <div className="pt-4 border-t border-earth-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-earth-900">Location Sharing</h3>
                      <p className="text-sm text-earth-600">Share your location for nearby matches</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.preferences.locationSharing}
                        onChange={(e) => handlePreferenceChange('locationSharing', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-earth-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-earth-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Modal */}
      <AnimatePresence>
        {isChangingPrivacy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsChangingPrivacy(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-earth-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-earth-900">Privacy Settings</h2>
                <button
                  onClick={() => setIsChangingPrivacy(false)}
                  className="p-2 hover:bg-earth-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-earth-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">Profile Visibility</label>
                  <select
                    value={profile.preferences.profileVisibility}
                    onChange={(e) => handlePreferenceChange('profileVisibility', e.target.value)}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
                  >
                    <option value="public">Public - Anyone can see your profile</option>
                    <option value="friends">Friends Only - Only matched users can see</option>
                    <option value="private">Private - Only you can see</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-earth-200">
                  <h3 className="font-medium text-earth-900 mb-2">Data & Privacy</h3>
                  <p className="text-sm text-earth-600 mb-4">
                    We respect your privacy and never share your personal information with third parties.
                  </p>
                  <button 
                    onClick={() => {
                      // In a real app, this would generate and download user data
                      const userData = {
                        profile: profile,
                        timestamp: new Date().toISOString()
                      }
                      const dataStr = JSON.stringify(userData, null, 2)
                      const dataBlob = new Blob([dataStr], {type: 'application/json'})
                      const url = URL.createObjectURL(dataBlob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = 'pawmatch-user-data.json'
                      link.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Download My Data
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Onboarding Modal */}
      <AnimatePresence>
        {showResetOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowResetOnboarding(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-earth-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-earth-900">Reset Onboarding</h2>
                <button
                  onClick={() => setShowResetOnboarding(false)}
                  className="p-2 hover:bg-earth-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-earth-600" />
                </button>
              </div>
              
              <p className="text-earth-700 font-body mb-4">
                Are you sure you want to reset your onboarding data? This will remove all the information you entered during the onboarding process.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowResetOnboarding(false)}
                  className="flex-1 bg-earth-200 hover:bg-earth-300 text-earth-800 py-3 px-6 rounded-xl font-body font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={resetOnboarding}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-body font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Reset Onboarding
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default ProfilePage

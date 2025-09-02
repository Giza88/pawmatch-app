import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Camera, Edit3, Settings, Heart, MapPin, Calendar, Phone, Mail, Shield, LogOut } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  
  // Mock user data
  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    memberSince: 'March 2023',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    dogPhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop'
  }

  const stats = [
    { label: 'Matches', value: '24', icon: Heart, color: 'text-orange-500' },
    { label: 'Events', value: '12', icon: Calendar, color: 'text-teal-500' },
    { label: 'Check-ins', value: '156', icon: MapPin, color: 'text-nature-500' }
  ]

  const menuItems = [
    { icon: User, label: 'Edit Profile', action: () => setIsEditing(true) },
    { icon: Camera, label: 'Change Photos', action: () => console.log('Change photos') },
    { icon: Settings, label: 'Preferences', action: () => console.log('Preferences') },
    { icon: Shield, label: 'Privacy', action: () => console.log('Privacy') },
    { icon: LogOut, label: 'Sign Out', action: () => console.log('Sign out') }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50">
      {/* Hero Section with Dog Using Phone */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-orange-500 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/70 to-orange-600/60" />
        
        {/* Background Image - Dog Using Phone */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${user.dogPhoto})` }}
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
          <h2 className="text-2xl font-display font-bold text-earth-900">Profile</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-earth-200 p-6"
        >
          {/* Profile Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-2xl font-display font-bold text-earth-900 mb-2">{user.name}</h3>
            <p className="text-earth-600 font-body">Member since {user.memberSince}</p>
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
              <span className="text-earth-700 font-body">{user.email}</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl border border-orange-200/50">
              <Phone className="w-5 h-5 text-orange-600" />
              <span className="text-earth-700 font-body">{user.phone}</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-nature-50/50 rounded-xl border border-nature-200/50">
              <MapPin className="w-5 h-5 text-nature-600" />
              <span className="text-earth-700 font-body">{user.location}</span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-body font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
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
            <img
              src={user.dogPhoto}
              alt="Dog using phone"
              className="w-full h-48 object-cover rounded-xl border border-earth-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 via-transparent to-transparent rounded-xl" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-body font-medium">Buddy the Golden Retriever</p>
              <p className="text-sm opacity-90">Always ready for adventures! 🐾</p>
            </div>
          </div>
        </motion.div>
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
                    defaultValue={user.name}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2 font-body">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2 font-body">Phone</label>
                  <input
                    type="tel"
                    defaultValue={user.phone}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2 font-body">Location</label>
                  <input
                    type="text"
                    defaultValue={user.location}
                    className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gradient-to-r from-earth-500 to-earth-600 hover:from-earth-600 hover:to-earth-700 text-white py-3 px-6 rounded-xl font-body font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement profile update
                    setIsEditing(false)
                  }}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-body font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Save Changes
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

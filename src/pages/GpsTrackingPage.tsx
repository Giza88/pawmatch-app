import React, { useState } from 'react'
import { MapPin, Navigation, Shield, AlertTriangle, Settings, Play, Pause, Home, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { DogProfile } from '../components/DogProfileCard'
import { useGpsTracking } from '../contexts/GpsTrackingContext'
import SimpleMap from '../components/SimpleMap'

const GpsTrackingPage: React.FC = () => {
  const { 
    isTracking, 
    currentLocation, 
    safeZones, 
    startTracking, 
    stopTracking, 
    createSafeZone: createZone 
  } = useGpsTracking()
  
  const [selectedDog, setSelectedDog] = useState<DogProfile | null>(null)
  const [showLostDogAlert, setShowLostDogAlert] = useState(false)
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'hybrid'>('street')

  // Mock dog data for demonstration
  const mockDog: DogProfile = {
    id: 'mock-dog-1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 3,
    size: 'Large',
    energyLevel: 'High',
    friendliness: 'Very Friendly',
    distance: 0.5,
    photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'],
    bio: 'Friendly and energetic Golden Retriever',
    ownerNotes: 'Loves tennis balls and swimming!'
  }

  const toggleTracking = () => {
    if (isTracking) {
      stopTracking()
    } else {
      startTracking(mockDog.id)
    }
  }

  const createSafeZone = () => {
    if (!currentLocation) return
    
    createZone({
      name: `Safe Zone ${safeZones.length + 1}`,
      dogId: mockDog.id,
      center: {
        lat: currentLocation.latitude,
        lng: currentLocation.longitude
      },
      radius: 0.5, // 0.5 km radius
      color: '#10B981',
      isActive: true
    })
  }

  const triggerLostDogAlert = () => {
    setShowLostDogAlert(true)
    // In a real app, this would send notifications to nearby users
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-nature-500 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/70 to-nature-600/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-script font-bold text-white mb-4">
            GPS Tracking & Safety
          </h1>
          <p className="text-xl text-white/90 font-body max-w-2xl mx-auto">
            Real-time location tracking and safe zone monitoring for your furry friend
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-earth-900">GPS Tracking</h2>
              <p className="text-sm text-earth-600 font-body">Monitor your dog's location in real-time</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMapView('street')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  mapView === 'street' ? 'bg-teal-100 text-teal-600' : 'text-earth-500 hover:text-earth-700'
                }`}
              >
                <Navigation className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMapView('satellite')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  mapView === 'satellite' ? 'bg-teal-100 text-teal-600' : 'text-earth-500 hover:text-earth-700'
                }`}
              >
                <Shield className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Tracking Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tracking Controls</h2>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <span className="text-sm text-gray-600">
                {isTracking ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTracking}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-body font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                isTracking 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                  : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white'
              }`}
            >
              {isTracking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </button>
            
            <button
              onClick={createSafeZone}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-nature-500 to-nature-600 hover:from-nature-600 hover:to-nature-700 text-white rounded-xl font-body font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Shield className="w-5 h-5" />
              Create Safe Zone
            </button>
            
            <button
              onClick={triggerLostDogAlert}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-body font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <AlertTriangle className="w-5 h-5" />
              Lost Dog Alert
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 overflow-hidden">
          <SimpleMap
            currentLocation={currentLocation ? {
              lat: currentLocation.latitude,
              lng: currentLocation.longitude,
              name: mockDog.name,
              type: 'current'
            } : null}
            safeZones={safeZones}
            className="h-96"
          />
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Location Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Location Status</h3>
                <p className="text-sm text-gray-600">GPS Signal</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Update:</span>
                <span className="text-gray-900">
                  {currentLocation ? currentLocation.timestamp.toLocaleTimeString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Accuracy:</span>
                <span className="text-green-600">±5 meters</span>
              </div>
            </div>
          </motion.div>

          {/* Safe Zones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Safe Zones</h3>
                <p className="text-sm text-gray-600">Geofencing</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Zones:</span>
                <span className="text-gray-900">{safeZones.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600">All Clear</span>
              </div>
            </div>
          </motion.div>

          {/* Battery & Signal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Device Status</h3>
                <p className="text-sm text-gray-600">Collar Battery</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Battery:</span>
                <span className="text-gray-900">
                  {currentLocation ? `${currentLocation.battery}%` : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Signal:</span>
                <span className="text-gray-900">
                  {currentLocation ? `${currentLocation.signal}%` : 'Unknown'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Settings & History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border p-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Tracking Settings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Update Frequency</span>
                <select className="text-sm border rounded-lg px-3 py-1">
                  <option>Every 5 seconds</option>
                  <option>Every 10 seconds</option>
                  <option>Every 30 seconds</option>
                  <option>Every minute</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Geofence Alerts</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Battery Alerts</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border p-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Location History</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Today's Distance</span>
                <span className="font-medium">2.4 km</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Weekly Average</span>
                <span className="font-medium">3.1 km/day</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Farthest Point</span>
                <span className="font-medium">1.2 km</span>
              </div>
              <button className="w-full mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium">
                View Full History →
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lost Dog Alert Modal */}
      {showLostDogAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lost Dog Alert</h3>
              <p className="text-gray-600">
                This will notify nearby users and local shelters about your lost dog.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dog's Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter dog's name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Known Location
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter location description"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLostDogAlert(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowLostDogAlert(false)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Send Alert
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default GpsTrackingPage

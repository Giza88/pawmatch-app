import React from 'react'
import { MapPin, Navigation, Shield, AlertTriangle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { DogProfile } from './DogProfileCard'
import { useGpsTracking } from '../contexts/GpsTrackingContext'

interface GpsTrackingSuggestionProps {
  dog: DogProfile
  onViewTracking: () => void
}

const GpsTrackingSuggestion: React.FC<GpsTrackingSuggestionProps> = ({ dog, onViewTracking }) => {
  const { isTracking, currentLocation, safeZones } = useGpsTracking()

  const getTrackingStatus = () => {
    if (isTracking) {
      return {
        status: 'active',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: Navigation,
        message: `${dog.name} is being tracked`
      }
    }
    
    return {
      status: 'inactive',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: MapPin,
      message: `${dog.name} is not being tracked`
    }
  }

  const trackingStatus = getTrackingStatus()
  const Icon = trackingStatus.icon

  const getSafeZoneStatus = () => {
    const dogSafeZones = safeZones.filter(zone => zone.dogId === dog.id)
    const activeZones = dogSafeZones.filter(zone => zone.isActive)
    
    if (activeZones.length === 0) {
      return {
        message: 'No safe zones set',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      }
    }
    
    return {
      message: `${activeZones.length} safe zone${activeZones.length > 1 ? 's' : ''} active`,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  }

  const safeZoneStatus = getSafeZoneStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">GPS Tracking</h3>
        <button
          onClick={onViewTracking}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
        >
          View Map
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Tracking Status */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${trackingStatus.bgColor}`}>
            <Icon className={`w-4 h-4 ${trackingStatus.color}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{trackingStatus.message}</p>
            {currentLocation && (
              <p className="text-xs text-gray-600">
                Last seen: {currentLocation.timestamp.toLocaleTimeString()}
              </p>
            )}
          </div>
          {isTracking && (
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Safe Zones Status */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${safeZoneStatus.bgColor}`}>
            <Shield className={`w-4 h-4 ${safeZoneStatus.color}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{safeZoneStatus.message}</p>
            <p className="text-xs text-gray-600">Geofencing protection</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onViewTracking}
            className="flex items-center justify-center gap-2 p-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
          >
            <MapPin className="w-4 h-4" />
            View Location
          </button>
          
          <button
            onClick={onViewTracking}
            className="flex items-center justify-center gap-2 p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
          >
            <Shield className="w-4 h-4" />
            Safe Zones
          </button>
        </div>

        {/* Battery & Signal Info */}
        {currentLocation && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-blue-700">Device Status</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-blue-700">
                Battery: {currentLocation.battery}%
              </span>
              <span className="text-blue-700">
                Signal: {currentLocation.signal}%
              </span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onViewTracking}
        className="w-full mt-3 btn-primary py-2 text-sm"
      >
        {isTracking ? 'Manage Tracking' : 'Start GPS Tracking'}
      </button>
    </motion.div>
  )
}

export default GpsTrackingSuggestion

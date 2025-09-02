import React from 'react'
import { MapPin, Navigation, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

interface Location {
  lat: number
  lng: number
  name: string
  type: 'current' | 'safe-zone' | 'landmark'
}

interface SimpleMapProps {
  currentLocation: Location | null
  safeZones: Array<{
    id: string
    name: string
    center: { lat: number; lng: number }
    radius: number
    color: string
  }>
  className?: string
}

const SimpleMap: React.FC<SimpleMapProps> = ({ 
  currentLocation, 
  safeZones, 
  className = "h-96" 
}) => {
  return (
    <div className={`${className} bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 relative overflow-hidden rounded-xl`}>
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Navigation className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Shield className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Current Location Marker */}
      {currentLocation && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            {/* Pulse Ring */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.3, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 w-8 h-8 bg-blue-500 rounded-full"
            />
            
            {/* Center Dot */}
            <div className="relative z-10 w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            
            {/* Location Label */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg px-3 py-1 shadow-lg border">
              <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                {currentLocation.name}
              </p>
              <p className="text-xs text-gray-600 text-center">
                Current Location
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Safe Zones */}
      {safeZones.map((zone, index) => (
        <motion.div
          key={zone.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="absolute"
          style={{
            left: `${50 + (index - safeZones.length / 2) * 15}%`,
            top: `${50 + (index % 2 === 0 ? -10 : 10)}%`
          }}
        >
          <div className="relative">
            {/* Safe Zone Circle */}
            <div 
              className="w-16 h-16 rounded-full border-2 border-green-500 bg-green-200 opacity-60"
              style={{ borderColor: zone.color }}
            />
            
            {/* Safe Zone Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            
            {/* Zone Label */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg px-2 py-1 shadow-lg border text-center min-w-max">
              <p className="text-xs font-medium text-gray-900">{zone.name}</p>
              <p className="text-xs text-gray-600">{zone.radius}km radius</p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg border">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-700">Current Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-700">Safe Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-gray-700">Landmark</span>
          </div>
        </div>
      </div>

      {/* Coordinates Display */}
      {currentLocation && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 shadow-lg border">
          <div className="text-xs text-gray-700">
            <div>Lat: {currentLocation.lat.toFixed(6)}</div>
            <div>Lng: {currentLocation.lng.toFixed(6)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimpleMap

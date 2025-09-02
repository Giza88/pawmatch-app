import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface LocationData {
  id: string
  dogId: string
  latitude: number
  longitude: number
  timestamp: Date
  battery: number
  signal: number
  accuracy: number
}

export interface SafeZone {
  id: string
  name: string
  dogId: string
  center: { lat: number; lng: number }
  radius: number
  color: string
  isActive: boolean
  createdAt: Date
}

export interface TrackingSession {
  id: string
  dogId: string
  startTime: Date
  endTime?: Date
  totalDistance: number
  locations: LocationData[]
}

interface GpsTrackingContextType {
  // State
  isTracking: boolean
  currentLocation: LocationData | null
  safeZones: SafeZone[]
  trackingSessions: TrackingSession[]
  activeSession: TrackingSession | null
  
  // Actions
  startTracking: (dogId: string) => void
  stopTracking: () => void
  updateLocation: (location: Omit<LocationData, 'id' | 'timestamp'>) => void
  createSafeZone: (zone: Omit<SafeZone, 'id' | 'createdAt'>) => void
  deleteSafeZone: (zoneId: string) => void
  toggleSafeZone: (zoneId: string) => void
  getLocationHistory: (dogId: string, startDate: Date, endDate: Date) => LocationData[]
  getTrackingStats: (dogId: string) => {
    totalDistance: number
    averageSpeed: number
    totalTime: number
    safeZoneBreaches: number
  }
}

const GpsTrackingContext = createContext<GpsTrackingContextType | undefined>(undefined)

export const useGpsTracking = () => {
  const context = useContext(GpsTrackingContext)
  if (!context) {
    throw new Error('useGpsTracking must be used within a GpsTrackingProvider')
  }
  return context
}

interface GpsTrackingProviderProps {
  children: ReactNode
}

export const GpsTrackingProvider: React.FC<GpsTrackingProviderProps> = ({ children }) => {
  const [isTracking, setIsTracking] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [safeZones, setSafeZones] = useState<SafeZone[]>([])
  const [trackingSessions, setTrackingSessions] = useState<TrackingSession[]>([])
  const [activeSession, setActiveSession] = useState<TrackingSession | null>(null)

  // Mock GPS data for demonstration
  const mockLocationData: Omit<LocationData, 'id' | 'timestamp'> = {
    dogId: 'mock-dog-1',
    latitude: 40.7128,
    longitude: -74.0060,
    battery: 85,
    signal: 92,
    accuracy: 5
  }

  // Simulate GPS updates when tracking is active
  useEffect(() => {
    if (isTracking && activeSession) {
      const interval = setInterval(() => {
        const newLocation: LocationData = {
          id: Date.now().toString(),
          ...mockLocationData,
          timestamp: new Date(),
          latitude: mockLocationData.latitude + (Math.random() - 0.5) * 0.001,
          longitude: mockLocationData.longitude + (Math.random() - 0.5) * 0.001,
          battery: Math.max(0, mockLocationData.battery - Math.random() * 0.1),
          signal: Math.max(0, mockLocationData.signal - Math.random() * 0.2)
        }
        
        updateLocation(newLocation)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isTracking, activeSession])

  const startTracking = (dogId: string) => {
    const newSession: TrackingSession = {
      id: Date.now().toString(),
      dogId,
      startTime: new Date(),
      totalDistance: 0,
      locations: []
    }
    
    setActiveSession(newSession)
    setTrackingSessions(prev => [...prev, newSession])
    setIsTracking(true)
    
    // Set initial location
    const initialLocation: LocationData = {
      id: Date.now().toString(),
      dogId,
      timestamp: new Date(),
      ...mockLocationData
    }
    setCurrentLocation(initialLocation)
  }

  const stopTracking = () => {
    if (activeSession) {
      const updatedSession = {
        ...activeSession,
        endTime: new Date()
      }
      
      setTrackingSessions(prev => 
        prev.map(session => 
          session.id === activeSession.id ? updatedSession : session
        )
      )
      setActiveSession(null)
    }
    
    setIsTracking(false)
    setCurrentLocation(null)
  }

  const updateLocation = (location: Omit<LocationData, 'id' | 'timestamp'>) => {
    const newLocation: LocationData = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...location
    }
    
    setCurrentLocation(newLocation)
    
    // Update active session with new location
    if (activeSession) {
      const updatedSession = {
        ...activeSession,
        locations: [...activeSession.locations, newLocation]
      }
      setActiveSession(updatedSession)
      
      // Update tracking sessions
      setTrackingSessions(prev => 
        prev.map(session => 
          session.id === activeSession.id ? updatedSession : session
        )
      )
    }
    
    // Check safe zone breaches
    checkSafeZoneBreaches(newLocation)
  }

  const createSafeZone = (zone: Omit<SafeZone, 'id' | 'createdAt'>) => {
    const newZone: SafeZone = {
      ...zone,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    
    setSafeZones(prev => [...prev, newZone])
  }

  const deleteSafeZone = (zoneId: string) => {
    setSafeZones(prev => prev.filter(zone => zone.id !== zoneId))
  }

  const toggleSafeZone = (zoneId: string) => {
    setSafeZones(prev => 
      prev.map(zone => 
        zone.id === zoneId ? { ...zone, isActive: !zone.isActive } : zone
      )
    )
  }

  const checkSafeZoneBreaches = (location: LocationData) => {
    safeZones.forEach(zone => {
      if (!zone.isActive || zone.dogId !== location.dogId) return
      
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        zone.center.lat,
        zone.center.lng
      )
      
      if (distance > zone.radius) {
        // Safe zone breach detected
        console.log(`Safe zone breach detected for ${zone.name}`)
        // In a real app, this would trigger notifications
      }
    })
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const getLocationHistory = (dogId: string, startDate: Date, endDate: Date): LocationData[] => {
    return trackingSessions
      .filter(session => session.dogId === dogId)
      .flatMap(session => session.locations)
      .filter(location => 
        location.timestamp >= startDate && location.timestamp <= endDate
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  const getTrackingStats = (dogId: string) => {
    const dogSessions = trackingSessions.filter(session => session.dogId === dogId)
    const totalDistance = dogSessions.reduce((sum, session) => sum + session.totalDistance, 0)
    const totalTime = dogSessions.reduce((sum, session) => {
      if (session.endTime) {
        return sum + (session.endTime.getTime() - session.startTime.getTime())
      }
      return sum
    }, 0)
    
    return {
      totalDistance,
      averageSpeed: totalTime > 0 ? (totalDistance / (totalTime / 3600000)) : 0, // km/h
      totalTime,
      safeZoneBreaches: 0 // This would be tracked in a real app
    }
  }

  const value: GpsTrackingContextType = {
    isTracking,
    currentLocation,
    safeZones,
    trackingSessions,
    activeSession,
    startTracking,
    stopTracking,
    updateLocation,
    createSafeZone,
    deleteSafeZone,
    toggleSafeZone,
    getLocationHistory,
    getTrackingStats
  }

  return (
    <GpsTrackingContext.Provider value={value}>
      {children}
    </GpsTrackingContext.Provider>
  )
}

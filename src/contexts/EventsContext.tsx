import React, { createContext, useContext, useState, ReactNode } from 'react'
import { DogEvent } from '../pages/EventsPage'

interface EventsContextType {
  events: DogEvent[]
  createEvent: (event: any) => Promise<void>
  joinEvent: (eventId: string) => void
  leaveEvent: (eventId: string) => void
  getEventsNearby: (location: string, radius?: number) => DogEvent[]
  getEventsForDog: (dogSize: string, energyLevel: string) => DogEvent[]
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export const useEvents = () => {
  const context = useContext(EventsContext)
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider')
  }
  return context
}

interface EventsProviderProps {
  children: ReactNode
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<DogEvent[]>([
    {
      id: '1',
      title: 'Golden Retriever Playdate',
      description: 'Join us for a fun afternoon of fetch and swimming! Perfect for energetic dogs who love water.',
      date: '2024-01-15',
      time: '14:00',
      location: 'Central Park Dog Run',
      maxDogs: 8,
      currentDogs: 5,
      organizer: 'Sarah Johnson',
      organizerPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      eventType: 'Playdate',
      dogSize: 'All Sizes',
      energyLevel: 'High',
      isPublic: true
    },
    {
      id: '2',
      title: 'Evening Walk Group',
      description: 'Daily evening walks for all breeds. Great socialization and exercise opportunity.',
      date: '2024-01-14',
      time: '18:00',
      location: 'Riverside Trail',
      maxDogs: 12,
      currentDogs: 8,
      organizer: 'Mike Chen',
      organizerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      eventType: 'Walk',
      dogSize: 'All Sizes',
      energyLevel: 'Medium',
      isPublic: true
    },
    {
      id: '3',
      title: 'Puppy Socialization Class',
      description: 'Special event for puppies under 6 months. Learn basic commands and socialize safely.',
      date: '2024-01-16',
      time: '10:00',
      location: 'Pawsome Training Center',
      maxDogs: 6,
      currentDogs: 4,
      organizer: 'Lisa Rodriguez',
      organizerPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      eventType: 'Training',
      dogSize: 'Small',
      energyLevel: 'Low',
      isPublic: true
    },
    {
      id: '4',
      title: 'Large Breed Meetup',
      description: 'Social event specifically for large dogs. Great for breeds that need more space to play.',
      date: '2024-01-17',
      time: '16:00',
      location: 'Dogwood Park',
      maxDogs: 10,
      currentDogs: 6,
      organizer: 'David Wilson',
      organizerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      eventType: 'Social',
      dogSize: 'Large',
      energyLevel: 'High',
      isPublic: true
    }
  ])

  const createEvent = async (eventData: any) => {
    const newEvent: DogEvent = {
      id: eventData.id,
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      time: new Date(eventData.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      location: eventData.location,
      maxDogs: eventData.maxAttendees,
      currentDogs: 0,
      organizer: eventData.organizer.name,
      organizerPhoto: eventData.organizer.avatar,
      eventType: eventData.eventType.charAt(0).toUpperCase() + eventData.eventType.slice(1) as any,
      dogSize: 'All Sizes',
      energyLevel: 'All Levels',
      isPublic: !eventData.isPrivate
    }
    setEvents(prev => [newEvent, ...prev])
  }

  const joinEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, currentDogs: Math.min(event.currentDogs + 1, event.maxDogs) }
        : event
    ))
  }

  const leaveEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, currentDogs: Math.max(event.currentDogs - 1, 0) }
        : event
    ))
  }

  const getEventsNearby = (location: string, radius: number = 5) => {
    // In a real app, this would use actual GPS coordinates
    // For now, we'll filter by location name similarity
    return events.filter(event => 
      event.location.toLowerCase().includes(location.toLowerCase()) ||
      event.location.toLowerCase().includes('park') ||
      event.location.toLowerCase().includes('trail')
    )
  }

  const getEventsForDog = (dogSize: string, energyLevel: string) => {
    return events.filter(event => 
      (event.dogSize === 'All Sizes' || event.dogSize === dogSize) &&
      (event.energyLevel === 'All Levels' || event.energyLevel === energyLevel)
    )
  }

  const value: EventsContextType = {
    events,
    createEvent,
    joinEvent,
    leaveEvent,
    getEventsNearby,
    getEventsForDog
  }

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
}

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { DogEvent, EventComment } from '../pages/EventsPage'

interface EventsContextType {
  events: DogEvent[]
  createEvent: (event: any) => Promise<void>
  deleteEvent: (eventId: string) => void
  joinEvent: (eventId: string) => void
  leaveEvent: (eventId: string) => void
  addEventComment: (eventId: string, comment: Omit<EventComment, 'id' | 'eventId' | 'timestamp' | 'likes'>) => void
  likeEventComment: (eventId: string, commentId: string) => void
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
  // Load events from localStorage or use defaults
  const [events, setEvents] = useState<DogEvent[]>(() => {
    const saved = localStorage.getItem('dogEvents')
    console.log('Loading events from localStorage:', saved)
    if (saved) {
      try {
        const savedEvents = JSON.parse(saved)
        console.log('Parsed saved events:', savedEvents)
        // Merge saved events with default events, avoiding duplicates
        const defaultEvents = [
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
      isPublic: true,
      comments: []
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
      isPublic: true,
      comments: []
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
      isPublic: true,
      comments: []
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
      isPublic: true,
      comments: []
    },
    {
      id: '5',
      title: 'Small Dog Playdate',
      description: 'Perfect for small breeds! Safe space for little dogs to play and socialize.',
      date: '2024-01-16',
      time: '10:00',
      location: 'Central Park',
      maxDogs: 8,
      currentDogs: 3,
      organizer: 'Lisa Chen',
      organizerPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      eventType: 'Playdate',
      dogSize: 'Small',
      energyLevel: 'Medium',
      isPublic: true,
      comments: []
    },
    {
      id: '6',
      title: 'Puppy Training Session',
      description: 'Basic training for puppies under 1 year. Learn commands and socialization.',
      date: '2024-01-18',
      time: '14:00',
      location: 'Riverside Park',
      maxDogs: 6,
      currentDogs: 4,
      organizer: 'Mike Rodriguez',
      organizerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      eventType: 'Training',
      dogSize: 'All Sizes',
      energyLevel: 'All Levels',
      isPublic: true,
      comments: []
    },
    {
      id: '7',
      title: 'Morning Jog Group',
      description: 'High-energy dogs welcome! Join us for a brisk morning run.',
      date: '2024-01-19',
      time: '07:00',
      location: 'Central Park',
      maxDogs: 12,
      currentDogs: 8,
      organizer: 'Sarah Johnson',
      organizerPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      eventType: 'Walk',
      dogSize: 'All Sizes',
      energyLevel: 'High',
      isPublic: true
    }
        ]
        // Return saved events merged with defaults (saved events first)
        const processedSavedEvents = savedEvents.map((event: any) => ({
          ...event,
          comments: (event.comments || []).map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp)
          }))
        }))
        return [...processedSavedEvents, ...defaultEvents.filter(de => !savedEvents.find((se: DogEvent) => se.id === de.id))]
      } catch (e) {
        console.error('Failed to parse events:', e)
      }
    }
    return [
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
      isPublic: true,
      comments: []
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
      isPublic: true,
      comments: []
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
      isPublic: true,
      comments: []
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
      isPublic: true,
      comments: []
    },
    {
      id: '5',
      title: 'Small Dog Playdate',
      description: 'Perfect for small breeds! Safe space for little dogs to play and socialize.',
      date: '2024-01-16',
      time: '10:00',
      location: 'Central Park',
      maxDogs: 8,
      currentDogs: 5,
      organizer: 'Emma Davis',
      organizerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      eventType: 'Playdate',
      dogSize: 'Small',
      energyLevel: 'Medium',
      isPublic: true,
      comments: []
    },
    {
      id: '6',
      title: 'Puppy Training Session',
      description: 'Basic obedience training for puppies 3-6 months old.',
      date: '2024-01-18',
      time: '11:00',
      location: 'Dogwood Park',
      maxDogs: 6,
      currentDogs: 3,
      organizer: 'Mike Chen',
      organizerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      eventType: 'Training',
      dogSize: 'All Sizes',
      energyLevel: 'Low',
      isPublic: true,
      comments: []
    },
    {
      id: '7',
      title: 'Morning Jog Group',
      description: 'Early morning jogs for high-energy dogs and their owners.',
      date: '2024-01-15',
      time: '07:00',
      location: 'Central Park',
      maxDogs: 12,
      currentDogs: 8,
      organizer: 'Sarah Johnson',
      organizerPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      eventType: 'Walk',
      dogSize: 'All Sizes',
      energyLevel: 'High',
      isPublic: true
    }
  ]
  })

  const createEvent = async (eventData: any) => {
    console.log('Creating event with data:', eventData)
    const newEvent: DogEvent = {
      id: eventData.id,
      title: eventData.title,
      description: eventData.description,
      date: eventData.date.split('T')[0],
      time: eventData.time || new Date(eventData.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      location: eventData.location,
      maxDogs: eventData.maxAttendees,
      currentDogs: 0,
      organizer: eventData.organizer.name,
      organizerPhoto: eventData.organizer.avatar,
      eventType: eventData.eventType.charAt(0).toUpperCase() + eventData.eventType.slice(1) as any,
      dogSize: 'All Sizes',
      energyLevel: 'All Levels',
      isPublic: !eventData.isPrivate,
      comments: []
    }
    console.log('New event created:', newEvent)
    setEvents(prev => {
      const updated = [newEvent, ...prev]
      console.log('Saving events to localStorage:', updated)
      localStorage.setItem('dogEvents', JSON.stringify(updated))
      return updated
    })
  }

  const deleteEvent = (eventId: string) => {
    console.log('Deleting event:', eventId)
    setEvents(prev => {
      const updated = prev.filter(event => event.id !== eventId)
      console.log('Saving updated events to localStorage:', updated)
      localStorage.setItem('dogEvents', JSON.stringify(updated))
      return updated
    })
  }

  /**
   * FUNCTION: Join an event
   * Increments currentDogs count (up to maxDogs limit)
   * Saves updated event to localStorage
   * @param eventId - ID of the event to join
   */
  const joinEvent = (eventId: string) => {
    console.log('Joining event:', eventId)
    setEvents(prev => {
      const updated = prev.map(event => {
        if (event.id === eventId) {
          const newCount = Math.min(event.currentDogs + 1, event.maxDogs)
          console.log(`Event ${event.title}: ${event.currentDogs} → ${newCount} dogs`)
          return { ...event, currentDogs: newCount }
        }
        return event
      })
      localStorage.setItem('dogEvents', JSON.stringify(updated))
      return updated
    })
  }

  /**
   * FUNCTION: Leave an event
   * Decrements currentDogs count (minimum 0)
   * Saves updated event to localStorage
   * @param eventId - ID of the event to leave
   */
  const leaveEvent = (eventId: string) => {
    console.log('Leaving event:', eventId)
    setEvents(prev => {
      const updated = prev.map(event => {
        if (event.id === eventId) {
          const newCount = Math.max(event.currentDogs - 1, 0)
          console.log(`Event ${event.title}: ${event.currentDogs} → ${newCount} dogs`)
          return { ...event, currentDogs: newCount }
        }
        return event
      })
      localStorage.setItem('dogEvents', JSON.stringify(updated))
      return updated
    })
  }

  const addEventComment = (eventId: string, comment: Omit<EventComment, 'id' | 'eventId' | 'timestamp' | 'likes'>) => {
    const newComment: EventComment = {
      ...comment,
      id: Date.now().toString(),
      eventId,
      timestamp: new Date(),
      likes: 0
    }
    
    setEvents(prev => {
      const updated = prev.map(event => 
        event.id === eventId 
          ? { ...event, comments: [...event.comments, newComment] }
          : event
      )
      localStorage.setItem('dogEvents', JSON.stringify(updated))
      return updated
    })
  }

  const likeEventComment = (eventId: string, commentId: string) => {
    setEvents(prev => {
      const updated = prev.map(event => 
        event.id === eventId 
          ? {
              ...event,
              comments: event.comments.map(comment =>
                comment.id === commentId 
                  ? { ...comment, likes: comment.likes + 1 }
                  : comment
              )
            }
          : event
      )
      localStorage.setItem('dogEvents', JSON.stringify(updated))
      return updated
    })
  }

  const getEventsNearby = (location: string, _radius: number = 5) => {
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
    deleteEvent,
    joinEvent,
    leaveEvent,
    addEventComment,
    likeEventComment,
    getEventsNearby,
    getEventsForDog
  }

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
}

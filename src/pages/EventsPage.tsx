import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Plus, Search, X, MessageCircle, Send, ThumbsUp, Edit3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEvents } from '../contexts/EventsContext'
import { useProfile } from '../contexts/ProfileContext'
import CreateEventForm from '../components/CreateEventForm'
import LoadingScreen from '../components/LoadingScreen'
import Logo from '../components/Logo'

export interface EventComment {
  id: string
  eventId: string
  author: string
  authorAvatar: string
  content: string
  timestamp: Date
  likes: number
  likedBy: string[] // Array of user IDs who liked this comment
}

export interface DogEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  maxDogs: number
  currentDogs: number
  organizer: string
  organizerPhoto: string
  eventType: 'Walk' | 'Playdate' | 'Training' | 'Social' | 'Other'
  dogSize: 'All Sizes' | 'Small' | 'Medium' | 'Large' | 'Extra Large'
  energyLevel: 'All Levels' | 'Low' | 'Medium' | 'High'
  isPublic: boolean
  coordinates?: { lat: number; lng: number }
  comments: EventComment[]
  attendees?: string[] // Array of user IDs who have joined the event
}

const EventsPage: React.FC = () => {
  const { events, joinEvent, leaveEvent, deleteEvent, addEventComment, editEventComment, deleteEventComment, likeEventComment, isEventCommentLiked } = useEvents()
  const { profile } = useProfile()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [commentText, setCommentText] = useState<{ [eventId: string]: string }>({})
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState('')

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'date' | 'attendees' | 'recent'>('date')

  /**
   * EVENT HANDLER: Delete an event
   * Shows confirmation dialog before deleting
   */
  const handleDelete = (eventId: string) => {
    console.log('Attempting to delete event:', eventId)
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      console.log('User confirmed deletion, calling deleteEvent')
      deleteEvent(eventId)
    } else {
      console.log('User cancelled deletion')
    }
  }

  /**
   * EVENT HANDLER: Add comment to an event
   * Creates comment with current user info and saves to context
   */
  const handleAddComment = (eventId: string) => {
    const text = commentText[eventId]?.trim()
    if (!text) return

    addEventComment(eventId, {
      author: profile.name,
      authorAvatar: profile.avatar,
      content: text
    })

    // Clear the comment input
    setCommentText(prev => ({ ...prev, [eventId]: '' }))
  }

  /**
   * EVENT HANDLER: Like a comment on an event
   */
  const handleLikeComment = (eventId: string, commentId: string) => {
    likeEventComment(eventId, commentId)
  }

  /**
   * EVENT HANDLER: Edit a comment
   */
  const handleEditComment = (_eventId: string, commentId: string, currentContent: string) => {
    setEditingCommentId(commentId)
    setEditCommentText(currentContent)
  }

  /**
   * EVENT HANDLER: Save edited comment
   */
  const handleSaveEdit = (eventId: string, commentId: string) => {
    if (editCommentText.trim()) {
      editEventComment(eventId, commentId, editCommentText.trim())
      setEditingCommentId(null)
      setEditCommentText('')
    }
  }

  /**
   * EVENT HANDLER: Cancel editing
   */
  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditCommentText('')
  }

  /**
   * EVENT HANDLER: Delete a comment
   */
  const handleDeleteComment = (eventId: string, commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteEventComment(eventId, commentId)
    }
  }

  if (isLoading) {
    return <LoadingScreen message="Loading community events..." />
  }

  const eventTypes = ['All', 'Walk', 'Playdate', 'Training', 'Social', 'Other']

  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'All' || event.eventType === selectedType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'attendees':
          return (b.attendees?.length || 0) - (a.attendees?.length || 0)
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        default:
          return 0
      }
    })

  /**
   * EVENT HANDLER: Join an event
   * Increments attendee count and updates UI
   */
  const handleJoinEvent = (eventId: string) => {
    console.log('User joining event:', eventId)
    joinEvent(eventId)
    // Show success feedback
    const event = events.find(e => e.id === eventId)
    if (event) {
      console.log(`✅ Joined "${event.title}"! Current attendees: ${event.currentDogs + 1}/${event.maxDogs}`)
    }
  }

  /**
   * EVENT HANDLER: Leave an event
   * Decrements attendee count and updates UI
   */
  const handleLeaveEvent = (eventId: string) => {
    console.log('User leaving event:', eventId)
    leaveEvent(eventId)
    // Show success feedback
    const event = events.find(e => e.id === eventId)
    if (event) {
      console.log(`👋 Left "${event.title}"! Current attendees: ${event.currentDogs - 1}/${event.maxDogs}`)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50 pb-32">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-orange-500 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/70 to-orange-600/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-script font-bold text-white mb-4">
            Dog Events & Meetups
          </h1>
          <p className="text-xl text-white/90 font-body max-w-2xl mx-auto">
            Discover amazing events happening in your area and create unforgettable memories with your furry friends
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" showText={false} />
            <h2 className="text-2xl font-display font-bold text-earth-900">Events</h2>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="btn-icon"
              title="Create new event"
              aria-label="Create new event"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
            />
          </div>

          {/* Event Type Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={selectedType === type ? 'btn-pill-active' : 'btn-pill-inactive'}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between">
            <label htmlFor="sort-select" className="text-sm font-medium text-earth-700">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'attendees' | 'recent')}
              className="px-4 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body text-sm"
            >
              <option value="date">Date (Earliest First)</option>
              <option value="recent">Date (Latest First)</option>
              <option value="attendees">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-md mx-auto px-4 pb-6">
        <AnimatePresence>
          {filteredAndSortedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 p-4 mb-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold text-earth-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-earth-600 line-clamp-2 font-body">{event.description}</p>
                </div>
                <div className="ml-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium font-body ${
                    event.eventType === 'Playdate' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                    event.eventType === 'Walk' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                    event.eventType === 'Training' ? 'bg-nature-100 text-nature-800 border border-nature-200' :
                    'bg-earth-100 text-earth-800 border border-earth-200'
                  }`}>
                    {event.eventType}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-earth-600 font-body">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-earth-600 font-body">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-earth-600 font-body">
                  <Users className="w-4 h-4 text-nature-500" />
                  <span>{event.currentDogs}/{event.maxDogs} dogs</span>
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-center justify-between mb-4 p-3 bg-teal-50/50 rounded-lg border border-teal-200/50">
                <div className="flex items-center gap-3">
                  <img
                    src={event.organizerPhoto}
                    alt={event.organizer}
                    className="w-8 h-8 rounded-full object-cover border-2 border-teal-200"
                  />
                  <div>
                    <p className="text-sm font-medium text-earth-900 font-body">Organized by</p>
                    <p className="text-sm text-earth-600 font-body">{event.organizer}</p>
                  </div>
                </div>
                
                {/* Delete button - only show for user-created events */}
                {event.organizer === profile.name && (
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="btn-icon-sm"
                    title="Delete event"
                    aria-label="Delete event"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>

              {/* Comments Section */}
              <div className="mt-4 border-t border-earth-100 pt-4">
                {/* Comment Button */}
                <button
                  onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  className="flex items-center gap-2 text-earth-600 hover:text-teal-500 transition-colors mb-3"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {event.comments?.length || 0} Comments
                  </span>
                </button>

                {/* Expanded Comments */}
                {expandedEvent === event.id && (
                  <div className="space-y-3">
                    {/* Existing Comments */}
                    {event.comments && event.comments.length > 0 && (
                      <div className="space-y-3 mb-3">
                        {event.comments.map((comment) => {
                          const isMyComment = comment.author === profile.name
                          const isEditing = editingCommentId === comment.id
                          
                          return (
                            <div key={comment.id} className="bg-earth-50 rounded-lg p-3">
                              <div className="flex items-start gap-3">
                                <img
                                  src={comment.authorAvatar}
                                  alt={comment.author}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-sm text-earth-900">{comment.author}</span>
                                      <span className="text-xs text-earth-500">
                                        {new Date(comment.timestamp).toLocaleDateString()}
                                      </span>
                                    </div>
                                    {isMyComment && !isEditing && (
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => handleEditComment(event.id, comment.id, comment.content)}
                                          className="p-1 text-teal-600 hover:bg-teal-100 rounded"
                                          aria-label="Edit comment"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteComment(event.id, comment.id)}
                                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                                          aria-label="Delete comment"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {isEditing ? (
                                    <div className="space-y-2">
                                      <input
                                        type="text"
                                        value={editCommentText}
                                        onChange={(e) => setEditCommentText(e.target.value)}
                                        className="w-full px-2 py-1 bg-white border border-earth-200 rounded text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        autoFocus
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleSaveEdit(event.id, comment.id)}
                                          className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white text-xs rounded"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={handleCancelEdit}
                                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-sm text-earth-700 break-words">{comment.content}</p>
                                      <button
                                        onClick={() => handleLikeComment(event.id, comment.id)}
                                        className={`flex items-center gap-1 text-xs mt-1 transition-colors ${
                                          isEventCommentLiked(event.id, comment.id)
                                            ? 'text-red-500 hover:text-red-600'
                                            : 'text-earth-500 hover:text-teal-600'
                                        }`}
                                      >
                                        <ThumbsUp className={`w-3 h-3 ${isEventCommentLiked(event.id, comment.id) ? 'fill-red-500' : ''}`} />
                                        <span>{comment.likes}</span>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText[event.id] || ''}
                        onChange={(e) => setCommentText(prev => ({ ...prev, [event.id]: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleAddComment(event.id)
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-earth-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleAddComment(event.id)}
                        disabled={!commentText[event.id]?.trim()}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {/* Check if user has joined this event */}
                {(() => {
                  const currentUserId = 'current-user'
                  const attendees = event.attendees || []
                  const hasJoined = attendees.includes(currentUserId)
                  const isFull = event.currentDogs >= event.maxDogs
                  
                  if (hasJoined) {
                    // User has joined - show Leave button
                    return (
                      <button
                        onClick={() => handleLeaveEvent(event.id)}
                        className="btn-outline btn-full"
                      >
                        Leave Event
                      </button>
                    )
                  } else if (isFull) {
                    // Event is full - show disabled button
                    return (
                      <button
                        disabled
                        className="flex-1 bg-earth-300 text-earth-500 py-2 px-4 rounded-xl cursor-not-allowed font-body"
                      >
                        Event Full
                      </button>
                    )
                  } else {
                    // User hasn't joined and event has space - show Join button
                    return (
                      <button
                        onClick={() => handleJoinEvent(event.id)}
                        className="btn-primary-teal btn-full"
                      >
                        Join Event
                      </button>
                    )
                  }
                })()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAndSortedEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-teal-400 mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-earth-700 mb-2">No events found</h3>
            <p className="text-earth-500 font-body">Try adjusting your search or create a new event!</p>
          </div>
        )}
      </div>

            {/* Create Event Form */}
      <CreateEventForm 
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
      />
    </div>
  )
}

export default EventsPage

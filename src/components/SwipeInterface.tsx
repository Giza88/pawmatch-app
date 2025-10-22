import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, RotateCcw, Sparkles } from 'lucide-react'
import DogProfileCard, { DogProfile } from './DogProfileCard'
import EventSuggestions from './EventSuggestions'
import { useEvents } from '../contexts/EventsContext'
import { notificationService } from '../services/notificationService'
import { sendMatchNotification } from '../utils/notifications'

/**
 * SWIPE INTERFACE - Core dog matching component
 * 
 * This component handles the main swipe functionality where users:
 * - View dog profiles one at a time
 * - Swipe left to pass, right to like
 * - See match animations and feedback
 * - Can undo their last swipe
 * - Access event suggestions after matches
 * 
 * Features:
 * - Touch/drag support with visual feedback
 * - Button fallbacks for accessibility
 * - Match/dislike animations
 * - Undo functionality
 * - Event suggestions integration
 */

interface SwipeInterfaceProps {
  dogs: DogProfile[]           // Array of dogs to swipe through
  onMatch: (dog: DogProfile) => void      // Callback when user likes a dog
  onDislike: (dog: DogProfile) => void    // Callback when user passes on a dog
  onCurrentDogChange?: (index: number) => void  // Optional callback for current dog index
  onStartOver?: () => void     // Optional callback for start over functionality
  onUndo?: (dog: DogProfile) => void  // Optional callback for undo action
}

const SwipeInterface: React.FC<SwipeInterfaceProps> = ({ dogs, onMatch, onDislike, onCurrentDogChange, onStartOver, onUndo }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [, setSwipedDogs] = useState<Set<string>>(new Set())
  const [swipeHistory, setSwipeHistory] = useState<Array<{dog: DogProfile, direction: 'left' | 'right'}>>([])
  const [showMatchAnimation, setShowMatchAnimation] = useState(false)
  const [showDislikeAnimation, setShowDislikeAnimation] = useState(false)
  const [lastSwipeDirection, setLastSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [showEventSuggestions, setShowEventSuggestions] = useState(false)
  const [matchedDog, setMatchedDog] = useState<DogProfile | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const { joinEvent } = useEvents()
  
  // Refs to store timeout IDs for cleanup
  const matchAnimationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dislikeAnimationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (matchAnimationTimeoutRef.current) {
        clearTimeout(matchAnimationTimeoutRef.current)
      }
      if (dislikeAnimationTimeoutRef.current) {
        clearTimeout(dislikeAnimationTimeoutRef.current)
      }
    }
  }, [])

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const currentDog = dogs[currentIndex]
    if (!currentDog) return

    
    // Add to swipe history
    setSwipeHistory(prev => [...prev, { dog: currentDog, direction }])
    
    setLastSwipeDirection(direction)
    setSwipedDogs(prev => new Set(prev).add(currentDog.id))
    
    // Clear any existing timeouts
    if (matchAnimationTimeoutRef.current) {
      clearTimeout(matchAnimationTimeoutRef.current)
    }
    if (dislikeAnimationTimeoutRef.current) {
      clearTimeout(dislikeAnimationTimeoutRef.current)
    }

    // Show animation based on direction
    if (direction === 'right') {
      setShowMatchAnimation(true)
      matchAnimationTimeoutRef.current = setTimeout(() => {
        setShowMatchAnimation(false)
        // Store matched dog for potential event suggestions (but don't auto-show)
        setMatchedDog(currentDog)
        matchAnimationTimeoutRef.current = null
      }, 1500)
      
      // Send match notification using our new service
      notificationService.sendMatchNotification(currentDog.name, currentDog.breed, 'New Match!')
      
      onMatch(currentDog)
    } else {
      setShowDislikeAnimation(true)
      dislikeAnimationTimeoutRef.current = setTimeout(() => {
        setShowDislikeAnimation(false)
        dislikeAnimationTimeoutRef.current = null
      }, 1000)
      onDislike(currentDog)
    }
    
    const newIndex = currentIndex + 1
    setCurrentIndex(newIndex)
    onCurrentDogChange?.(newIndex)
  }, [currentIndex, dogs, onMatch, onDislike, onCurrentDogChange])

  const handleUndo = useCallback(() => {
    if (swipeHistory.length > 0) {
      // Get the last swiped dog from history
      const lastSwipe = swipeHistory[swipeHistory.length - 1]
      
      
      // Notify parent to undo the match/dislike
      if (onUndo) {
        onUndo(lastSwipe.dog)
      }
      
      // Remove from swipe history
      setSwipeHistory(prev => prev.slice(0, -1))
      
      // Remove from swiped dogs
      setSwipedDogs(prev => {
        const newSet = new Set(prev)
        newSet.delete(lastSwipe.dog.id)
        return newSet
      })
      
      // Go back one index
      const newIndex = Math.max(0, currentIndex - 1)
      setCurrentIndex(newIndex)
      onCurrentDogChange?.(newIndex)
    }
  }, [swipeHistory, currentIndex, onCurrentDogChange, onUndo])

  const currentDog = dogs[currentIndex]
  const hasMoreDogs = currentIndex < dogs.length

  if (!hasMoreDogs) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-12 h-12 text-gray-400" />
        </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No More Dogs</h3>
                <p className="text-gray-500 mb-4">Check back later for new profiles!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Call the parent's start over handler if provided, otherwise do basic reset
            if (onStartOver) {
              onStartOver()
            } else {
              // Fallback: just reset the current interface
              setCurrentIndex(0)
              setSwipedDogs(new Set())
              setSwipeHistory([])
              onCurrentDogChange?.(0)
            }
          }}
          className="btn-primary flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Start Over
        </motion.button>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-sm mx-auto mb-4">
      {/* Match/Dislike Animation Overlay */}
      <AnimatePresence>
        {showMatchAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
             <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl">
               <div className="flex items-center gap-3">
                 <Sparkles className="w-8 h-8" />
                        <span className="text-2xl font-bold font-display">MATCH!</span>
                 <Sparkles className="w-8 h-8" />
               </div>
             </div>
          </motion.div>
        )}
        
        {showDislikeAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
             <div className="bg-gradient-to-r from-red-400 to-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl">
               <div className="flex items-center gap-3">
                 <X className="w-8 h-8" />
                        <span className="text-2xl font-bold font-display">PASS</span>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Stack */}
      <div className="relative h-96">
        <AnimatePresence mode="popLayout">
          {/* Third Card (Far Back) */}
          {currentIndex + 2 < dogs.length && (
            <motion.div
              key={`third-${dogs[currentIndex + 2].id}`}
              className="absolute inset-0 z-5"
              initial={{ scale: 0.7, opacity: 0.1, y: 20 }}
              animate={{ scale: 0.7, opacity: 0.1, y: 20 }}
              exit={{ scale: 0.6, opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={dogs[currentIndex + 2].photos[0]}
                  alt={`${dogs[currentIndex + 2].name} preview`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-30 rounded-2xl" />
              </div>
            </motion.div>
          )}

          {/* Next Card (Preview) - Behind current card */}
          {currentIndex + 1 < dogs.length && (
            <motion.div
              key={`next-${dogs[currentIndex + 1].id}`}
              className="absolute inset-0 z-10"
              initial={{ scale: 0.85, opacity: 0.2, y: 10 }}
              animate={{ scale: 0.85, opacity: 0.2, y: 10 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={dogs[currentIndex + 1].photos[0]}
                  alt={`${dogs[currentIndex + 1].name} preview`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-25 rounded-2xl" />
              </div>
            </motion.div>
          )}
          
          {/* Current Card - On top */}
          <motion.div
            key={currentDog.id}
            ref={cardRef}
            className="absolute inset-0 z-20"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ 
              x: lastSwipeDirection === 'right' ? 400 : lastSwipeDirection === 'left' ? -400 : 0,
              opacity: 0,
              scale: 0.8,
              rotate: lastSwipeDirection === 'right' ? 15 : lastSwipeDirection === 'left' ? -15 : 0,
              y: -50
            }}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut",
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <DogProfileCard
              dog={currentDog}
              onSwipe={handleSwipe}
              isActive={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-8 mt-8">
        {/* Dislike Button */}
        <motion.button
          onClick={() => handleSwipe('left')}
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 border-2 border-red-200 hover:border-red-400 hover:shadow-red-200 hover:bg-red-50 active:bg-red-100"
        >
          <X className="w-8 h-8 text-red-500" />
        </motion.button>

        {/* Undo Button */}
        <motion.button
          onClick={handleUndo}
          disabled={swipeHistory.length === 0}
          whileHover={swipeHistory.length > 0 ? { scale: 1.1, rotate: -10 } : {}}
          whileTap={swipeHistory.length > 0 ? { scale: 0.95 } : {}}
          className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
            swipeHistory.length === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-200'
              : 'bg-white hover:border-blue-300 hover:shadow-blue-100 border-2 border-blue-200'
          }`}
        >
          <RotateCcw className="w-8 h-8" />
        </motion.button>

        {/* Like Button */}
        <motion.button
          onClick={() => handleSwipe('right')}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 border-2 border-green-200 hover:border-green-400 hover:shadow-green-200 hover:bg-green-50 active:bg-green-100"
        >
          <Heart className="w-8 h-8 text-green-500 fill-current" />
        </motion.button>
      </div>

      {/* Enhanced Progress Indicator */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-3">
          {dogs.slice(0, Math.min(5, dogs.length)).map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-teal-500 to-orange-500 shadow-lg'
                  : index < currentIndex
                  ? 'bg-gradient-to-r from-green-400 to-green-500'
                  : 'bg-gray-300'
              }`}
              animate={{
                scale: index === currentIndex ? [1, 1.2, 1] : 1,
                opacity: index === currentIndex ? [0.7, 1, 0.7] : 1
              }}
              transition={{
                duration: 1.5,
                repeat: index === currentIndex ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Swipe Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-4"
      >
         <p className="text-sm text-earth-600 font-body">
           Swipe left to pass, right to like
         </p>
      </motion.div>

      {/* Event Suggestions Button - Only show if there's a recent match */}
      <AnimatePresence>
        {matchedDog && !showEventSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 2 }}
            className="text-center mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEventSuggestions(true)}
              className="bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🎉 Find Events for {matchedDog.name}!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Suggestions Modal */}
      <AnimatePresence>
        {showEventSuggestions && matchedDog && (
          <EventSuggestions
            dog={matchedDog}
            onClose={() => {
              setShowEventSuggestions(false)
              setMatchedDog(null)
            }}
            onJoinEvent={(eventId) => {
              joinEvent(eventId)
              setShowEventSuggestions(false)
              setMatchedDog(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SwipeInterface

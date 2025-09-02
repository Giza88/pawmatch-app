import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, RotateCcw } from 'lucide-react'
import DogProfileCard, { DogProfile } from './DogProfileCard'

interface SwipeInterfaceProps {
  dogs: DogProfile[]
  onMatch: (dog: DogProfile) => void
  onDislike: (dog: DogProfile) => void
  onCurrentDogChange?: (index: number) => void
}

const SwipeInterface: React.FC<SwipeInterfaceProps> = ({ dogs, onMatch, onDislike, onCurrentDogChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipedDogs, setSwipedDogs] = useState<Set<string>>(new Set())

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const currentDog = dogs[currentIndex]
    if (!currentDog) return

    setSwipedDogs(prev => new Set(prev).add(currentDog.id))
    
    if (direction === 'right') {
      onMatch(currentDog)
    } else {
      onDislike(currentDog)
    }
    
    const newIndex = currentIndex + 1
    setCurrentIndex(newIndex)
    onCurrentDogChange?.(newIndex)
  }, [currentIndex, dogs, onMatch, onDislike, onCurrentDogChange])

  const handleUndo = useCallback(() => {
    if (currentIndex > 0) {
      const previousDog = dogs[currentIndex - 1]
      setSwipedDogs(prev => {
        const newSet = new Set(prev)
        newSet.delete(previousDog.id)
        return newSet
      })
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      onCurrentDogChange?.(newIndex)
    }
  }, [currentIndex, dogs, onCurrentDogChange])

  const currentDog = dogs[currentIndex]
  const hasMoreDogs = currentIndex < dogs.length

  if (!hasMoreDogs) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No more dogs to show!</h3>
        <p className="text-gray-500 mb-4">Check back later for new furry friends in your area.</p>
        <button
          onClick={() => {
            setCurrentIndex(0)
            setSwipedDogs(new Set())
          }}
          className="btn-primary"
        >
          Start Over
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-sm mx-auto mb-32">
      {/* Card Stack */}
      <div className="relative h-96">
        <AnimatePresence>
          {/* Next Card (Preview) - Behind current card */}
          {currentIndex + 1 < dogs.length && (
            <motion.div
              key={dogs[currentIndex + 1].id}
              className="absolute inset-0 z-10"
              initial={{ scale: 0.9, opacity: 0.3 }}
              animate={{ scale: 0.9, opacity: 0.3 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <img
                  src={dogs[currentIndex + 1].photos[0]}
                  alt={`${dogs[currentIndex + 1].name} preview`}
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-black opacity-20 rounded-2xl" />
              </div>
            </motion.div>
          )}
          
          {/* Current Card - On top */}
          <motion.div
            key={currentDog.id}
            className="absolute inset-0 z-20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ 
              x: swipedDogs.has(currentDog.id) ? (swipedDogs.has(currentDog.id) ? 300 : -300) : 0,
              opacity: 0,
              scale: 0.8,
              rotate: swipedDogs.has(currentDog.id) ? (swipedDogs.has(currentDog.id) ? 15 : -15) : 0
            }}
            transition={{ duration: 0.3 }}
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
      <div className="flex items-center justify-center gap-6 mt-6">
        {/* Dislike Button */}
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 border-2 border-gray-200"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>

        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={currentIndex === 0}
          className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
            currentIndex === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:scale-110 border-2 border-gray-200'
          }`}
        >
          <RotateCcw className="w-8 h-8" />
        </button>

        {/* Like Button */}
        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 border-2 border-gray-200"
        >
          <Heart className="w-8 h-8 text-green-500 fill-current" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex gap-2">
          {dogs.slice(0, Math.min(5, dogs.length)).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex
                  ? 'bg-primary-500'
                  : index < currentIndex
                  ? 'bg-gray-300'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SwipeInterface

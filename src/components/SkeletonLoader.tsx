import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'list'
  width?: string | number
  height?: string | number
  lines?: number
  animate?: boolean
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  animate = true
}) => {
  const baseClasses = 'bg-gray-200 rounded'
  const animationClasses = animate ? 'animate-pulse' : ''

  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full'
      case 'text':
        return 'h-4 rounded'
      case 'card':
        return 'rounded-lg p-4 space-y-3'
      case 'list':
        return 'rounded-lg p-3 space-y-2'
      default:
        return 'rounded'
    }
  }

  const getDimensions = () => {
    const style: React.CSSProperties = {}
    if (width) style.width = typeof width === 'number' ? `${width}px` : width
    if (height) style.height = typeof height === 'number' ? `${height}px` : height
    return style
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`${baseClasses} ${getVariantClasses()} ${animationClasses}`}
            style={{
              ...getDimensions(),
              width: index === lines - 1 ? '75%' : '100%' // Last line is shorter
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <motion.div
        className={`${baseClasses} ${getVariantClasses()} ${animationClasses} ${className}`}
        style={getDimensions()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse" />
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-4">
            <div className="h-6 bg-gray-300 rounded w-12 animate-pulse" />
            <div className="h-6 bg-gray-300 rounded w-12 animate-pulse" />
          </div>
          <div className="h-8 bg-gray-300 rounded w-20 animate-pulse" />
        </div>
      </motion.div>
    )
  }

  if (variant === 'list') {
    return (
      <motion.div
        className={`${baseClasses} ${getVariantClasses()} ${animationClasses} ${className}`}
        style={getDimensions()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-gray-300 rounded w-1/3 animate-pulse" />
            <div className="h-2 bg-gray-300 rounded w-1/4 animate-pulse" />
          </div>
          <div className="h-6 bg-gray-300 rounded w-16 animate-pulse" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`${baseClasses} ${getVariantClasses()} ${animationClasses} ${className}`}
      style={getDimensions()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  )
}

// Pre-built skeleton components for common use cases
export const PostSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-6">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonLoader
        key={index}
        variant="card"
        height={200}
        className="w-full"
      />
    ))}
  </div>
)

export const EventSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonLoader
        key={index}
        variant="card"
        height={180}
        className="w-full"
      />
    ))}
  </div>
)

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <SkeletonLoader variant="circular" width={80} height={80} />
      <div className="flex-1 space-y-2">
        <SkeletonLoader variant="text" width="60%" height={24} />
        <SkeletonLoader variant="text" width="40%" height={16} />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <SkeletonLoader variant="rectangular" height={60} />
      <SkeletonLoader variant="rectangular" height={60} />
      <SkeletonLoader variant="rectangular" height={60} />
    </div>
  </div>
)

export const MatchCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonLoader variant="circular" width={60} height={60} />
      <div className="flex-1 space-y-2">
        <SkeletonLoader variant="text" width="70%" height={20} />
        <SkeletonLoader variant="text" width="50%" height={16} />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <SkeletonLoader variant="text" width="100%" height={16} />
      <SkeletonLoader variant="text" width="80%" height={16} />
    </div>
    <div className="flex justify-between">
      <SkeletonLoader variant="rectangular" width={80} height={32} />
      <SkeletonLoader variant="rectangular" width={80} height={32} />
    </div>
  </div>
)

export default SkeletonLoader


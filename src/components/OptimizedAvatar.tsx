import React from 'react'
import LazyImage from './LazyImage'

interface OptimizedAvatarProps {
  src: string
  alt: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const OptimizedAvatar: React.FC<OptimizedAvatarProps> = ({
  src,
  alt,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  return (
    <LazyImage
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full ${className}`}
      placeholder="/paw-icon.png"
      fallback="/paw-icon.png"
    />
  )
}

export default OptimizedAvatar


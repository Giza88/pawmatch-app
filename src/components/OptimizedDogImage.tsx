import React from 'react'
import LazyImage from './LazyImage'

interface OptimizedDogImageProps {
  src: string
  alt: string
  className?: string
  size?: 'thumbnail' | 'medium' | 'large'
}

const OptimizedDogImage: React.FC<OptimizedDogImageProps> = ({
  src,
  alt,
  className = '',
  size = 'medium'
}) => {
  const sizeClasses = {
    thumbnail: 'w-12 h-12',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  }

  return (
    <LazyImage
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-lg ${className}`}
      placeholder="/paw-icon.png"
      fallback="/paw-icon.png"
    />
  )
}

export default OptimizedDogImage


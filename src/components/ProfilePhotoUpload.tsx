import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, User } from 'lucide-react'
import ImageUpload from './ImageUpload'

interface ProfilePhotoUploadProps {
  currentPhoto?: string
  onPhotoSelect: (file: File | null) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhoto,
  onPhotoSelect,
  size = 'md',
  className = ''
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const handleImageSelect = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      onPhotoSelect(file)
    }
  }

  const handleImageRemove = () => {
    setSelectedFile(null)
    setPreviewUrl(currentPhoto || null)
    onPhotoSelect(null)
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Profile Photo Display */}
      <div className="relative group">
        <div className={`
          ${sizeClasses[size]} 
          rounded-full overflow-hidden bg-earth-100 border-4 border-white shadow-lg
        `}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-earth-200">
              <User className={`${iconSizes[size]} text-earth-400`} />
            </div>
          )}
        </div>

        {/* Camera Overlay */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files
              if (files && files.length > 0) {
                handleImageSelect(Array.from(files))
              }
            }
            input.click()
          }}
        >
          <Camera className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Upload Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files
            if (files && files.length > 0) {
              handleImageSelect(Array.from(files))
            }
          }
          input.click()
        }}
        className="mt-3 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <Camera className="w-4 h-4" />
        {currentPhoto || previewUrl ? 'Change Photo' : 'Add Photo'}
      </motion.button>

      {/* Remove Button */}
      {(currentPhoto || previewUrl) && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleImageRemove}
          className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors duration-200"
        >
          Remove
        </motion.button>
      )}

      {/* Hidden ImageUpload for drag & drop functionality */}
      <div className="hidden">
        <ImageUpload
          onImageSelect={handleImageSelect}
          maxImages={1}
          maxSize={2}
          multiple={false}
          placeholder=""
        />
      </div>
    </div>
  )
}

export default ProfilePhotoUpload


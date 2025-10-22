import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Camera, Trash2 } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (files: File[]) => void
  onImageRemove?: (index: number) => void
  maxImages?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  existingImages?: string[]
  multiple?: boolean
  className?: string
  placeholder?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onImageRemove,
  maxImages = 5,
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  existingImages = [],
  multiple = true,
  className = '',
  placeholder = 'Drag & drop images here or click to browse'
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[]>(existingImages)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Image optimization function
  const optimizeImage = useCallback((file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(optimizedFile)
            } else {
              reject(new Error('Failed to optimize image'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }, [])

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please use: ${acceptedTypes.map(type => type.split('/')[1]).join(', ')}`
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File too large. Maximum size is ${maxSize}MB`
    }

    return null
  }, [acceptedTypes, maxSize])

  // Handle file selection
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    setError(null)

    // Check total images limit
    if (previewImages.length + fileArray.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    try {
      const validFiles: File[] = []
      
      for (const file of fileArray) {
        const validationError = validateFile(file)
        if (validationError) {
          setError(validationError)
          continue
        }

        try {
          // Optimize image
          const optimizedFile = await optimizeImage(file)
          validFiles.push(optimizedFile)
        } catch (error) {
          console.error('Error optimizing image:', error)
          validFiles.push(file) // Use original if optimization fails
        }
      }

      if (validFiles.length > 0) {
        // Create preview URLs
        const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file))
        const updatedPreviews = multiple 
          ? [...previewImages, ...newPreviewUrls]
          : newPreviewUrls

        setPreviewImages(updatedPreviews)
        onImageSelect(validFiles)
      }
    } catch (error) {
      setError('Failed to process images')
      console.error('Error processing files:', error)
    }
  }, [previewImages.length, maxImages, validateFile, optimizeImage, onImageSelect, multiple])

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  // Handle click to browse
  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  // Remove image
  const handleRemoveImage = useCallback((index: number) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index)
    setPreviewImages(updatedPreviews)
    onImageRemove?.(index)
  }, [previewImages, onImageRemove])

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-teal-500 bg-teal-50' 
            : 'border-earth-300 hover:border-teal-400 hover:bg-earth-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <motion.div
          animate={{ 
            scale: isDragOver ? 1.1 : 1,
            rotate: isDragOver ? 5 : 0 
          }}
          transition={{ duration: 0.2 }}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-teal-500' : 'text-earth-400'}`} />
        </motion.div>

        <h3 className="text-lg font-semibold text-earth-700 mb-2">
          {isDragOver ? 'Drop images here!' : 'Upload Images'}
        </h3>
        
        <p className="text-earth-500 text-sm mb-4">
          {placeholder}
        </p>

        <div className="flex items-center justify-center gap-4 text-sm text-earth-400">
          <span>Max {maxImages} images</span>
          <span>•</span>
          <span>Max {maxSize}MB each</span>
          <span>•</span>
          <span>{acceptedTypes.map(type => type.split('/')[1]).join(', ')}</span>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-600 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Previews */}
      <AnimatePresence>
        {previewImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <h4 className="text-sm font-semibold text-earth-700 mb-3">
              Selected Images ({previewImages.length}/{maxImages})
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previewImages.map((preview, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-earth-100">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage(index)
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImageUpload


import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Plus, X, Star } from 'lucide-react'
import ImageUpload from './ImageUpload'

interface DogPhotoUploadProps {
  onPhotosSelect: (files: File[]) => void
  onPhotoRemove?: (index: number) => void
  existingPhotos?: string[]
  maxPhotos?: number
  className?: string
}

const DogPhotoUpload: React.FC<DogPhotoUploadProps> = ({
  onPhotosSelect,
  onPhotoRemove,
  existingPhotos = [],
  maxPhotos = 6,
  className = ''
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>(existingPhotos)
  const [primaryPhotoIndex, setPrimaryPhotoIndex] = useState(0)

  const handleImageSelect = (files: File[]) => {
    const newFiles = [...selectedFiles, ...files]
    setSelectedFiles(newFiles)
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    const updatedPreviews = [...previewUrls, ...newPreviewUrls]
    setPreviewUrls(updatedPreviews)
    
    onPhotosSelect(newFiles)
  }

  const handleImageRemove = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    const updatedPreviews = previewUrls.filter((_, i) => i !== index)
    
    setSelectedFiles(updatedFiles)
    setPreviewUrls(updatedPreviews)
    
    // Adjust primary photo index if needed
    if (primaryPhotoIndex >= updatedPreviews.length) {
      setPrimaryPhotoIndex(Math.max(0, updatedPreviews.length - 1))
    }
    
    onPhotoRemove?.(index)
  }

  const setAsPrimary = (index: number) => {
    setPrimaryPhotoIndex(index)
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Main Upload Area */}
      <ImageUpload
        onImageSelect={handleImageSelect}
        maxImages={maxPhotos}
        maxSize={5}
        multiple={true}
        existingImages={previewUrls}
        placeholder="Drag & drop dog photos here or click to browse"
        className="mb-6"
      />

      {/* Photo Grid */}
      {previewUrls.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-earth-700 mb-4">
            Dog Photos ({previewUrls.length}/{maxPhotos})
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {previewUrls.map((preview, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-earth-100 border-2 border-earth-200">
                  <img
                    src={preview}
                    alt={`Dog photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Primary Photo Badge */}
                  {index === primaryPhotoIndex && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 fill-current" />
                      Primary
                    </motion.div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    {index !== primaryPhotoIndex && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setAsPrimary(index)}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors duration-200"
                        title="Set as primary photo"
                      >
                        <Star className="w-4 h-4" />
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleImageRemove(index)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200"
                      title="Remove photo"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Add More Photos Button */}
            {previewUrls.length < maxPhotos && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="aspect-square rounded-xl border-2 border-dashed border-earth-300 hover:border-teal-400 bg-earth-50 hover:bg-teal-50 flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.multiple = true
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files
                    if (files && files.length > 0) {
                      handleImageSelect(Array.from(files))
                    }
                  }
                  input.click()
                }}
              >
                <Plus className="w-8 h-8 text-earth-400 mb-2" />
                <span className="text-sm font-medium text-earth-500">Add Photo</span>
              </motion.div>
            )}
          </div>
          
          {/* Tips */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="text-sm font-semibold text-blue-800 mb-2">Photo Tips:</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use clear, well-lit photos of your dog</li>
              <li>• Include different angles and activities</li>
              <li>• The first photo will be your primary photo</li>
              <li>• Show your dog's personality and energy</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default DogPhotoUpload


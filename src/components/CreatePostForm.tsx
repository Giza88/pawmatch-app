import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Hash, X, Image as ImageIcon } from 'lucide-react'
import { useCommunity } from '../contexts/CommunityContext'

interface CreatePostFormProps {
  isOpen: boolean
  onClose: () => void
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ isOpen, onClose }) => {
  const { createPost } = useCommunity()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    isAnonymous: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const newPost = {
        id: Date.now().toString(),
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        createdAt: new Date().toISOString(),
        author: {
          id: 'current-user',
          name: formData.isAnonymous ? 'Anonymous' : 'You',
          avatar: '/placeholder-avatar.jpg'
        },
        likes: 0,
        comments: [],
        isPinned: false
      }
      
      await createPost(newPost)
      setFormData({
        title: '',
        content: '',
        category: 'general',
        tags: '',
        isAnonymous: false
      })
      onClose()
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-earth-200 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-earth-900">Create New Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-earth-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-earth-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-earth-700 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="What's on your mind?"
            />
          </div>

          {/* Post Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-earth-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={4}
              required
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              placeholder="Share your thoughts, questions, or experiences..."
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-earth-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            >
              <option value="general">General Discussion</option>
              <option value="health">Health & Wellness</option>
              <option value="training">Training Tips</option>
              <option value="events">Events & Meetups</option>
              <option value="lost-found">Lost & Found</option>
              <option value="reviews">Park & Service Reviews</option>
              <option value="funny">Funny Stories</option>
              <option value="advice">Advice Needed</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-earth-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="puppy, training, advice"
            />
            <p className="text-xs text-earth-500 mt-1">Add relevant tags to help others find your post</p>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleInputChange}
              className="w-4 h-4 text-teal-600 border-earth-300 rounded focus:ring-teal-500"
            />
            <label htmlFor="isAnonymous" className="ml-2 text-sm text-earth-700">
              Post anonymously
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-earth-300 disabled:to-earth-400 text-white font-body font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Post...' : 'Create Post'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CreatePostForm

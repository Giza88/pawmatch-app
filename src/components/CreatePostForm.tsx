import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Send, Hash } from 'lucide-react'
import { useCommunity } from '../contexts/CommunityContext'

interface CreatePostFormProps {
  onClose: () => void
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onClose }) => {
  const { addPost } = useCommunity()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general' as const,
    tags: ''
  })

  const categories = [
    { id: 'general', label: 'General', color: 'bg-blue-500' },
    { id: 'health', label: 'Health', color: 'bg-green-500' },
    { id: 'training', label: 'Training', color: 'bg-purple-500' },
    { id: 'events', label: 'Events', color: 'bg-orange-500' },
    { id: 'lost-found', label: 'Lost & Found', color: 'bg-red-500' },
    { id: 'reviews', label: 'Reviews', color: 'bg-teal-500' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) return

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    addPost({
      title: formData.title.trim(),
      content: formData.content.trim(),
      author: 'You',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      category: formData.category,
      tags
    })

    // Reset form and close
    setFormData({ title: '', content: '', category: 'general', tags: '' })
    onClose()
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-earth-200 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold text-earth-900">Create New Post</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-earth-100 hover:bg-earth-200 text-earth-600 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2 font-body">
              Post Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2 font-body">
              Post Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Share your thoughts, questions, or experiences..."
              rows={4}
              className="w-full px-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body resize-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2 font-body">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleInputChange('category', category.id)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    formData.category === category.id
                      ? `${category.color} text-white shadow-lg`
                      : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2 font-body">
              Tags (optional)
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-earth-400" />
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="training, health, puppy (separate with commas)"
                className="w-full pl-10 pr-3 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body text-sm"
              />
            </div>
            <p className="text-xs text-earth-500 mt-1">
              Add relevant tags to help others find your post
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-earth-200 hover:bg-earth-300 text-earth-800 py-3 px-6 rounded-xl font-body font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || !formData.content.trim()}
              className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-body font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Post
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default CreatePostForm

import React, { useState } from 'react'
import { MessageCircle, Heart, Share2, Plus, Filter, Search, TrendingUp, Users, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCommunity } from '../contexts/CommunityContext'
import CreatePostForm from '../components/CreatePostForm'

export interface CommunityPost {
  id: string
  title: string
  content: string
  author: string
  authorPhoto: string
  authorId: string
  category: 'General' | 'Training' | 'Health' | 'Behavior' | 'Breed Specific' | 'Events' | 'Lost & Found'
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  createdAt: string
  tags: string[]
  image?: string
}

export interface Comment {
  id: string
  content: string
  author: string
  authorPhoto: string
  authorId: string
  createdAt: string
  likes: number
  isLiked: boolean
}

const CommunityPage: React.FC = () => {
  const { posts, likePost, bookmarkPost } = useCommunity()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent')

  const categories = ['All', 'General', 'Training', 'Health', 'Behavior', 'Breed Specific', 'Events', 'Lost & Found']

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes
        case 'trending':
          return (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares)
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })



  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return '1 day ago'
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Training': return 'bg-blue-100 text-blue-800'
      case 'Health': return 'bg-green-100 text-green-800'
      case 'Behavior': return 'bg-purple-100 text-purple-800'
      case 'Breed Specific': return 'bg-orange-100 text-orange-800'
      case 'Events': return 'bg-pink-100 text-pink-800'
      case 'Lost & Found': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleLike = (postId: string) => {
    likePost(postId)
  }

  const handleBookmark = (postId: string) => {
    bookmarkPost(postId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-nature-600 to-teal-500 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-nature-900/80 via-nature-800/70 to-teal-600/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-script font-bold text-white mb-4">
            Dog Community Hub
          </h1>
          <p className="text-xl text-white/90 font-body max-w-2xl mx-auto">
            Connect with fellow dog owners, share stories, and get advice from the community
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-earth-900">Community</h2>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-nature-500 to-nature-600 hover:from-nature-600 hover:to-nature-700 text-white p-3 rounded-xl font-body font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-nature-500" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-nature-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-body"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-nature-500 to-nature-600 text-white shadow-lg'
                    : 'bg-white/80 text-earth-700 hover:bg-nature-50 border border-earth-200 backdrop-blur-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'recent'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'popular'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setSortBy('trending')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                sortBy === 'trending'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                  : 'bg-white/80 text-earth-700 hover:bg-teal-50 border border-earth-200 backdrop-blur-sm'
              }`}
            >
              Trending
            </button>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="max-w-md mx-auto px-4 pb-6">
        <AnimatePresence>
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 p-4 mb-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={post.authorPhoto}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`p-2 rounded-full transition-colors ${
                    post.isBookmarked 
                      ? 'text-yellow-500 hover:text-yellow-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Star className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>
                
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-4">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-gray-100 pt-3">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                    post.isLiked
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  {post.isLiked ? 'Liked' : 'Like'}
                </button>
                
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Comment
                </button>
                
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No discussions found</h3>
            <p className="text-gray-500">Try adjusting your search or start a new conversation!</p>
          </div>
        )}
      </div>

      {/* Create Post Form */}
      <CreatePostForm 
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
      />
    </div>
  )
}

export default CommunityPage

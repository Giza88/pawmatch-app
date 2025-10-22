import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Bookmark, Share2, Plus, X, Send, ThumbsUp, Search, Edit3 } from 'lucide-react'
import { useCommunity } from '../contexts/CommunityContext'
import { useProfile } from '../contexts/ProfileContext'
import CreatePostForm from '../components/CreatePostForm'
import LoadingScreen from '../components/LoadingScreen'
import TrendingPosts from '../components/TrendingPosts'
import Logo from '../components/Logo'
import ConfirmationDialog from '../components/ConfirmationDialog'
import OptimizedAvatar from '../components/OptimizedAvatar'
import { sendCommunityNotification } from '../utils/notifications'

const CommunityPage: React.FC = () => {
  const { posts, likePost, isPostLiked, bookmarkPost, addComment, likeComment, isCommentLiked, deletePost, editComment, deleteComment } = useCommunity()
  const { profile } = useProfile()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({})
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'comments'>('recent')
  
  // Confirmation dialog state
  const [showDeletePostDialog, setShowDeletePostDialog] = useState(false)
  const [showDeleteCommentDialog, setShowDeleteCommentDialog] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [commentToDelete, setCommentToDelete] = useState<{ postId: string; commentId: string } | null>(null)

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Loading community posts..." />
  }

  const categories = [
    { id: 'all', label: 'All Posts', color: 'bg-gray-500' },
    { id: 'general', label: 'General', color: 'bg-blue-500' },
    { id: 'health', label: 'Health', color: 'bg-green-500' },
    { id: 'training', label: 'Training', color: 'bg-purple-500' },
    { id: 'events', label: 'Events', color: 'bg-orange-500' },
    { id: 'lost-found', label: 'Lost & Found', color: 'bg-red-500' },
    { id: 'reviews', label: 'Reviews', color: 'bg-teal-500' }
  ]

  // Filter and sort posts by category, search term, and sort option
  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case 'popular':
          return b.likes - a.likes
        case 'comments':
          return (b.comments?.length || 0) - (a.comments?.length || 0)
        default:
          return 0
      }
    })

  const handleLike = (postId: string) => {
    likePost(postId)
    
    // Send notification to post author (in a real app, this would be handled by the backend)
    const post = posts.find(p => p.id === postId)
    if (post && post.author !== profile.name) {
      sendCommunityNotification('like', 'Someone', post.title)
    }
  }

  /**
   * EVENT HANDLER: Toggle bookmark for a post
   * Saves/unsaves posts for later viewing
   */
  const handleBookmark = (postId: string) => {
    bookmarkPost(postId)
  }

  const handleDelete = (postId: string) => {
    setPostToDelete(postId)
    setShowDeletePostDialog(true)
  }

  const confirmDeletePost = () => {
    if (postToDelete) {
      deletePost(postToDelete)
      setPostToDelete(null)
    }
  }

  const handleAddComment = (postId: string) => {
    const text = commentText[postId]?.trim()
    if (!text) return

    addComment(postId, {
      author: profile.name,
      authorAvatar: profile.avatar,
      content: text
    })

    // Send notification to post author (in a real app, this would be handled by the backend)
    const post = posts.find(p => p.id === postId)
    if (post && post.author !== profile.name) {
      sendCommunityNotification('comment', 'Someone', post.title)
    }

    // Clear the comment input
    setCommentText(prev => ({ ...prev, [postId]: '' }))
  }

  const handleEditComment = (postId: string, commentId: string, currentContent: string) => {
    setEditingCommentId(commentId)
    setEditCommentText(currentContent)
  }

  const handleSaveEdit = (postId: string, commentId: string) => {
    if (editCommentText.trim()) {
      editComment(postId, commentId, editCommentText.trim())
      setEditingCommentId(null)
      setEditCommentText('')
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditCommentText('')
  }

  const handleDeleteComment = (postId: string, commentId: string) => {
    setCommentToDelete({ postId, commentId })
    setShowDeleteCommentDialog(true)
  }

  const confirmDeleteComment = () => {
    if (commentToDelete) {
      deleteComment(commentToDelete.postId, commentToDelete.commentId)
      setCommentToDelete(null)
    }
  }

  const handleLikeComment = (postId: string, commentId: string) => {
    likeComment(postId, commentId)
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - timestamp.getTime()
    const diffInMins = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMins < 60) return `${diffInMins}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${diffInDays}d ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50 pb-32">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-nature-500 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/70 to-nature-600/60" />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-script font-bold text-white mb-4">
            Community Hub
          </h1>
          <p className="text-xl text-white/90 font-body max-w-2xl mx-auto">
            Connect with fellow dog lovers, share tips, and stay updated on everything canine
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
              <div>
                <h2 className="text-xl font-display font-bold text-earth-900">Community</h2>
                <p className="text-sm text-earth-600 font-body">Share stories and connect with dog lovers</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="btn-icon"
              aria-label="Create new post"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 font-body"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'btn-pill-active' : 'btn-pill-inactive'}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between mt-2">
            <label htmlFor="sort-select-community" className="text-sm font-medium text-earth-700">Sort by:</label>
            <select
              id="sort-select-community"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'comments')}
              className="px-4 py-2 border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/60 backdrop-blur-sm font-body text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Liked</option>
              <option value="comments">Most Commented</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Trending Posts */}
        {/* <TrendingPosts /> */}

        {/* Community Posts */}
        <div className="space-y-4">
          {filteredAndSortedPosts.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 p-8 text-center">
              <MessageCircle className="w-16 h-16 text-earth-300 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-earth-800 mb-2">No posts found</h3>
              <p className="text-earth-500 font-body mb-4">Try adjusting your search or filters!</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-teal-600 hover:text-teal-700 font-semibold underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            filteredAndSortedPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 overflow-hidden card-hover fade-in"
            >
              {/* Post Header */}
              <div className="p-4 border-b border-earth-100">
                <div className="flex items-center gap-3 mb-3">
                  <OptimizedAvatar
                    src={post.authorAvatar}
                    alt={post.author}
                    size="md"
                    className="border-2 border-earth-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-earth-900">{post.author}</h3>
                    <p className="text-sm text-earth-600">{formatTimeAgo(post.timestamp)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.category === 'health' ? 'bg-green-100 text-green-700' :
                      post.category === 'lost-found' ? 'bg-red-100 text-red-700' :
                      post.category === 'training' ? 'bg-purple-100 text-purple-700' :
                      post.category === 'events' ? 'bg-orange-100 text-orange-700' :
                      post.category === 'reviews' ? 'bg-teal-100 text-teal-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    
                    {/* Delete button - only show for user's own posts */}
                    {post.author === profile.name && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="btn-icon-sm"
                        title="Delete post"
                        aria-label="Delete post"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-earth-900 mb-2">{post.title}</h4>
                <p className="text-earth-700 line-clamp-3">{post.content}</p>
                
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-earth-100 text-earth-600 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="px-4 py-3 border-b border-earth-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition-colors btn-micro ${
                        isPostLiked(post.id) 
                          ? 'text-red-500' 
                          : 'text-earth-600 hover:text-red-500'
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          isPostLiked(post.id) ? 'fill-current' : ''
                        }`} 
                      />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    
                    <button
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-earth-600 hover:text-teal-500 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments.length}</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        post.isBookmarked 
                          ? 'text-teal-600 bg-teal-100' 
                          : 'text-earth-500 hover:text-teal-600 hover:bg-teal-50'
                      }`}
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: post.title,
                            text: post.content,
                            url: window.location.href
                          })
                        } else {
                          // Fallback: copy to clipboard
                          navigator.clipboard.writeText(`${post.title}\n\n${post.content}\n\n${window.location.href}`)
                          alert('Post link copied to clipboard!')
                        }
                      }}
                      className="p-2 text-earth-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {expandedPost === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-earth-100"
                  >
                    {/* Comments List */}
                    <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                      {post.comments.length > 0 ? (
                        post.comments.map((comment) => {
                          const isMyComment = comment.author === profile.name
                          const isEditing = editingCommentId === comment.id
                          
                          return (
                            <div key={comment.id} className="flex gap-3">
                              <OptimizedAvatar
                                src={comment.authorAvatar}
                                alt={comment.author}
                                size="sm"
                                className="border border-earth-200"
                              />
                              <div className="flex-1">
                                <div className="bg-earth-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-earth-900 text-sm">{comment.author}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-earth-500">{formatTimeAgo(comment.timestamp)}</span>
                                      {isMyComment && (
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => handleEditComment(post.id, comment.id, comment.content)}
                                            className="p-1 text-earth-500 hover:text-teal-600 rounded"
                                            aria-label="Edit comment"
                                          >
                                            <Edit3 className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteComment(post.id, comment.id)}
                                            className="p-1 text-earth-500 hover:text-red-600 rounded"
                                            aria-label="Delete comment"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {isEditing ? (
                                    <div className="space-y-2">
                                      <input
                                        type="text"
                                        value={editCommentText}
                                        onChange={(e) => setEditCommentText(e.target.value)}
                                        className="w-full px-2 py-1 border border-earth-200 rounded text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        autoFocus
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleSaveEdit(post.id, comment.id)}
                                          className="px-2 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={handleCancelEdit}
                                          className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-earth-700 text-sm">{comment.content}</p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleLikeComment(post.id, comment.id)}
                                  className={`flex items-center gap-1 text-xs mt-1 transition-colors btn-micro ${
                                    isCommentLiked(post.id, comment.id)
                                      ? 'text-red-500 hover:text-red-600'
                                      : 'text-earth-500 hover:text-teal-600'
                                  }`}
                                >
                                  <ThumbsUp className={`w-3 h-3 ${isCommentLiked(post.id, comment.id) ? 'fill-red-500' : ''}`} />
                                  <span>{comment.likes}</span>
                                </button>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <p className="text-center text-earth-500 text-sm py-4">No comments yet. Be the first to comment!</p>
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="p-4 border-t border-earth-100 bg-earth-50/50">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Write a comment..."
                          className="flex-1 px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentText[post.id]?.trim()}
                          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )))}
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <CreatePostForm onClose={() => setShowCreatePost(false)} />
        )}
      </AnimatePresence>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showDeletePostDialog}
        onClose={() => setShowDeletePostDialog(false)}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationDialog
        isOpen={showDeleteCommentDialog}
        onClose={() => setShowDeleteCommentDialog(false)}
        onConfirm={confirmDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}

export default CommunityPage

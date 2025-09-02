import React from 'react'
import { TrendingUp, MessageCircle, Heart, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { CommunityPost } from '../pages/CommunityPage'

interface TrendingPostsProps {
  posts: CommunityPost[]
  onViewCommunity: () => void
}

const TrendingPosts: React.FC<TrendingPostsProps> = ({ posts, onViewCommunity }) => {
  const trendingPosts = posts
    .sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
    .slice(0, 3)

  if (trendingPosts.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Trending Discussions</h3>
        </div>
        <button
          onClick={onViewCommunity}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {trendingPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={onViewCommunity}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1 pr-2">{post.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                post.category === 'Training' ? 'bg-blue-100 text-blue-800' :
                post.category === 'Health' ? 'bg-green-100 text-green-800' :
                post.category === 'Behavior' ? 'bg-purple-100 text-purple-800' :
                post.category === 'Breed Specific' ? 'bg-orange-100 text-orange-800' :
                post.category === 'Events' ? 'bg-pink-100 text-pink-800' :
                post.category === 'Lost & Found' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {post.category}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span className="font-medium">{post.author}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={onViewCommunity}
        className="w-full mt-3 btn-primary py-2 text-sm"
      >
        Join the Conversation
      </button>
    </motion.div>
  )
}

export default TrendingPosts

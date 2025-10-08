import React from 'react'
import { TrendingUp, MessageCircle, Heart, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCommunity } from '../contexts/CommunityContext'

const TrendingPosts: React.FC = () => {
  const { getTrendingPosts } = useCommunity()
  const trendingPosts = getTrendingPosts()

  if (trendingPosts.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-earth-900">Trending Discussions</h3>
        </div>
      </div>

      <div className="space-y-3">
        {trendingPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="p-3 bg-earth-50/50 rounded-lg border border-earth-200 hover:bg-earth-100 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-earth-900 text-sm line-clamp-2 flex-1 pr-2">{post.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                post.category === 'health' ? 'bg-green-100 text-green-700' :
                post.category === 'lost-found' ? 'bg-red-100 text-red-700' :
                post.category === 'training' ? 'bg-purple-100 text-purple-700' :
                post.category === 'events' ? 'bg-orange-100 text-orange-700' :
                post.category === 'reviews' ? 'bg-teal-100 text-teal-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-earth-600">
              <span className="font-medium">{post.author}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
        <p className="text-sm text-teal-800 text-center">
          Join the conversation and share your experiences with fellow dog lovers! 🐕
        </p>
      </div>
    </motion.div>
  )
}

export default TrendingPosts

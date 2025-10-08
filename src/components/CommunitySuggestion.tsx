import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Heart, TrendingUp, ArrowRight } from 'lucide-react'
import { CommunityPost } from '../contexts/CommunityContext'
import { DogProfile } from './DogProfileCard'

interface CommunitySuggestionProps {
  dog: DogProfile
  posts: CommunityPost[]
  onViewCommunity: () => void
}

const CommunitySuggestion: React.FC<CommunitySuggestionProps> = ({ dog, posts, onViewCommunity }) => {
  // Filter posts that would be relevant for this dog
  const relevantPosts = posts.filter(post => {
    const breedMatch = post.tags.some(tag => 
      tag.toLowerCase().includes(dog.breed.toLowerCase().split(' ')[0]) ||
      tag.toLowerCase().includes('puppy') && dog.age <= 2 ||
      tag.toLowerCase().includes('senior') && dog.age >= 7
    )
    const sizeMatch = post.tags.some(tag => 
      tag.toLowerCase().includes(dog.size.toLowerCase()) ||
      tag.toLowerCase().includes('large') && dog.size === 'Large' ||
      tag.toLowerCase().includes('small') && dog.size === 'Small'
    )
    const energyMatch = post.tags.some(tag => 
      tag.toLowerCase().includes(dog.energyLevel.toLowerCase()) ||
      tag.toLowerCase().includes('energy') && dog.energyLevel === 'High'
    )
    
    return breedMatch || sizeMatch || energyMatch
  }).slice(0, 2) // Show max 2 posts

  if (relevantPosts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 p-4 mb-4"
      >
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-earth-900 mb-2">Join the conversation!</h3>
          <p className="text-earth-600 mb-3">Connect with other dog owners in your area</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewCommunity}
            className="btn-primary py-2 px-6 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Browse Community
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-earth-200 p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-earth-900">Community for {dog.name}</h3>
        <button
          onClick={onViewCommunity}
          className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {relevantPosts.map((post) => (
          <div
            key={post.id}
            className="p-3 bg-earth-50/50 rounded-lg border border-earth-200"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-earth-900 text-sm line-clamp-2">{post.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
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
            
            <div className="space-y-1 text-xs text-earth-600">
              <div className="flex items-center gap-1">
                <span className="font-medium">{post.author}</span>
              </div>
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
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onViewCommunity}
        className="w-full mt-3 btn-primary py-2 text-sm flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Join Discussion
      </motion.button>
    </motion.div>
  )
}

export default CommunitySuggestion

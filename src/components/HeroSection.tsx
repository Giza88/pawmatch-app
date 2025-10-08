import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, MapPin, Users } from 'lucide-react'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  backgroundImage?: string
  showStats?: boolean
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  title = "Find Your Perfect Match",
  subtitle = "Connect with dogs and owners in your area",
  backgroundImage = "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&h=600&fit=crop",
  showStats = true
}) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/70 to-orange-600/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-script font-bold text-white mb-6 leading-tight"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl text-white/90 mb-8 font-body font-medium max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-body font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3"
            >
                 Start Matching
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="group bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full font-body font-semibold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30 flex items-center gap-3"
            >
              Learn More
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Stats */}
          {showStats && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-orange-400" />
                </div>
                <div className="text-3xl font-display font-bold text-white mb-2">2,500+</div>
                   <div className="text-white/80 font-body">Happy Matches</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-teal-400" />
                </div>
                <div className="text-3xl font-display font-bold text-white mb-2">150+</div>
                <div className="text-white/80 font-body">Cities Covered</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-nature-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-nature-400" />
                </div>
                <div className="text-3xl font-display font-bold text-white mb-2">10,000+</div>
                <div className="text-white/80 font-body">Active Users</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500/20 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-teal-500/20 rounded-full blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-nature-500/20 rounded-full blur-lg" />
    </div>
  )
}

export default HeroSection

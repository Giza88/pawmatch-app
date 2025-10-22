import React from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, MessageCircle, Calendar, Navigation, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: Heart,
    title: "Match",
    color: "orange",
    delay: 0.1,
    route: "/"
  },
  {
    icon: MapPin,
    title: "Events",
    color: "teal",
    delay: 0.2,
    route: "/events"
  },
  {
    icon: MessageCircle,
    title: "Community",
    color: "nature",
    delay: 0.3,
    route: "/community"
  },
  {
    icon: Calendar,
    title: "Health",
    color: "orange",
    delay: 0.4,
    route: "/health"
  },
]

const FeatureShowcase: React.FC = () => {
  const navigate = useNavigate()

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return 'bg-orange-500/10 text-orange-600 border-orange-200'
      case 'teal':
        return 'bg-teal-500/10 text-teal-600 border-teal-200'
      case 'nature':
        return 'bg-nature-500/10 text-nature-600 border-nature-200'
      default:
        return 'bg-teal-500/10 text-teal-600 border-teal-200'
    }
  }

  const handleFeatureClick = (route: string) => {
    navigate(route)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-earth-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-script font-bold text-earth-900 mb-6"
          >
            Everything You Need
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-earth-600 font-body max-w-3xl mx-auto"
          >
            Pawmatch™ brings together all the tools and features you need to give your dog the best life possible
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: feature.delay }}
                className="group relative cursor-pointer"
                onClick={() => handleFeatureClick(feature.route)}
              >
                <div className="bg-white rounded-xl p-6 shadow-md border border-earth-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-xl ${getColorClasses(feature.color)} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-earth-900">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-teal-500 to-orange-500 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-script font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-xl font-body mb-6 opacity-90">
              Join thousands of happy dog owners who've found their perfect match
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-teal-600 hover:bg-earth-50 px-8 py-4 rounded-full font-body font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Start Matching
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeatureShowcase

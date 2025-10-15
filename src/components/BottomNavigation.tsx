import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dog, Calendar, MessageCircle, Heart, Navigation, User, Heart as HeartIcon } from 'lucide-react'

const BottomNavigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    {
      path: '/discover',
      icon: Dog,
            label: 'Match',
      color: 'text-primary-600'
    },
    {
      path: '/matches',
      icon: HeartIcon,
            label: 'Matches',
      color: 'text-gray-600'
    },
    {
      path: '/events',
      icon: Calendar,
      label: 'Events',
      color: 'text-gray-600'
    },
    {
      path: '/community',
      icon: MessageCircle,
      label: 'Community',
      color: 'text-gray-600'
    },
    {
      path: '/health',
      icon: Heart,
      label: 'Health',
      color: 'text-gray-600'
    },
    {
      path: '/profile',
      icon: User,
      label: 'Profile',
      color: 'text-gray-600'
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-earth-200 shadow-lg z-50 pb-safe">
      <div className="max-w-md mx-auto px-1">
        <div className="flex items-center justify-between py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const activeColor = isActive ? 'text-teal-600' : 'text-earth-600'
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-1 px-0.5 rounded-lg transition-colors duration-200 min-w-0 flex-1 ${
                  isActive ? 'bg-teal-50' : 'hover:bg-earth-50'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${activeColor}`} />
                <span className={`text-xs font-medium ${activeColor} font-body leading-tight truncate`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default BottomNavigation

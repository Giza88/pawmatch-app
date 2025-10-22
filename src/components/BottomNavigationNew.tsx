import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dog, Calendar, MessageCircle, Heart, User, Heart as HeartIcon } from 'lucide-react'

const BottomNavigationNew: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/discover', icon: Dog, label: 'Match' },
    { path: '/matches', icon: HeartIcon, label: 'Matches' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/community', icon: MessageCircle, label: 'Community' },
    { path: '/health', icon: Heart, label: 'Health' },
    { path: '/profile', icon: User, label: 'Profile' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const activeColor = isActive ? 'text-teal-600' : 'text-gray-600'
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex-1 flex flex-col items-center py-2"
              >
                <Icon className={`w-5 h-5 mb-1 ${activeColor}`} />
                <span 
                  className={`text-xs ${activeColor}`}
                  style={{
                    fontSize: '10px',
                    lineHeight: '12px',
                    maxWidth: '50px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block'
                  }}
                >
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

export default BottomNavigationNew

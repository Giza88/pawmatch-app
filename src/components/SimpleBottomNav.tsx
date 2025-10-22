import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dog, Calendar, MessageCircle, Heart, User, Heart as HeartIcon } from 'lucide-react'

const SimpleBottomNav: React.FC = () => {
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
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 50,
      maxWidth: '448px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 0'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          const activeColor = isActive ? '#0d9488' : '#6b7280'
          
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                backgroundColor: isActive ? '#f0fdfa' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              <Icon 
                size={24} 
                color={activeColor}
                style={{ marginBottom: '4px' }}
              />
              <span 
                style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: activeColor,
                  textAlign: 'center',
                  maxWidth: '60px',
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
  )
}

export default SimpleBottomNav

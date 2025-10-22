import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Your actual app logo - replace with your image */}
        <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
          <img 
            src="/pawmatch-logo-white-background.png" 
            alt="Pawmatch™ Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to a simple icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          {/* Fallback icon */}
          <div 
            className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg"
            style={{ display: 'none' }}
          >
            <svg 
              className="w-3/4 h-3/4 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 2.8 1.3 3.8L12 20l4.7-8.2C17.5 10.8 18 9.5 18 8c0-3.5-2.5-6-6-6zm0 2c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"/>
              <circle cx="12" cy="9" r="1"/>
              <circle cx="10" cy="7.5" r="0.5"/>
              <circle cx="14" cy="7.5" r="0.5"/>
            </svg>
          </div>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-sm opacity-20 -z-10"></div>
      </div>

      {/* Logo Text - Only show if logo doesn't include text */}
      {showText && (
        <div className="flex items-center">
          <span className={`font-display font-bold bg-gradient-to-r from-earth-900 to-teal-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
            Pawmatch<sup className="text-xs text-teal-600">™</sup>
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo

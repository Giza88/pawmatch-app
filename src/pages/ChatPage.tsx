import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Image, MapPin, Phone, MoreVertical, Heart } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useChat } from '../contexts/ChatContext'
import Logo from '../components/Logo'

// Mock user data - in a real app, this would come from your user context
const mockUsers = {
  'user-2': {
    id: 'user-2',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    dogName: 'Buddy',
    dogPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop',
    isOnline: true
  },
  'user-3': {
    id: 'user-3',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    dogName: 'Luna',
    dogPhoto: 'https://www.bellaandduke.com/wp-content/uploads/2025/07/A-guide-to-Border-Collies-Lifespan-temperament-health-and-the-best-food-for-them-featured-image.webp',
    isOnline: false
  },
  'user-4': {
    id: 'user-4',
    name: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    dogName: 'Bella',
    dogPhoto: 'https://www.akc.org/wp-content/uploads/2017/11/Cavalier-King-Charles-Spaniel-standing-in-the-grass.jpg',
    isOnline: true
  }
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate()
  const { conversationId } = useParams<{ conversationId: string }>()
  const { conversations, messages, sendMessage, markAsRead, createConversation } = useChat()
  const [messageText, setMessageText] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  let conversation = conversations.find(c => c.id === conversationId)
  let conversationMessages = conversationId ? messages[conversationId] || [] : []
  let otherParticipant = conversation?.participants.find(p => p !== 'user-1') || ''
  let otherUser = mockUsers[otherParticipant as keyof typeof mockUsers]

  // If conversation doesn't exist, create it dynamically
  useEffect(() => {
    if (conversationId && !conversation) {
      // Extract dog ID from conversation ID (e.g., "conv-4" -> "4")
      const dogId = conversationId.replace('conv-', '')
      
      // Create a new conversation for this dog
      createConversation(['user-1', `user-${dogId}`])
      
      // Update local variables
      conversation = conversations.find(c => c.id === conversationId)
      otherParticipant = `user-${dogId}`
      otherUser = mockUsers[otherParticipant as keyof typeof mockUsers]
    }
  }, [conversationId, conversation, createConversation, conversations])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationMessages])

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId)
    }
  }, [conversationId, markAsRead])

  const handleSendMessage = () => {
    if (messageText.trim() && conversationId) {
      sendMessage(conversationId, messageText.trim())
      setMessageText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (!conversation || !otherUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-display font-semibold text-earth-700 mb-2">Conversation not found</h2>
          <p className="text-earth-500 font-body mb-6">This conversation may have been deleted or doesn't exist.</p>
          <button
            onClick={() => navigate('/matches')}
            className="btn-primary-teal"
          >
            Back to Matches
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/matches')}
                className="p-2 hover:bg-earth-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-earth-600" />
              </button>
              <Logo size="sm" showText={false} />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <h2 className="text-lg font-display font-bold text-earth-900">{otherUser.name}</h2>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${otherUser.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-xs text-earth-500 font-body">
                    {otherUser.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
                />
                {otherUser.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 hover:bg-earth-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-earth-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Options Menu */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/90 backdrop-blur-sm border-b border-earth-200"
          >
            <div className="max-w-md mx-auto px-4 py-3">
              <div className="flex items-center justify-around">
                <button 
                  onClick={() => {
                    // In a real app, this would initiate a voice call
                    alert('Initiating call... This would start a voice call with the matched user.')
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-earth-50 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-body text-earth-700">Call</span>
                </button>
                <button 
                  onClick={() => {
                    // In a real app, this would show shared location or meeting spot
                    alert('Showing location... This would display shared location or suggest a meeting spot.')
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-earth-50 rounded-lg transition-colors"
                >
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-body text-earth-700">Location</span>
                </button>
                <button 
                  onClick={() => {
                    // In a real app, this would open photo sharing
                    alert('Opening photos... This would allow you to share photos with the matched user.')
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-earth-50 rounded-lg transition-colors"
                >
                  <Image className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-body text-earth-700">Photos</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-md mx-auto space-y-4">
          <AnimatePresence>
            {conversationMessages.map((message, index) => {
              const isOwn = message.senderId === 'user-1'
              const showAvatar = index === 0 || conversationMessages[index - 1].senderId !== message.senderId
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!isOwn && showAvatar && (
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-earth-200"
                    />
                  )}
                  
                  {!isOwn && !showAvatar && (
                    <div className="w-8 h-8" />
                  )}
                  
                  <div className={`max-w-xs lg:max-w-md ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                          : 'bg-white/80 backdrop-blur-sm text-earth-900 border border-earth-200'
                      }`}
                    >
                      <p className="text-sm font-body leading-relaxed">{message.content}</p>
                    </div>
                    <p className={`text-xs text-earth-500 mt-1 font-body ${isOwn ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-earth-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                // In a real app, this would open image picker
                alert('Opening image picker... This would allow you to select and send photos.')
              }}
              className="p-2 hover:bg-earth-100 rounded-full transition-colors"
            >
              <Image className="w-5 h-5 text-earth-600" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-3 pr-12 bg-white/80 backdrop-blur-sm border border-earth-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none font-body"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className={`p-3 rounded-xl transition-all duration-300 ${
                messageText.trim()
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white transform hover:scale-105'
                  : 'bg-earth-200 text-earth-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage

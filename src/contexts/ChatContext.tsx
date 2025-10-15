import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  type: 'text' | 'image' | 'location'
}

export interface ChatConversation {
  id: string
  participants: string[] // User IDs
  lastMessage?: ChatMessage
  unreadCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ChatContextType {
  conversations: ChatConversation[]
  messages: { [conversationId: string]: ChatMessage[] }
  activeConversation: string | null
  setActiveConversation: (conversationId: string | null) => void
  sendMessage: (conversationId: string, content: string, type?: 'text' | 'image' | 'location') => void
  markAsRead: (conversationId: string) => void
  createConversation: (participants: string[]) => string
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Mock data for demonstration
const mockConversations: ChatConversation[] = [
  {
    id: 'conv-1',
    participants: ['user-1', 'user-2'],
    unreadCount: 2,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    lastMessage: {
      id: 'msg-1',
      senderId: 'user-2',
      receiverId: 'user-1',
      content: 'Hey! Would love to set up a playdate soon!',
      timestamp: '2024-01-15T14:30:00Z',
      isRead: false,
      type: 'text'
    }
  },
  {
    id: 'conv-2',
    participants: ['user-1', 'user-3'],
    unreadCount: 0,
    isActive: true,
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    lastMessage: {
      id: 'msg-2',
      senderId: 'user-1',
      receiverId: 'user-3',
      content: 'Luna had so much fun at the park yesterday!',
      timestamp: '2024-01-12T16:45:00Z',
      isRead: true,
      type: 'text'
    }
  },
  {
    id: 'conv-3',
    participants: ['user-1', 'user-4'],
    unreadCount: 1,
    isActive: true,
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-10T15:20:00Z',
    lastMessage: {
      id: 'msg-3',
      senderId: 'user-4',
      receiverId: 'user-1',
      content: 'Thanks for the great walk today!',
      timestamp: '2024-01-10T15:20:00Z',
      isRead: false,
      type: 'text'
    }
  }
]

const mockMessages: { [conversationId: string]: ChatMessage[] } = {
  'conv-1': [
    {
      id: 'msg-1-1',
      senderId: 'user-2',
      receiverId: 'user-1',
      content: 'Hi! I saw you matched with Buddy! He looks amazing!',
      timestamp: '2024-01-15T10:15:00Z',
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg-1-2',
      senderId: 'user-1',
      receiverId: 'user-2',
      content: 'Thank you! Buddy is such a sweetheart. Would love to set up a playdate!',
      timestamp: '2024-01-15T10:20:00Z',
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg-1-3',
      senderId: 'user-2',
      receiverId: 'user-1',
      content: 'That sounds perfect! How about this weekend at Central Park?',
      timestamp: '2024-01-15T14:25:00Z',
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg-1-4',
      senderId: 'user-2',
      receiverId: 'user-1',
      content: 'Hey! Would love to set up a playdate soon!',
      timestamp: '2024-01-15T14:30:00Z',
      isRead: false,
      type: 'text'
    }
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      senderId: 'user-3',
      receiverId: 'user-1',
      content: 'Hi! Luna and I would love to meet up for a walk!',
      timestamp: '2024-01-12T09:10:00Z',
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg-2-2',
      senderId: 'user-1',
      receiverId: 'user-3',
      content: 'That sounds great! Luna is such an energetic pup!',
      timestamp: '2024-01-12T09:15:00Z',
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg-2-3',
      senderId: 'user-1',
      receiverId: 'user-3',
      content: 'Luna had so much fun at the park yesterday!',
      timestamp: '2024-01-12T16:45:00Z',
      isRead: true,
      type: 'text'
    }
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      senderId: 'user-4',
      receiverId: 'user-1',
      content: 'Hi! Bella is so gentle and sweet!',
      timestamp: '2024-01-10T11:05:00Z',
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg-3-2',
      senderId: 'user-1',
      receiverId: 'user-4',
      content: 'Thank you! She loves meeting new friends!',
      timestamp: '2024-01-10T11:10:00Z',
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg-3-3',
      senderId: 'user-4',
      receiverId: 'user-1',
      content: 'Thanks for the great walk today!',
      timestamp: '2024-01-10T15:20:00Z',
      isRead: false,
      type: 'text'
    }
  ]
}

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations)
  const [messages, setMessages] = useState<{ [conversationId: string]: ChatMessage[] }>(mockMessages)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)

  const sendMessage = useCallback((conversationId: string, content: string, type: 'text' | 'image' | 'location' = 'text') => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-1',
      receiverId: conversations.find(c => c.id === conversationId)?.participants.find(p => p !== 'user-1') || '',
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      type
    }

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }))

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { 
            ...conv, 
            lastMessage: newMessage, 
            updatedAt: newMessage.timestamp,
            unreadCount: conv.participants.includes('user-1') ? conv.unreadCount : conv.unreadCount + 1
          }
        : conv
    ))
  }, [])

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ))

    setMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => 
        msg.receiverId === 'user-1' ? { ...msg, isRead: true } : msg
      )
    }))
  }, [])

  const createConversation = useCallback((participants: string[]): string => {
    const conversationId = `conv-${Date.now()}`
    const newConversation: ChatConversation = {
      id: conversationId,
      participants,
      unreadCount: 0,
      isActive: true,
      lastMessage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setConversations(prev => [...prev, newConversation])
    setMessages(prev => ({ ...prev, [conversationId]: [] }))

    return conversationId
  }, [])

  return (
    <ChatContext.Provider value={{
      conversations,
      messages,
      activeConversation,
      setActiveConversation,
      sendMessage,
      markAsRead,
      createConversation
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
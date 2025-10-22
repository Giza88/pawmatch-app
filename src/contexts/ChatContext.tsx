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

// Start with empty conversations - no mock data
const mockConversations: ChatConversation[] = []
const mockMessages: { [conversationId: string]: ChatMessage[] } = {}

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
      lastMessage: undefined,
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
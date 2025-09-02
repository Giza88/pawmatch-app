import React, { createContext, useContext, useState, ReactNode } from 'react'
import { CommunityPost, Comment } from '../pages/CommunityPage'

interface CommunityContextType {
  posts: CommunityPost[]
  createPost: (post: any) => Promise<void>
  likePost: (postId: string) => void
  bookmarkPost: (postId: string) => void
  getPostsByCategory: (category: string) => CommunityPost[]
  getTrendingPosts: () => CommunityPost[]
  getPostsByAuthor: (authorId: string) => CommunityPost[]
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)

export const useCommunity = () => {
  const context = useContext(CommunityContext)
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider')
  }
  return context
}

interface CommunityProviderProps {
  children: ReactNode
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      title: 'Best training treats for puppies?',
      content: 'I just got a 3-month-old Golden Retriever and I\'m looking for recommendations on the best training treats. Something healthy but motivating enough for training sessions. What has worked well for you?',
      author: 'Sarah Johnson',
      authorPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
      authorId: 'user1',
      category: 'Training',
      likes: 24,
      comments: 18,
      shares: 5,
      isLiked: false,
      isBookmarked: false,
      createdAt: '2024-01-14T10:30:00Z',
      tags: ['puppy', 'training', 'treats', 'golden retriever']
    },
    {
      id: '2',
      title: 'Dog park etiquette - what\'s your take?',
      content: 'I\'ve been taking my dog to the local park for months now, but I\'m curious about everyone\'s thoughts on proper etiquette. Should dogs be on-leash until they\'re in the fenced area? How do you handle aggressive dogs?',
      author: 'Mike Chen',
      authorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      authorId: 'user2',
      category: 'Behavior',
      likes: 31,
      comments: 25,
      shares: 12,
      isLiked: true,
      isBookmarked: false,
      createdAt: '2024-01-13T15:45:00Z',
      tags: ['dog park', 'etiquette', 'socialization', 'safety']
    },
    {
      id: '3',
      title: 'Lost: Black Lab near Central Park',
      content: 'My 2-year-old black Labrador, Shadow, went missing yesterday evening near Central Park. He\'s wearing a blue collar with ID tags. Please contact me if you see him. Reward offered.',
      author: 'Lisa Rodriguez',
      authorPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      authorId: 'user3',
      category: 'Lost & Found',
      likes: 45,
      comments: 32,
      shares: 89,
      isLiked: false,
      isBookmarked: true,
      createdAt: '2024-01-12T18:20:00Z',
      tags: ['lost dog', 'black lab', 'central park', 'missing']
    },
    {
      id: '4',
      title: 'Border Collie energy management tips',
      content: 'I have a 1-year-old Border Collie who seems to have unlimited energy. We do 2 walks a day plus fetch sessions, but he\'s still restless. Any Border Collie owners have advice on mental stimulation and energy management?',
      author: 'David Wilson',
      authorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      authorId: 'user4',
      category: 'Breed Specific',
      likes: 28,
      comments: 21,
      shares: 8,
      isLiked: false,
      isBookmarked: false,
      createdAt: '2024-01-11T12:15:00Z',
      tags: ['border collie', 'energy', 'mental stimulation', 'breed specific']
    },
    {
      id: '5',
      title: 'Vaccination schedule for new puppy',
      content: 'Just adopted a 8-week-old puppy and want to make sure I\'m following the right vaccination schedule. What vaccines are essential and when should they be given? Any recommendations for local vets?',
      author: 'Emma Thompson',
      authorPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      authorId: 'user5',
      category: 'Health',
      likes: 19,
      comments: 15,
      shares: 6,
      isLiked: false,
      isBookmarked: false,
      createdAt: '2024-01-10T09:30:00Z',
      tags: ['puppy', 'vaccination', 'health', 'vet']
    }
  ])

  const createPost = async (postData: any) => {
    const newPost: CommunityPost = {
      id: postData.id,
      title: postData.title,
      content: postData.content,
      author: postData.author.name,
      authorPhoto: postData.author.avatar,
      authorId: postData.author.id,
      category: postData.category.charAt(0).toUpperCase() + postData.category.slice(1) as any,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      createdAt: postData.createdAt,
      tags: postData.tags
    }
    setPosts(prev => [newPost, ...prev])
  }

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ))
  }

  const bookmarkPost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
  }

  const getPostsByCategory = (category: string) => {
    if (category === 'All') return posts
    return posts.filter(post => post.category === category)
  }

  const getTrendingPosts = () => {
    return [...posts].sort((a, b) => 
      (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares)
    ).slice(0, 5)
  }

  const getPostsByAuthor = (authorId: string) => {
    return posts.filter(post => post.authorId === authorId)
  }

  const value: CommunityContextType = {
    posts,
    createPost,
    likePost,
    bookmarkPost,
    getPostsByCategory,
    getTrendingPosts,
    getPostsByAuthor
  }

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

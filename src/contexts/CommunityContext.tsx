import React, { createContext, useContext, useState, ReactNode } from 'react'

/**
 * COMMUNITY CONTEXT - Manages community posts and interactions
 * 
 * This context handles all community-related functionality including:
 * - Creating and displaying community posts
 * - Like/unlike functionality with user tracking
 * - Commenting system
 * - Bookmarking posts
 * - Data persistence to localStorage
 * 
 * Key Features:
 * - Heart button turns red when liked (one like per user)
 * - Comments with like functionality
 * - Bookmark system for saving posts
 * - Category filtering (general, health, training, events, lost-found, reviews)
 * - Real-time like counts and comment updates
 */

export interface Comment {
  id: string
  postId: string
  author: string
  authorAvatar: string
  content: string
  timestamp: Date
  likes: number
  likedBy: string[] // Array of user IDs who liked this comment
}

export interface CommunityPost {
  id: string
  title: string
  content: string
  author: string
  authorAvatar: string
  category: 'general' | 'health' | 'training' | 'events' | 'lost-found' | 'reviews'
  timestamp: Date
  likes: number
  likedBy: string[] // Array of user IDs who liked this post - enables one like per user
  comments: Comment[]
  isBookmarked: boolean
  tags: string[]
}

interface CommunityContextType {
  posts: CommunityPost[]
  addPost: (post: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'likedBy' | 'comments' | 'isBookmarked'>) => void
  deletePost: (postId: string) => void
  likePost: (postId: string) => void
  isPostLiked: (postId: string) => boolean
  bookmarkPost: (postId: string) => void
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'postId' | 'timestamp' | 'likes' | 'likedBy'>) => void
  editComment: (postId: string, commentId: string, newContent: string) => void
  deleteComment: (postId: string, commentId: string) => void
  likeComment: (postId: string, commentId: string) => void
  isCommentLiked: (postId: string, commentId: string) => boolean
  getPostsByCategory: (category: string) => CommunityPost[]
  getTrendingPosts: () => CommunityPost[]
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
  // Load posts from localStorage or use defaults
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('communityPosts')
    console.log('Loading community posts from localStorage:', saved)
    if (saved) {
      try {
        const savedPosts = JSON.parse(saved)
        console.log('Parsed saved posts:', savedPosts)
        // Convert timestamp strings back to Date objects
        return savedPosts.map((post: any) => ({
          ...post,
          timestamp: new Date(post.timestamp),
          comments: post.comments.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp)
          }))
        }))
      } catch (e) {
        console.error('Failed to parse community posts:', e)
      }
    }
    console.log('Using default community posts')
    return [
    {
      id: '1',
      title: 'Best dog parks in Edinburgh?',
      content: 'Looking for recommendations for the best dog-friendly parks in Edinburgh. My Golden Retriever loves open spaces and water features. Any suggestions?',
      author: 'Sarah M.',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      category: 'general',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 12,
      likedBy: [],
      comments: [
        {
          id: 'c1',
          postId: '1',
          author: 'Mike R.',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          content: 'Holyrood Park is fantastic! Lots of space and great views.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 3
        },
        {
          id: 'c2',
          postId: '1',
          author: 'Emma L.',
          authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          content: 'I love Inverleith Park - it has a great enclosed area for off-leash play!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          likes: 5
        }
      ],
      isBookmarked: false,
      tags: ['parks', 'edinburgh', 'golden-retriever']
    },
    {
      id: '2',
      title: 'Vaccination schedule reminder',
      content: 'Just a friendly reminder that it\'s time for annual vaccinations! Don\'t forget to book your vet appointments.',
      author: 'Dr. Johnson',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      category: 'health',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      likes: 28,
      likedBy: [],
      comments: [
        {
          id: 'c3',
          postId: '2',
          author: 'Lisa K.',
          authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          content: 'Thanks for the reminder! Just booked mine for next week.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 2
        }
      ],
      isBookmarked: true,
      tags: ['vaccinations', 'health', 'vet']
    },
    {
      id: '3',
      title: 'Lost: Black Labrador near Meadows',
      content: 'My dog Max went missing this afternoon near the Meadows. He\'s wearing a blue collar and responds to his name. Please contact me if you see him!',
      author: 'David P.',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      category: 'lost-found',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      likes: 45,
      likedBy: [],
      comments: [
        {
          id: 'c4',
          postId: '3',
          author: 'Anna S.',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
          content: 'I\'ll keep an eye out! Have you checked with the local shelters?',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          likes: 4
        },
        {
          id: 'c5',
          postId: '3',
          author: 'David P.',
          authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          content: 'Yes, I\'ve called all the local shelters. Still searching...',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          likes: 1
        }
      ],
      isBookmarked: false,
      tags: ['lost-dog', 'labrador', 'meadows', 'urgent']
    },
    {
      id: '4',
      title: 'Weekend Dog Meetup at Holyrood Park! 🐕',
      content: 'Join us this Saturday at 2 PM for a fun dog meetup at Holyrood Park! All breeds welcome. We\'ll have some agility equipment and treats. Perfect for socializing your pups!',
      author: 'Jennifer Walsh',
      authorAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
      category: 'events',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      likes: 34,
      likedBy: [],
      comments: [
        {
          id: 'c6',
          postId: '4',
          author: 'Tom Anderson',
          authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          content: 'Count me in! My Border Collie needs some playtime with other dogs.',
          timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
          likes: 6
        },
        {
          id: 'c7',
          postId: '4',
          author: 'Sophie Chen',
          authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
          content: 'This sounds amazing! Will there be water available for the dogs?',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          likes: 3
        }
      ],
      isBookmarked: false,
      tags: ['meetup', 'holyrood-park', 'socialization', 'weekend']
    },
    {
      id: '5',
      title: 'Charity Dog Walk for Animal Rescue 🐾',
      content: 'Join our annual charity dog walk on Sunday, March 15th! Starting at 10 AM from Princes Street Gardens. 5km route with rest stops. All proceeds go to Edinburgh Dog and Cat Home. Registration £10 per dog.',
      author: 'Margaret Thompson',
      authorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      category: 'events',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      likes: 67,
      likedBy: [],
      comments: [
        {
          id: 'c8',
          postId: '5',
          author: 'Robert Mitchell',
          authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          content: 'Great cause! I\'ll be there with my two rescue dogs.',
          timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000),
          likes: 8
        },
        {
          id: 'c9',
          postId: '5',
          author: 'Amanda Foster',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          content: 'Is there a minimum age for dogs? My puppy is 6 months old.',
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
          likes: 2
        }
      ],
      isBookmarked: true,
      tags: ['charity', 'dog-walk', 'fundraiser', 'edinburgh-rescue']
    },
    {
      id: '6',
      title: '⭐ 5-Star Review: Edinburgh Dog Grooming Salon',
      content: 'Just had my Golden Retriever groomed at "Pawsome Grooming" on Rose Street. Amazing service! The staff was so gentle with my anxious dog, and the results are incredible. Clean, professional, and reasonably priced. Highly recommend!',
      author: 'Claire O\'Connor',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      category: 'reviews',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      likes: 23,
      likedBy: [],
      comments: [
        {
          id: 'c10',
          postId: '6',
          author: 'Mark Davies',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          content: 'Thanks for the recommendation! How much did it cost?',
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
          likes: 1
        }
      ],
      isBookmarked: false,
      tags: ['grooming', 'rose-street', 'golden-retriever', '5-stars']
    },
    {
      id: '7',
      title: '🏥 Vet Review: Edinburgh Veterinary Hospital',
      content: 'Had an emergency with my Border Collie last night. Edinburgh Vet Hospital was incredible - they saw us immediately, the staff was compassionate, and the treatment was top-notch. A bit pricey but worth every penny for the care and expertise.',
      author: 'Daniel Park',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      category: 'reviews',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      likes: 41,
      likedBy: [],
      comments: [
        {
          id: 'c11',
          postId: '7',
          author: 'Sarah Johnson',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          content: 'Glad your dog is okay! What was the emergency?',
          timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000),
          likes: 3
        },
        {
          id: 'c12',
          postId: '7',
          author: 'Daniel Park',
          authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          content: 'He ate something toxic from the garden. All good now though!',
          timestamp: new Date(Date.now() - 46 * 60 * 60 * 1000),
          likes: 5
        }
      ],
      isBookmarked: false,
      tags: ['vet', 'emergency', 'border-collie', 'edinburgh-hospital']
    },
    {
      id: '8',
      title: '🐕‍🦺 Dog Training Review: Positive Paws Academy',
      content: 'Completed the 6-week obedience course with my rescue dog at Positive Paws Academy. The trainers are amazing - they use positive reinforcement only, no harsh methods. My dog went from completely untrained to responding to basic commands. Great investment!',
      author: 'Emma Rodriguez',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      category: 'reviews',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      likes: 56,
      likedBy: [],
      comments: [
        {
          id: 'c13',
          postId: '8',
          author: 'James Wilson',
          authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          content: 'How much was the course? Looking for training for my puppy.',
          timestamp: new Date(Date.now() - 71 * 60 * 60 * 1000),
          likes: 2
        },
        {
          id: 'c14',
          postId: '8',
          author: 'Emma Rodriguez',
          authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
          content: 'It was £180 for 6 weeks, 1 hour per week. Worth every penny!',
          timestamp: new Date(Date.now() - 70 * 60 * 60 * 1000),
          likes: 7
        }
      ],
      isBookmarked: true,
      tags: ['training', 'obedience', 'positive-reinforcement', 'rescue-dog']
    },
    {
      id: '9',
      title: '🐾 Puppy Training Tips: First Week Success!',
      content: 'Just got my 8-week-old Golden Retriever puppy and wanted to share what\'s working for us! Crate training is going great - we\'re using positive reinforcement with treats and praise. Potty training is about 80% there. Any other new puppy owners want to share their experiences?',
      author: 'Alex Rivera',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      category: 'training',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      likes: 38,
      likedBy: [],
      comments: [
        {
          id: 'c15',
          postId: '9',
          author: 'Maria Santos',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          content: 'Congrats on the new puppy! How long are you keeping him in the crate?',
          timestamp: new Date(Date.now() - 95 * 60 * 60 * 1000),
          likes: 4
        },
        {
          id: 'c16',
          postId: '9',
          author: 'Alex Rivera',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          content: 'We started with 30 minutes and gradually increased. He\'s now comfortable for 2-3 hours!',
          timestamp: new Date(Date.now() - 94 * 60 * 60 * 1000),
          likes: 6
        }
      ],
      isBookmarked: false,
      tags: ['puppy', 'crate-training', 'potty-training', 'golden-retriever', 'new-owner']
    },
    {
      id: '10',
      title: '🎯 Advanced Agility Training: Building Confidence',
      content: 'My Border Collie has mastered basic obedience and we\'re moving into agility training. We\'re working on weave poles and jumps. The key is building her confidence - she was scared of the tunnel at first but now loves it! Anyone else doing agility training? Tips welcome!',
      author: 'Rachel Green',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      category: 'training',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      likes: 52,
      likedBy: [],
      comments: [
        {
          id: 'c17',
          postId: '10',
          author: 'Chris Taylor',
          authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          content: 'We\'re at the same stage! Try using a target stick for the weave poles - it really helps!',
          timestamp: new Date(Date.now() - 119 * 60 * 60 * 1000),
          likes: 7
        },
        {
          id: 'c18',
          postId: '10',
          author: 'Rachel Green',
          authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          content: 'Great tip! I\'ll definitely try that. How long did it take you to get the timing right?',
          timestamp: new Date(Date.now() - 118 * 60 * 60 * 1000),
          likes: 3
        }
      ],
      isBookmarked: true,
      tags: ['agility', 'border-collie', 'weave-poles', 'confidence-building', 'advanced-training']
    }
  ]
  })

  const addPost = (post: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'likedBy' | 'comments' | 'isBookmarked'>) => {
    console.log('Creating new community post:', post)
    const newPost: CommunityPost = {
      ...post,
      id: Date.now().toString(),
      timestamp: new Date(),
      likes: 0,
      likedBy: [],
      comments: [],
      isBookmarked: false
    }
    console.log('New post created:', newPost)
    setPosts(prev => {
      const updated = [newPost, ...prev]
      console.log('Saving posts to localStorage:', updated)
      localStorage.setItem('communityPosts', JSON.stringify(updated))
      return updated
    })
  }

  const deletePost = (postId: string) => {
    console.log('Deleting post:', postId)
    setPosts(prev => {
      const updated = prev.filter(post => post.id !== postId)
      console.log('Saving updated posts to localStorage:', updated)
      localStorage.setItem('communityPosts', JSON.stringify(updated))
      return updated
    })
  }

  /**
   * FUNCTION: Toggle like/unlike for a post
   * Implements one-like-per-user functionality
   * - If user hasn't liked: adds like and user to likedBy array
   * - If user has liked: removes like and user from likedBy array
   * @param postId - ID of the post to like/unlike
   */
  const likePost = (postId: string) => {
    const currentUserId = 'current-user' // In a real app, this would come from auth context
    setPosts(prev => {
      const updated = prev.map(post => {
        if (post.id === postId) {
          // Ensure likedBy array exists (safety check for old posts)
          const likedBy = post.likedBy || []
          const isLiked = likedBy.includes(currentUserId)
          if (isLiked) {
            // Unlike: remove user from likedBy and decrease likes
            return {
              ...post,
              likedBy: likedBy.filter(id => id !== currentUserId),
              likes: Math.max(0, post.likes - 1)
            }
          } else {
            // Like: add user to likedBy and increase likes
            return {
              ...post,
              likedBy: [...likedBy, currentUserId],
              likes: post.likes + 1
            }
          }
        }
        return post
      })
      localStorage.setItem('communityPosts', JSON.stringify(updated))
      return updated
    })
  }

  /**
   * FUNCTION: Check if current user has liked a specific post
   * Used to determine heart button color (red if liked, gray if not)
   * @param postId - ID of the post to check
   * @returns boolean - true if user has liked the post
   */
  const isPostLiked = (postId: string) => {
    const currentUserId = 'current-user' // In a real app, this would come from auth context
    const post = posts.find(p => p.id === postId)
    return post && post.likedBy ? post.likedBy.includes(currentUserId) : false
  }

  /**
   * FUNCTION: Toggle bookmark status for a post
   * Saves/unsaves posts for later viewing
   * - If not bookmarked: adds bookmark (turns icon teal/filled)
   * - If bookmarked: removes bookmark (turns icon gray/outlined)
   * @param postId - ID of the post to bookmark/unbookmark
   */
  const bookmarkPost = (postId: string) => {
    setPosts(prev => {
      const updated = prev.map(post => 
        post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
      )
      localStorage.setItem('communityPosts', JSON.stringify(updated))
      return updated
    })
  }

  const addComment = (postId: string, comment: Omit<Comment, 'id' | 'postId' | 'timestamp' | 'likes' | 'likedBy'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      postId,
      timestamp: new Date(),
      likes: 0,
      likedBy: []
    }
    
    setPosts(prev => {
      const updated = prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
      localStorage.setItem('communityPosts', JSON.stringify(updated))
      return updated
    })
  }

  const likeComment = (postId: string, commentId: string) => {
    const currentUserId = 'current-user' // In a real app, this would come from auth context
    
    setPosts(prev => {
      const updated = prev.map(post => 
        post.id === postId 
          ? {
              ...post,
              comments: post.comments.map(comment => {
                if (comment.id === commentId) {
                  const likedBy = comment.likedBy || []
                  const hasLiked = likedBy.includes(currentUserId)
                  
                  // Toggle like: if already liked, unlike; if not liked, like
                  if (hasLiked) {
                    return {
                      ...comment,
                      likes: Math.max(0, comment.likes - 1),
                      likedBy: likedBy.filter(id => id !== currentUserId)
                    }
                  } else {
                    return {
                      ...comment,
                      likes: comment.likes + 1,
                      likedBy: [...likedBy, currentUserId]
                    }
                  }
                }
                return comment
              })
            }
          : post
      )
      localStorage.setItem('communityPosts', JSON.stringify(updated))
      return updated
    })
  }

  const getPostsByCategory = (category: string) => {
    if (category === 'all') return posts
    return posts.filter(post => post.category === category)
  }

  const getTrendingPosts = () => {
    return [...posts]
      .sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length))
      .slice(0, 5)
  }

  const isCommentLiked = (postId: string, commentId: string) => {
    const currentUserId = 'current-user'
    const post = posts.find(p => p.id === postId)
    if (!post) return false
    const comment = post.comments.find(c => c.id === commentId)
    return comment && comment.likedBy ? comment.likedBy.includes(currentUserId) : false
  }

  const editComment = (postId: string, commentId: string, newContent: string) => {
    setPosts(prev => {
      const updated = prev.map(post => 
        post.id === postId 
          ? {
              ...post,
              comments: post.comments.map(comment =>
                comment.id === commentId
                  ? { ...comment, content: newContent }
                  : comment
              )
            }
          : post
      )
      localStorage.setItem('communityPosts', JSON.stringify(updated))
      return updated
    })
  }

  const deleteComment = (postId: string, commentId: string) => {
    setPosts(prev => {
      const updated = prev.map(post => 
        post.id === postId 
          ? {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            }
          : post
      )
      localStorage.setItem('communityPosts', JSON.stringify(updated))
      return updated
    })
  }

  const value: CommunityContextType = {
    posts,
    addPost,
    deletePost,
    likePost,
    isPostLiked,
    bookmarkPost,
    addComment,
    editComment,
    deleteComment,
    likeComment,
    isCommentLiked,
    getPostsByCategory,
    getTrendingPosts
  }

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

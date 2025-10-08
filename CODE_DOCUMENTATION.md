# Pawmatch™ Code Documentation

## 📋 Overview
This document provides a comprehensive guide to the Pawmatch™ codebase, explaining the architecture, key components, and functionality for developers and stakeholders.

## 🏗️ Architecture

### Core Technologies
- **React 18** - Frontend framework with hooks and functional components
- **TypeScript** - Type safety and better developer experience
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing and navigation
- **Lucide React** - Consistent icon library
- **Tailwind CSS** - Utility-first styling framework

### State Management
- **React Context API** - Global state management for:
  - Events (EventsContext)
  - Community Posts (CommunityContext)
  - Health Data (HealthContext)
  - User Preferences (localStorage)

### Data Persistence
- **localStorage** - Client-side persistence for:
  - User preferences and filters
  - Matched dogs and connections
  - Community posts and likes
  - Health records and appointments
  - Events and bookings

## 📱 Key Features

### 1. Dog Matching System
- **30 diverse dog profiles** with photos, bios, and details
- **Swipe interface** - Left to pass, right to like
- **Preference filtering** - Size, energy, distance, age
- **Match persistence** - Saves matches across sessions
- **Event suggestions** - Shows relevant events after matches

### 2. Community Hub
- **Post creation** - Users can create posts in 6 categories
- **Like system** - One like per user, heart turns red when liked
- **Commenting** - Full commenting system with likes
- **Bookmarking** - Save posts for later
- **Sharing** - Native Web Share API integration

### 3. Health Management
- **Health dashboard** - Comprehensive pet health overview
- **Quick actions** - Set reminders, call vet, find vet, emergency
- **Vaccination tracking** - Upcoming and overdue vaccinations
- **Medication management** - Active medications and schedules
- **Appointment scheduling** - Vet appointment management

### 4. Event System
- **Event creation** - Users can create dog meetup events
- **Event joining** - Join/leave events with capacity limits
- **Event commenting** - Comment on events with likes
- **Event suggestions** - Smart suggestions based on dog profiles

## 🗂️ File Structure

```
src/
├── components/           # Reusable UI components
│   ├── SwipeInterface.tsx     # Core dog swiping functionality
│   ├── HealthDashboard.tsx    # Health management interface
│   ├── DogProfileCard.tsx     # Individual dog profile display
│   └── ...
├── contexts/             # Global state management
│   ├── EventsContext.tsx      # Event data and functions
│   ├── CommunityContext.tsx   # Community posts and interactions
│   └── HealthContext.tsx      # Health data management
├── pages/               # Main application pages
│   ├── DiscoverPage.tsx       # Dog matching interface
│   ├── CommunityPage.tsx      # Community hub
│   ├── EventsPage.tsx         # Events listing
│   └── HealthPage.tsx         # Health management
└── App.tsx              # Main application component
```

## 🔧 Key Components Explained

### DiscoverPage.tsx
**Purpose**: Main dog matching interface
**Key Features**:
- Loads 30 dog profiles from mockDogs array
- Filters dogs based on user preferences
- Handles like/dislike actions
- Manages match persistence
- Shows loading states and modals

**State Management**:
- `dogs`: All available dog profiles (30 total)
- `filteredDogs`: Dogs matching user preferences
- `connections`: User's matched dogs
- `preferences`: User's filtering settings

### CommunityContext.tsx
**Purpose**: Manages community posts and interactions
**Key Features**:
- Like/unlike functionality with user tracking
- Comment system with likes
- Bookmark functionality
- Data persistence to localStorage

**Innovation**: Implements one-like-per-user system using `likedBy` array

### SwipeInterface.tsx
**Purpose**: Core dog swiping functionality
**Key Features**:
- Touch/drag support with visual feedback
- Button fallbacks for accessibility
- Match/dislike animations
- Undo functionality
- Event suggestions integration

## 🎯 Business Logic

### Dog Matching Algorithm
1. Load 30 dog profiles from mockDogs array
2. Filter based on user preferences (size, energy, distance, age)
3. Display filtered dogs in swipe interface
4. Handle like/dislike actions
5. Save matches to localStorage
6. Show event suggestions for matches

### Like System Implementation
1. Track user likes in `likedBy` array
2. Check if user has liked post using `isPostLiked()`
3. Toggle like/unlike using `likePost()`
4. Update UI to show red heart when liked
5. Persist like data to localStorage

### Health Management Flow
1. Display health dashboard with metrics
2. Show quick action buttons (reminders, vet calls, emergencies)
3. Handle quick action clicks with modal dialogs
4. Integrate with health context for data management
5. Provide emergency contact functionality

## 🚀 Performance Optimizations

- **useMemo** for expensive filtering operations
- **useCallback** for event handlers to prevent re-renders
- **localStorage** for data persistence without server calls
- **Framer Motion** for smooth animations
- **Lazy loading** for images and components

## 🔒 Security Considerations

- **Input validation** on all forms
- **XSS prevention** with proper data sanitization
- **localStorage** for client-side data (no sensitive info)
- **Error boundaries** for graceful error handling

## 📊 Data Flow

```
User Action → Component → Context → localStorage
     ↓
UI Update ← State Change ← Data Processing
```

## 🛠️ Development Notes

### Debugging
- Console logs for key actions (matches, likes, saves)
- localStorage inspection for data persistence
- React DevTools for state inspection

### Testing
- Manual testing of all user flows
- localStorage persistence verification
- Cross-browser compatibility testing

### Future Enhancements
- Real backend integration
- User authentication system
- Real-time notifications
- Advanced filtering options
- Photo upload functionality

## 📞 Support

For questions about the codebase:
1. Check component comments for detailed explanations
2. Review this documentation for architecture overview
3. Use browser dev tools for debugging
4. Check localStorage for data persistence issues

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintainer**: Development Team


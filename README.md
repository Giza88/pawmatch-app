# 🐾 Pawmatch™

A community-driven dog matching application that helps dog owners find perfect playmates for their furry friends.

## ✨ Features

### 🎯 Core Features (Implemented)
- **Swipe-Style Dog Profile Matching** - Tinder-like interface for discovering dogs
- **Multi-Step Onboarding Flow** - Beautiful 3-step account creation process
- **Responsive Design** - Mobile-first design that works on all devices
- **Smooth Animations** - Powered by Framer Motion for delightful interactions

### 🚧 Coming Soon
- **Walks & Meetups Board** - Create and join dog-friendly events
- **Community Chat Boards** - Local discussion forums for dog owners
- **Vet & Health Dashboard** - Track vaccinations and health records
- **Real-time GPS Tracking** - Optional hardware integration for lost dog alerts

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pawfect-match
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── DogProfileCard.tsx    # Individual dog profile display
│   ├── SwipeInterface.tsx    # Main swipe matching interface
│   ├── BottomNavigation.tsx  # Bottom navigation bar
│   └── OnboardingFlow.tsx    # 3-step onboarding process
├── pages/              # Main app pages
│   ├── DiscoverPage.tsx      # Main matching interface
│   ├── EventsPage.tsx        # Events and meetups (placeholder)
│   ├── CommunityPage.tsx     # Community features (placeholder)
│   ├── HealthPage.tsx        # Health tracking (placeholder)
│   └── ProfilePage.tsx       # User profile (placeholder)
├── App.tsx            # Main app component with routing
└── main.tsx           # App entry point
```

## 🎨 Design System

### Colors
- **Primary**: Green (`#22c55e`) - Used for buttons, active states, and accents
- **Neutral**: Gray scale for text, backgrounds, and borders
- **Semantic**: Red for dislikes, green for likes, orange for tips

### Components
- **Buttons**: Primary (green) and secondary (gray) variants
- **Cards**: White backgrounds with subtle shadows and rounded corners
- **Inputs**: Clean forms with focus states and icons

## 🔄 Development Workflow

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `App.tsx`
4. Add navigation items in `BottomNavigation.tsx`

## 📸 Screenshots

The app includes:
- **Onboarding Flow**: 3-step account creation with user and dog information
- **Discover Page**: Swipe interface with dog profiles and matching
- **Navigation**: Bottom navigation with 5 main sections
- **Responsive Design**: Mobile-first approach with touch-friendly interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Dog photos from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- Animation library [Framer Motion](https://www.framer.com/motion/)

---

**Made with ❤️ for dog lovers everywhere**

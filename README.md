# MyGallery 📱

A modern, cross-platform mobile gallery application built with React Native and Expo, featuring image management, authentication, and a beautiful theming system.

## 🚀 Features

- **Cross-Platform**: iOS, Android, and Web support
- **Image Management**: Capture photos, select from gallery, and organize images
- **Dark/Light Theme**: Adaptive theming with system preference detection
- **Mock Authentication**: Secure user authentication system (currently using mock auth)
- **Responsive UI**: Beautiful, intuitive interface with React Navigation
- **Docker Support**: Containerized development and deployment
- **TypeScript**: Fully typed codebase for better development experience

## 🏗️ Design Choices

### Architecture Patterns

**1. Context-Based State Management**

- Used React Context API for global state management instead of Redux
- Separate contexts for Auth, Gallery, and Theme management
- Provides better component isolation and reduced boilerplate

**2. Service Layer Pattern**

- Singleton pattern for services (AuthService, ImageService, StorageService)
- Clean separation between business logic and UI components
- Easy to mock and test individual services

**3. Hook-Based Architecture**

- Custom hooks (`useAuth`, `useGallery`, `useTheme`) for business logic
- Promotes code reusability and cleaner component structure
- Follows React best practices for state management

**4. Navigation Structure**

- Stack navigation for screens with logical flow
- Tab navigation for main app sections
- Nested navigators for complex navigation scenarios

### Technology Stack

**Frontend Framework**: React Native + Expo

- **Pros**: Cross-platform development, rapid prototyping, rich ecosystem
- **Cons**: Limited native module access, bundle size considerations

**State Management**: React Context + Hooks

- **Pros**: Built-in React features, no external dependencies, simple setup
- **Cons**: Can cause re-renders if not optimized, not ideal for very complex state

**Storage**: AsyncStorage

- **Pros**: Simple key-value storage, works across platforms
- **Cons**: Limited querying capabilities, no relational data support

**Authentication**: Mock Authentication (Placeholder for OAuth)

- **Pros**: Easy development and testing, no external dependencies
- **Cons**: Not production-ready, requires real authentication integration

## ⚖️ Trade-offs & Limitations

### Current Limitations

1. **Authentication System**

   - Currently uses mock authentication for development
   - Real Google OAuth integration is prepared but commented out
   - **Impact**: Not production-ready for real user authentication

2. **Data Persistence**

   - Uses local AsyncStorage only
   - No cloud synchronization or backup
   - **Impact**: Data loss on app uninstall, no cross-device sync

3. **Image Storage**

   - Images stored locally on device
   - No cloud storage integration
   - **Impact**: Limited storage capacity, no backup

4. **Offline Capability**
   - Limited offline functionality
   - No sync mechanism when back online
   - **Impact**: Data inconsistency in poor network conditions

### Technical Trade-offs

1. **Context vs Redux**

   - **Chosen**: React Context for simplicity
   - **Trade-off**: Potential performance issues with frequent updates
   - **Mitigation**: Separate contexts for different concerns

2. **Expo vs React Native CLI**

   - **Chosen**: Expo for faster development
   - **Trade-off**: Limited native module access
   - **Benefit**: Easier builds, OTA updates, cross-platform consistency

3. **AsyncStorage vs SQLite**
   - **Chosen**: AsyncStorage for simplicity
   - **Trade-off**: No relational queries, limited data structure
   - **Benefit**: Simple setup, platform-agnostic

## 🎯 Bonus Features Implemented

### 1. **Docker Containerization** 🐳

- Full Docker support with multi-stage builds
- Development and production docker-compose configurations
- Health checks and proper networking setup
- Easy deployment and environment consistency

### 2. **Advanced Theming System** 🎨

- Dynamic dark/light mode switching
- System preference detection
- Persistent theme selection
- Comprehensive design system with colors, spacing, and typography

### 3. **Cross-Platform Web Support** 🌐

- React Native Web integration
- Responsive design for web browsers
- Consistent UI/UX across all platforms

### 4. **TypeScript Integration** 📝

- Fully typed codebase
- Strong type safety for better development experience
- Comprehensive interface definitions

### 5. **Modern Navigation** 🧭

- Stack and Tab navigation combination
- Nested navigation structures
- Platform-specific navigation behaviors

### 6. **Image Handling** 📸

- Multiple image source options (camera, gallery)
- Proper permission handling
- Cross-platform image picker integration

### 7. **Development Tools** 🛠️

- ESLint configuration for code quality
- Development and production build configurations
- EAS (Expo Application Services) integration for building

### 8. **Error Handling & Logging** 🐛

- Comprehensive error handling throughout the app
- Detailed logging for debugging
- User-friendly error messages

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI
- Docker (optional, for containerized development)

### Installation

1. **Clone and Install**

```bash
git clone <repository-url>
cd MyGallery
npm install
```

2. **Start Development Server**

```bash
npm start
```

3. **Run on Platform**

```bash
npm run android  # Android
npm run ios      # iOS
npm run web      # Web Browser
```

### Docker Development

```bash
# Development with hot reload
npm run docker:dev

# Production build
npm run docker:build
npm run docker:run
```

## 📱 Platform Support

- **iOS**: ✅ Native iOS app
- **Android**: ✅ Native Android app
- **Web**: ✅ Progressive Web App
- **Desktop**: 🔄 Possible with Electron (not implemented)

## 🔮 Future Enhancements

1. **Real Authentication**: Google/Apple OAuth integration
2. **Cloud Storage**: Firebase/AWS S3 for image storage
3. **Social Features**: Image sharing and collaboration
4. **Advanced Editing**: In-app image editing tools
5. **Offline Sync**: Background synchronization
6. **Push Notifications**: Real-time updates
7. **Analytics**: User behavior tracking
8. **Performance**: Image optimization and caching

## 🏛️ Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── navigation/    # Navigation configuration
├── screens/       # Screen components
├── services/      # Business logic services
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

**Note**: This application is currently in development mode with mock authentication. For production deployment, implement real authentication and cloud storage solutions.

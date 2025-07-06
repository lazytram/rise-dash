# Rise Dash - Platform Game

A Next.js TypeScript platform game where players must travel as far as possible without dying.

## 🚀 Features

- Canvas-based 2D gameplay
- Physics system with gravity and jumping
- Distance tracking
- Keyboard controls (SPACEBAR to jump)
- Responsive design with Tailwind CSS
- Vercel deployment ready

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Game.tsx          # Main game component
│   ├── GameCanvas.tsx    # Canvas wrapper component
│   └── GameUI.tsx        # Game UI component
├── types/                 # TypeScript interfaces
│   └── game.ts           # Game-related types
├── constants/             # App constants
│   └── game.ts           # Game constants and colors
├── utils/                 # Utility functions
│   ├── gameLogic.ts      # Game logic and physics
│   └── gameRenderer.ts   # Canvas rendering logic
└── hooks/                 # Custom React hooks
    ├── useKeyboardControls.ts # Keyboard input handling
    └── useGameLoop.ts         # Game loop management
```

## 🎮 How to Play

1. Press **SPACEBAR** to start the game
2. Press **SPACEBAR** to make your character jump
3. Avoid obstacles and try to travel as far as possible
4. Your distance is tracked in meters

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Deployment

This project is optimized for Vercel deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel
```

## 🏛️ Architecture

The game is built with a modular architecture:

- **Components**: UI components separated by responsibility
- **Hooks**: Custom hooks for game logic (keyboard controls, game loop)
- **Utils**: Pure functions for game logic and rendering
- **Types**: TypeScript interfaces for type safety
- **Constants**: Centralized configuration

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Canvas API** for game graphics
- **Responsive design** for different screen sizes

## 📦 Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Canvas API** - 2D graphics
- **Vercel** - Deployment platform

## 🔄 Future Enhancements

- [ ] Add obstacles and enemies
- [ ] Implement collision detection
- [ ] Add power-ups and collectibles
- [ ] High score system
- [ ] Sound effects and music
- [ ] Multiple game levels
- [ ] Multiplayer support

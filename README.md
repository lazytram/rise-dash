# Rise Dash 🎮

A modern 2D platform game built with Next.js and TypeScript. Jump over sushi obstacles and shoot rice rockets in this addictive endless runner!

![Game Preview](public/pfp.png)

## ✨ Features

- **Canvas-based 2D gameplay** with smooth animations
- **Physics system** with gravity and jump mechanics
- **Sushi obstacles** with collision detection system
- **Rice rocket shooting** system for combat
- **Multi-language support** (English, Spanish, French)
- **Distance tracking** and scoring system
- **Responsive design** optimized for all devices
- **Comprehensive testing** with Jest and Testing Library

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd rise-dash

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play!

## 🎯 How to Play

1. **Start**: Press `ARROW UP` or `SPACEBAR` to begin the game
2. **Jump**: Press `ARROW UP` to make your character jump over sushi obstacles
3. **Shoot**: Press `SPACEBAR` to fire rice rockets (during gameplay)
4. **Avoid**: Stay away from sushi obstacles - touching them ends the game!
5. **Survive**: Travel as far as possible to increase your distance score
6. **Game Over**: When you die, see your final score and press `ARROW UP` or `SPACEBAR` to restart
7. **Language**: Switch between English, Spanish, and French in the UI

## 🏗️ Project Architecture

```
src/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── Game.tsx           # Main game component
│   ├── GameCanvas.tsx     # Canvas rendering
│   ├── GameUI.tsx         # User interface
│   └── LanguageSelector.tsx # Language switcher
├── entities/              # Game entities
│   └── player.ts          # Player configuration
├── hooks/                 # Custom React hooks
│   ├── useGameLoop.ts     # Game loop management
│   ├── useKeyboardControls.ts # Input handling
│   └── useTranslations.ts # Internationalization
├── languages/             # Translation files
├── store/                 # State management (Zustand)
├── types/                 # TypeScript interfaces
├── utils/                 # Game logic and rendering
└── constants/             # Game configuration
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report
```

### Key Technologies

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[next-intl](https://next-intl-docs.vercel.app/)** - Internationalization
- **[Jest](https://jestjs.io/)** - Testing framework
- **Canvas API** - 2D graphics rendering

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test files are located alongside their respective source files in `__tests__/` directories.

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Other Platforms

The project can be deployed to any platform that supports Node.js applications:

```bash
npm run build
npm start
```

## �️ Roadmap

- [ ] **Enhanced Gameplay**
  - [ ] Multiple obstacle types
  - [ ] Power-ups and special abilities
  - [ ] Different game modes
- [ ] **Features**
  - [ ] High score leaderboard
  - [ ] Sound effects and music
  - [ ] Achievement system
- [ ] **Technical**
  - [ ] Performance optimizations
  - [ ] Mobile app version
  - [ ] Multiplayer support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

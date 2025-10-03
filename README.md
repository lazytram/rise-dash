# 🌾 Rise Dash - The Ultimate Web3 Gaming Experience! 🎮

> **Jump into the future of gaming!** Rise Dash combines the thrill of endless runner gameplay with the power of blockchain technology. Dodge sushi, shoot rice rockets, and compete on the decentralized leaderboard in this addictive Web3 adventure!

<img src="public/pfp.png" alt="Game Preview" width="400" />

## 🎯 What is Rise Dash?

Rise Dash is a revolutionary **Web3-powered endless runner** that brings together:

- **Addictive 2D gameplay** with smooth 60fps animations
- **Blockchain integration** for true ownership and rewards
- **Decentralized leaderboards** with verified scores
- **RICE token economy** for in-game rewards and upgrades
- **Beautiful Japanese aesthetic** with Torii gates and sushi enemies

**The Concept:** You're a brave warrior running through a mystical Japanese landscape, dodging sushi enemies and shooting rice rockets. Your mission? Travel as far as possible while earning RICE tokens and climbing the global leaderboard!

---

## ✨ Features

### Core Gameplay

- **Smooth 60fps Canvas Rendering** - Buttery smooth animations that feel incredible
- **Realistic Physics System** - Gravity, momentum, and collision detection that feels natural
- **Endless Runner Mechanics** - Increasing difficulty keeps you on the edge of your seat
- **Rice Rocket Combat** - Shoot enemies with rice rockets for points and survival
- **Dynamic Collision Detection** - Pixel-perfect hit detection for fair gameplay
- **Real-time Scoring** - Watch your score climb as you survive longer

### RICE Token Economy

- **Earn RICE Tokens** - Complete daily challenges and achieve high scores
- **Power-Up Shop** - Spend RICE to upgrade your abilities
- **Daily Reveals** - Claim daily rewards with randomized card reveals
- **Blockchain Storage** - All rewards stored securely on the RISE blockchain
- **Signature Verification** - Secure, tamper-proof reward distribution

### Daily Reveal System

- **Card Reveal Mechanics** - Exciting card-flipping animations
- **24-Hour Cooldown** - Come back daily for fresh rewards
- **Randomized Rewards** - Different RICE amounts each day
- **Mobile-Friendly** - Perfect for quick daily check-ins
- **Blockchain Verification** - Secure, tamper-proof daily claims

### Power-Up System

- **🛡️ Shield Protection** - Invincibility against enemy collisions
- **♾️ Infinite Ammo** - Unlimited rice rocket shots
- **🦘 Jump Boost** - Higher jumps to avoid obstacles
- **⏰ Slow Motion** - Slow down enemies for easier targeting
- **🎯 Multi-Shot** - Fire multiple projectiles simultaneously
- **📈 10-Level Progression** - Each power-up has 10 upgrade levels
- **💰 RICE-Based Upgrades** - Spend tokens to enhance your abilities

### Power-Up Shop

- **Interactive Shop Interface** - Beautiful, intuitive upgrade system
- **Dynamic Pricing** - Costs increase with each level
- **Progress Tracking** - See your upgrade progression
- **Instant Upgrades** - Immediate effect after purchase
- **Strategic Choices** - Choose which power-ups to prioritize

### Interactive Tutorial

- **Auto-Show Tutorial** - Automatically appears for new players
- **Comprehensive Guide** - Covers all game mechanics
- **Step-by-Step Instructions** - Easy to follow learning path
- **Beautiful UI** - Engaging tutorial interface
- **Manual Access** - Replay tutorial anytime

### Enhanced Leaderboard

- **Global Rankings** - Compete with players worldwide
- **Real-time Updates** - Live leaderboard updates
- **Player Profiles** - View detailed player statistics
- **Score Verification** - Blockchain-verified scores only
- **Pagination** - Browse through all players easily

### Player Profiles

- **Game Statistics** - Track your best scores and averages
- **Game History** - Review all your past games
- **Achievements** - Unlock achievements as you play
- **Performance Analytics** - Detailed performance metrics
- **Personal Leaderboard** - Your ranking and progress

### Web3 Integration

- **Wallet Connection** - Connect with MetaMask, RainbowKit, and more
- **Sign-In with Ethereum** - Secure, decentralized authentication
- **Blockchain Verification** - All scores verified on-chain
- **RISE Testnet Integration** - Built on the RISE blockchain
- **Smart Contract Security** - Audited, secure smart contracts

### User Experience

- **Dark Theme** - Easy on the eyes with gradient backgrounds
- **Multi-Language Support** - English, Spanish, and French
- **Responsive Design** - Works perfectly on desktop and mobile
- **Accessibility Features** - Keyboard navigation and screen reader support
- **Smooth Animations** - Polished, professional feel

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **MetaMask** or any Web3 wallet
- **RISE Testnet** configured in your wallet

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd rise-dash

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start your adventure!

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Blockchain Configuration
NEXT_PUBLIC_RISE_TESTNET_RPC=https://rpc.testnet.rise.xyz
NEXT_PUBLIC_CONTRACT_ADDRESS=your-contract-address
```

---

## 🎮 How to Play

### Getting Started

1. **Connect Wallet** - Click "Connect Wallet" and sign in with your Web3 wallet
2. **Authenticate** - Sign the SIWE message to verify your wallet ownership
3. **Start Game** - Press `ARROW UP` or `SPACEBAR` to begin your adventure!

### Gameplay Controls

- **Jump**: Press `ARROW UP` to leap over sushi obstacles
- **Shoot**: Press `SPACEBAR` to fire rice rockets at enemies
- **Pause**: Press `ESC` to pause the game
- **Restart**: Press `ARROW UP` or `SPACEBAR` after game over

### Your Mission

- **Survive**: Travel as far as possible to increase your distance score
- **Destroy Enemies**: Use rice rockets to eliminate obstacles and earn points
- **Use Power-Ups**: Collect and activate power-ups for temporary advantages
- **Compete**: Submit your score to the blockchain leaderboard
- **Earn RICE**: Complete daily challenges and achieve high scores

### Daily Rewards

- **Daily Reveal**: Claim your daily reward with exciting card reveals
- **24-Hour Cooldown**: Return daily for fresh rewards
- **Randomized Rewards**: Different RICE amounts each day
- **Secure Claims**: All rewards verified on the blockchain

### Power-Up Strategy

- **🛡️ Shield**: Perfect for beginners - protects against collisions
- **♾️ Infinite Ammo**: Great for aggressive players who love shooting
- **🦘 Jump Boost**: Essential for avoiding difficult obstacles
- **⏰ Slow Motion**: Tactical advantage for precise targeting
- **🎯 Multi-Shot**: Advanced players can eliminate multiple enemies

### Shop Strategy

- **Budget Wisely**: RICE is earned through gameplay - spend strategically
- **Focus on Favorites**: Upgrade your preferred power-ups first
- **Balance**: Don't neglect any power-up - they all have their uses
- **Immediate Impact**: Upgrades take effect instantly

---

## 🏗️ Project Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page with game
│   └── api/               # API routes for blockchain integration
├── features/              # Feature-based organization
│   ├── game/              # Core game components
│   ├── daily-reveal/      # Daily reward system
│   ├── shop/              # Power-up shop interface
│   ├── tutorial/          # Interactive tutorial
│   ├── leaderboard/       # Global leaderboard
│   ├── profile/           # Player profiles
│   └── auth/              # Web3 authentication
├── shared/                # Shared utilities and components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # External services
│   ├── store/             # State management (Zustand)
│   └── utils/             # Game logic and utilities
├── infrastructure/        # Infrastructure layer
│   ├── blockchain/        # Smart contract integration
│   ├── config/            # Configuration management
│   └── store/             # Global state management
└── contracts/             # Smart contracts
    ├── GameRegistry.sol   # Main game contract
    ├── RICEManager.sol    # RICE token management
    ├── PowerUpManager.sol # Power-up system
    └── ScoreBoard.sol     # Leaderboard management
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report
```

### Key Technologies

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Wagmi](https://wagmi.sh/)** - React hooks for Ethereum
- **[RainbowKit](https://www.rainbowkit.com/)** - Wallet connection UI
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication with SIWE
- **[Hardhat](https://hardhat.org/)** - Ethereum development environment
- **[Jest](https://jestjs.io/)** - Testing framework
- **Canvas API** - 2D graphics rendering

---

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

### Add a new game to Bento (Gaming Room)

Use the centralized registry so adding a game is one edit with i18n support.

1. Add translations

- Edit `src/i18n/languages/en.json` (and other locales) and provide a title and subtitle/description, for example:

```
"scenes": {
  "myNewGame": {
    "title": "My New Game",
    "subtitle": "Short catchy description here."
  }
}
```

2. Register the game in the Bento registry

- Edit `src/features/gaming-room/miniGames.registry.ts` and append an entry:

```ts
{
  id: "my-new-game",
  titleKey: "scenes.myNewGame.title",
  descriptionKey: "scenes.myNewGame.subtitle",
  scene: SceneType.MY_NEW_GAME, // optional; omit for coming soon
  status: "available", // or "coming_soon"
  icon: "🎯", // optional
}
```

3. Wire a scene (optional if coming soon)

- Create a scene component under `src/features/<your-game>/<YourGame>Scene.tsx`.
- Add a SceneType in `src/shared/types/scenes.ts` (e.g., `MY_NEW_GAME = "myNewGame"`).
- Register the scene in `src/features/scenes/SceneRegistry.tsx` with the component and title.

That’s it: Bento pulls from the registry and automatically renders the card and routes to your scene when available.

4. Award RICE on completion (template)

- Use the shared reward hook in your game content:

```ts
import { useGameReward } from "@/shared/hooks/useGameReward";
import { MiniGameRewardModal } from "@/shared/components/MiniGameRewardModal";

// inside your component
const reward = useGameReward({ finished, riceAmount });

// generic reward modal
<MiniGameRewardModal
  isOpen={reward.isOpen}
  onClose={reward.close}
  onSave={reward.save}
  isSaving={reward.isSaving}
  title={t("scenes.myNewGame.congrats")}
  subtitle={t("scenes.myNewGame.riceEarned", { amount: riceAmount })}
  emoji="🎯"
/>;
```

- Under the hood it calls `const { addRICE, isAdding } = useRice();` and closes the modal after awarding.

Test files are located alongside their respective source files in `__tests__/` directories.

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Set these environment variables in your deployment platform:

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
NEXT_PUBLIC_RISE_TESTNET_RPC=https://rpc.testnet.rise.xyz
NEXT_PUBLIC_CONTRACT_ADDRESS=your-deployed-contract-address
```

---

## 🎮 Game Features Deep Dive

### Physics System

- **Realistic gravity simulation** with smooth acceleration
- **Variable jump mechanics** based on power-up levels
- **Pixel-perfect collision detection** for fair gameplay
- **Momentum and velocity calculations** for natural movement

### Rendering Engine

- **60fps canvas rendering** for buttery smooth gameplay
- **Optimized sprite management** for performance
- **Smooth animations and transitions** throughout the UI
- **Responsive scaling** for all screen sizes

### Blockchain Integration

- **Real-time score submission** with gas optimization
- **Decentralized leaderboard** with verified scores
- **Wallet-based authentication** with SIWE
- **Smart contract security** with comprehensive testing

### Daily Reveal System

- **Exciting card reveal animations** with suspense
- **24-hour cooldown system** for daily engagement
- **Randomized reward distribution** for variety
- **Blockchain verification** for security

### Power-Up System

- **5 unique power-up types** with different strategies
- **10-level progression system** for long-term engagement
- **RICE-based economy** for sustainable progression
- **Immediate effect system** for instant gratification

---

## 🚧 Roadmap

### Phase 1 - Enhanced Gameplay

- [ ] Multiple obstacle types and patterns
- [ ] Boss battles and mini-games
- [ ] Different game modes (Time Attack, Survival)
- [ ] Enhanced enemy AI and behaviors

### Phase 2 - Social Features

- [ ] Achievement system with NFTs
- [ ] Tournament mode with prizes
- [ ] Social sharing and challenges
- [ ] Guild/clan system

### Phase 3 - Advanced Features

- [ ] Mobile app development
- [ ] Cross-chain integration
- [ ] Advanced power-up combinations
- [ ] Seasonal events and themes

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Update documentation as needed
- Follow the existing code style
- Add tests for new features

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Rise Protocol** for blockchain infrastructure
- **Next.js team** for the amazing framework
- **RainbowKit** for wallet integration
- **All contributors** who make this project better

---

## 🎮 Ready to Play?

**Jump into the future of gaming!**

[Start your adventure now!](https://rise-dash.vercel.app)

---

_Built with ❤️ by the Rise Dash team_

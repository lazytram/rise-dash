import { Achievement } from "./types";

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  // ================================
  // DISTANCE ACHIEVEMENTS
  // ================================
  {
    id: "first-steps",
    title: "First Steps",
    description: "Travel 100m in your first game",
    icon: "👣",
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    rarity: "common",
    category: "distance",
    reward: {
      type: "rice",
      amount: 10,
      name: "10 RICE",
    },
  },
  {
    id: "century-club",
    title: "Century Club",
    description: "Reach 100m in a single run",
    icon: "🏃",
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    rarity: "common",
    category: "distance",
    reward: {
      type: "rice",
      amount: 25,
      name: "25 RICE",
    },
  },
  {
    id: "half-thousand",
    title: "Half a Thousand",
    description: "Reach 500m in a single run",
    icon: "🏃‍♂️",
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    rarity: "rare",
    category: "distance",
    reward: {
      type: "rice",
      amount: 50,
      name: "50 RICE",
    },
  },
  {
    id: "kilometer-king",
    title: "Kilometer King",
    description: "Travel 1000m in one run",
    icon: "👑",
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    rarity: "epic",
    category: "distance",
    reward: {
      type: "rice",
      amount: 100,
      name: "100 RICE",
    },
  },
  {
    id: "marathon-runner",
    title: "Marathon Runner",
    description: "Travel 5000m total across all games",
    icon: "🏃‍♀️",
    progress: 0,
    maxProgress: 5000,
    isCompleted: false,
    rarity: "legendary",
    category: "distance",
    reward: {
      type: "title",
      amount: 0,
      name: "Marathon Runner",
    },
  },

  // ================================
  // POWER-UP COLLECTION ACHIEVEMENTS
  // ================================
  {
    id: "power-up-collector",
    title: "Power-Up Collector",
    description: "Collect your first power-up",
    icon: "⚡",
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    rarity: "common",
    category: "powerups",
    reward: {
      type: "rice",
      amount: 15,
      name: "15 RICE",
    },
  },
  {
    id: "multi-shot-fanatic",
    title: "Multi-Shot Fanatic",
    description: "Collect 20 multi-shot power-ups",
    icon: "🎯",
    progress: 0,
    maxProgress: 20,
    isCompleted: false,
    rarity: "rare",
    category: "powerups",
    reward: {
      type: "powerup",
      amount: 0,
      name: "Multi-Shot",
    },
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Collect 15 speed boost power-ups",
    icon: "💨",
    progress: 0,
    maxProgress: 15,
    isCompleted: false,
    rarity: "rare",
    category: "powerups",
    reward: {
      type: "powerup",
      amount: 0,
      name: "Speed Boost",
    },
  },
  {
    id: "shield-master",
    title: "Shield Master",
    description: "Collect 10 shield power-ups",
    icon: "🛡️",
    progress: 0,
    maxProgress: 10,
    isCompleted: false,
    rarity: "epic",
    category: "powerups",
    reward: {
      type: "powerup",
      amount: 0,
      name: "Shield",
    },
  },
  {
    id: "power-up-hoarder",
    title: "Power-Up Hoarder",
    description: "Collect 100 power-ups total",
    icon: "📦",
    progress: 0,
    maxProgress: 100,
    isCompleted: false,
    rarity: "legendary",
    category: "powerups",
    reward: {
      type: "title",
      amount: 0,
      name: "Power-Up Hoarder",
    },
  },

  // ================================
  // POWER-UP UPGRADE ACHIEVEMENTS
  // ================================
  {
    id: "upgrade-novice",
    title: "Upgrade Novice",
    description: "Upgrade your first power-up",
    icon: "🔧",
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    rarity: "common",
    category: "upgrades",
    reward: {
      type: "rice",
      amount: 20,
      name: "20 RICE",
    },
  },
  {
    id: "multi-shot-expert",
    title: "Multi-Shot Expert",
    description: "Upgrade multi-shot to max level",
    icon: "🎯",
    progress: 0,
    maxProgress: 5,
    isCompleted: false,
    rarity: "rare",
    category: "upgrades",
    reward: {
      type: "rice",
      amount: 75,
      name: "75 RICE",
    },
  },
  {
    id: "speed-boost-master",
    title: "Speed Boost Master",
    description: "Upgrade speed boost to max level",
    icon: "💨",
    progress: 0,
    maxProgress: 5,
    isCompleted: false,
    rarity: "rare",
    category: "upgrades",
    reward: {
      type: "rice",
      amount: 75,
      name: "75 RICE",
    },
  },
  {
    id: "shield-expert",
    title: "Shield Expert",
    description: "Upgrade shield to max level",
    icon: "🛡️",
    progress: 0,
    maxProgress: 5,
    isCompleted: false,
    rarity: "epic",
    category: "upgrades",
    reward: {
      type: "rice",
      amount: 100,
      name: "100 RICE",
    },
  },
  {
    id: "upgrade-master",
    title: "Upgrade Master",
    description: "Max out all power-up types",
    icon: "🔧",
    progress: 0,
    maxProgress: 15,
    isCompleted: false,
    rarity: "legendary",
    category: "upgrades",
    reward: {
      type: "title",
      amount: 0,
      name: "Upgrade Master",
    },
  },

  // ================================
  // SAMURAI ACHIEVEMENTS
  // ================================
  {
    id: "samurai-novice",
    title: "Samurai Novice",
    description: "Defeat your first samurai",
    icon: "⚔️",
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    rarity: "common",
    category: "samurai",
    reward: {
      type: "rice",
      amount: 10,
      name: "10 RICE",
    },
  },
  {
    id: "samurai-slayer",
    title: "Samurai Slayer",
    description: "Defeat 50 samurais total",
    icon: "🗡️",
    progress: 0,
    maxProgress: 50,
    isCompleted: false,
    rarity: "rare",
    category: "samurai",
    reward: {
      type: "rice",
      amount: 50,
      name: "50 RICE",
    },
  },
  {
    id: "samurai-master",
    title: "Samurai Master",
    description: "Defeat 200 samurais total",
    icon: "⚔️",
    progress: 0,
    maxProgress: 200,
    isCompleted: false,
    rarity: "epic",
    category: "samurai",
    reward: {
      type: "rice",
      amount: 150,
      name: "150 RICE",
    },
  },
  {
    id: "samurai-legend",
    title: "Samurai Legend",
    description: "Defeat 500 samurais total",
    icon: "👑",
    progress: 0,
    maxProgress: 500,
    isCompleted: false,
    rarity: "legendary",
    category: "samurai",
    reward: {
      type: "title",
      amount: 0,
      name: "Samurai Legend",
    },
  },

  // ================================
  // NINJA ACHIEVEMENTS
  // ================================
  {
    id: "ninja-novice",
    title: "Ninja Novice",
    description: "Defeat your first ninja",
    icon: "🥷",
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    rarity: "rare",
    category: "ninja",
    reward: {
      type: "rice",
      amount: 25,
      name: "25 RICE",
    },
  },
  {
    id: "ninja-hunter",
    title: "Ninja Hunter",
    description: "Defeat 25 ninjas total",
    icon: "🗡️",
    progress: 0,
    maxProgress: 25,
    isCompleted: false,
    rarity: "epic",
    category: "ninja",
    reward: {
      type: "rice",
      amount: 100,
      name: "100 RICE",
    },
  },
  {
    id: "ninja-master",
    title: "Ninja Master",
    description: "Defeat 100 ninjas total",
    icon: "🥷",
    progress: 0,
    maxProgress: 100,
    isCompleted: false,
    rarity: "legendary",
    category: "ninja",
    reward: {
      type: "title",
      amount: 0,
      name: "Ninja Master",
    },
  },

  // ================================
  // BOSS ACHIEVEMENTS
  // ================================
  {
    id: "boss-novice",
    title: "Boss Novice",
    description: "Defeat your first boss",
    icon: "👹",
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    rarity: "epic",
    category: "boss",
    reward: {
      type: "rice",
      amount: 100,
      name: "100 RICE",
    },
  },
  {
    id: "boss-hunter",
    title: "Boss Hunter",
    description: "Defeat 10 bosses total",
    icon: "👹",
    progress: 0,
    maxProgress: 10,
    isCompleted: false,
    rarity: "legendary",
    category: "boss",
    reward: {
      type: "rice",
      amount: 500,
      name: "500 RICE",
    },
  },
  {
    id: "boss-slayer",
    title: "Boss Slayer",
    description: "Defeat 25 bosses total",
    icon: "👑",
    progress: 0,
    maxProgress: 25,
    isCompleted: false,
    rarity: "legendary",
    category: "boss",
    reward: {
      type: "title",
      amount: 0,
      name: "Boss Slayer",
    },
  },
];

// ================================
// FILTER OPTIONS
// ================================
export const FILTER_OPTIONS = [
  { value: "all" as const, label: "All", icon: "📋" },
  { value: "completed" as const, label: "Completed", icon: "✅" },
  { value: "in-progress" as const, label: "In Progress", icon: "🔄" },
] as const;

// ================================
// RARITY OPTIONS
// ================================
export const RARITY_OPTIONS = [
  { value: "all" as const, label: "All", color: "bg-gray-500", icon: "⭐" },
  {
    value: "common" as const,
    label: "Common",
    color: "bg-gray-400",
    icon: "🔰",
  },
  { value: "rare" as const, label: "Rare", color: "bg-blue-400", icon: "💎" },
  { value: "epic" as const, label: "Epic", color: "bg-purple-400", icon: "👑" },
  {
    value: "legendary" as const,
    label: "Legendary",
    color: "bg-yellow-400",
    icon: "🔥",
  },
] as const;

// ================================
// CATEGORY OPTIONS
// ================================
export const CATEGORY_OPTIONS = [
  { value: "all" as const, label: "All", icon: "📋", color: "bg-gray-500" },
  {
    value: "distance" as const,
    label: "Distance",
    icon: "🏃",
    color: "bg-green-500",
  },
  {
    value: "powerups" as const,
    label: "Power-Ups",
    icon: "⚡",
    color: "bg-blue-500",
  },
  {
    value: "upgrades" as const,
    label: "Upgrades",
    icon: "🔧",
    color: "bg-purple-500",
  },
  {
    value: "samurai" as const,
    label: "Samurai",
    icon: "⚔️",
    color: "bg-red-500",
  },
  { value: "ninja" as const, label: "Ninja", icon: "🥷", color: "bg-gray-600" },
  { value: "boss" as const, label: "Boss", icon: "👹", color: "bg-orange-500" },
] as const;

// ================================
// COLORS AND LABELS
// ================================
export const RARITY_COLORS = {
  common: {
    bg: "bg-gray-500/20",
    border: "border-gray-500/50",
    text: "text-gray-300",
    progress: "bg-gray-500",
  },
  rare: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/50",
    text: "text-blue-300",
    progress: "bg-blue-500",
  },
  epic: {
    bg: "bg-purple-500/20",
    border: "border-purple-500/50",
    text: "text-purple-300",
    progress: "bg-purple-500",
  },
  legendary: {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/50",
    text: "text-yellow-300",
    progress: "bg-yellow-500",
  },
} as const;

export const RARITY_LABELS = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
} as const;

export const CATEGORY_LABELS = {
  distance: "Distance",
  powerups: "Power-Ups",
  upgrades: "Upgrades",
  samurai: "Samurai",
  ninja: "Ninja",
  boss: "Boss",
} as const;

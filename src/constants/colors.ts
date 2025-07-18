// UI Colors
export const UI_COLORS = {
  // Gradient colors
  GRADIENT_FROM: "#3a1344", // Dark violet
  GRADIENT_VIA: "#7967e5", // Bright violet
  GRADIENT_TO: "#99eafc", // Light cyan blue

  // Text colors
  TEXT_PRIMARY: "#ffffff", // White
  TEXT_SECONDARY: "#e5e7eb", // Light gray

  // Button colors
  BUTTON_BG: "#ffffff", // White
  BUTTON_TEXT: "#2563eb", // Blue
  BUTTON_HOVER: "#f3f4f6", // Light gray
} as const;

// Scene Header Colors
export const SCENE_COLORS = {
  // Profile scene - Purple theme
  PROFILE: {
    GRADIENT_FROM: "#8B5CF6", // Purple
    GRADIENT_VIA: "#A855F7", // Light purple
    GRADIENT_TO: "#C084FC", // Lighter purple
  },
  // Leaderboard scene - Green theme
  LEADERBOARD: {
    GRADIENT_FROM: "#10B981", // Emerald
    GRADIENT_VIA: "#34D399", // Light emerald
    GRADIENT_TO: "#6EE7B7", // Lighter emerald
  },
  // Instructions scene - Blue theme
  INSTRUCTIONS: {
    GRADIENT_FROM: "#3B82F6", // Blue
    GRADIENT_VIA: "#60A5FA", // Light blue
    GRADIENT_TO: "#93C5FD", // Lighter blue
  },
} as const;

// Environment Colors
export const ENVIRONMENT_COLORS = {
  SKY: "#87CEEB",
  GROUND: "#8B4513",
  GRASS: "#228B22",
} as const;

// Player Colors
export const PLAYER_COLORS = {
  BODY: "#ff6b6b",
  EYES_WHITE: "#FFFFFF",
  EYES_PUPIL: "#000000",
} as const;

// Rice Rocket Colors
export const RICE_ROCKET_COLORS = {
  BODY: "#FFFFFF", // White
} as const;

// Sushi Colors
export const SUSHI_COLORS = {
  BASE: "#FF6B6B", // Red
  FISH: "#FF6B6B", // Red (same as base for compatibility)
  RICE: "#FFFFFF", // White
  NORI: "#000000", // Black
} as const;

// Torii Colors
export const TORII_COLORS = {
  PRIMARY: "#8B4513", // Brown
} as const;

// Samurai Colors
export const SAMURAI_COLORS = {
  BODY: "#4169E1", // Blue
} as const;

// Samurai Bullet Colors
export const SAMURAI_BULLET_COLORS = {
  BODY: "#FF4500", // Orange
} as const;

export const NINJA_COLORS = {
  BODY: "#800080", // Purple
  SHADOW: "#4B0082", // Dark purple
} as const;

export const BOSS_COLORS = {
  BODY: "#DC143C", // Crimson
  ARMOR: "#8B0000", // Dark red
  EYES: "#FFD700", // Gold
} as const;

export const POWERUP_COLORS = {
  SHIELD: "#00CED1", // Cyan
  INFINITE_AMMO: "#32CD32", // Lime green
  SPEED_BOOST: "#FF69B4", // Hot pink
  MULTI_SHOT: "#FF8C00", // Dark orange
} as const;

// Common Colors
export const COMMON_COLORS = {
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  YELLOW: "#FFD700",
} as const;

// Legacy export for backward compatibility
export const GAME_COLORS = {
  ...ENVIRONMENT_COLORS,
  ...PLAYER_COLORS,
  ...COMMON_COLORS,
  TORII_RED: TORII_COLORS.PRIMARY,
  SUSHI_BASE: SUSHI_COLORS.BASE,
  SUSHI_FISH: SUSHI_COLORS.FISH,
} as const;

// Menu Color Palette - 10 levels for extensible navigation
export const MENU_COLORS = {
  // Existing colors (1-5)
  game: {
    name: "Game",
    icon: "🎮",
    gradientFrom: "#4ade80",
    gradientTo: "#16a34a",
    titleGradient: {
      from: "#4ade80",
      via: "#22c55e",
      to: "#16a34a",
    },
  },
  profile: {
    name: "Profile",
    icon: "👤",
    gradientFrom: "#3b82f6",
    gradientTo: "#1d4ed8",
    titleGradient: {
      from: "#3b82f6",
      via: "#2563eb",
      to: "#1d4ed8",
    },
  },
  leaderboard: {
    name: "Leaderboard",
    icon: "🏆",
    gradientFrom: "#fbbf24",
    gradientTo: "#d97706",
    titleGradient: {
      from: "#fbbf24",
      via: "#f59e0b",
      to: "#d97706",
    },
  },
  shop: {
    name: "Shop",
    icon: "🏪",
    gradientFrom: "#f59e0b",
    gradientTo: "#ea580c",
    titleGradient: {
      from: "#f59e0b",
      via: "#ea580c",
      to: "#dc2626",
    },
  },
  instructions: {
    name: "Instructions",
    icon: "📖",
    gradientFrom: "#10b981",
    gradientTo: "#059669",
    titleGradient: {
      from: "#10b981",
      via: "#059669",
      to: "#047857",
    },
  },

  // New colors for future menu items (6-10)
  settings: {
    name: "Settings",
    icon: "⚙️",
    gradientFrom: "#6b7280",
    gradientTo: "#374151",
    titleGradient: {
      from: "#6b7280",
      via: "#4b5563",
      to: "#374151",
    },
  },
  achievements: {
    name: "Achievements",
    icon: "🏅",
    gradientFrom: "#8b5cf6",
    gradientTo: "#7c3aed",
    titleGradient: {
      from: "#8b5cf6",
      via: "#7c3aed",
      to: "#6d28d9",
    },
  },
  tournaments: {
    name: "Tournaments",
    icon: "🏁",
    gradientFrom: "#ef4444",
    gradientTo: "#dc2626",
    titleGradient: {
      from: "#ef4444",
      via: "#dc2626",
      to: "#b91c1c",
    },
  },
  friends: {
    name: "Friends",
    icon: "👥",
    gradientFrom: "#06b6d4",
    gradientTo: "#0891b2",
    titleGradient: {
      from: "#06b6d4",
      via: "#0891b2",
      to: "#0e7490",
    },
  },
  news: {
    name: "News",
    icon: "📰",
    gradientFrom: "#f97316",
    gradientTo: "#ea580c",
    titleGradient: {
      from: "#f97316",
      via: "#ea580c",
      to: "#c2410c",
    },
  },
} as const;

// Helper function to get menu color by key
export const getMenuColor = (key: keyof typeof MENU_COLORS) => {
  return MENU_COLORS[key];
};

// Helper function to get all menu colors as array
export const getMenuColorsArray = () => {
  return Object.entries(MENU_COLORS).map(([key, value]) => ({
    key,
    ...value,
  }));
};

// Type for menu color keys
export type MenuColorKey = keyof typeof MENU_COLORS;

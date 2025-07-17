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

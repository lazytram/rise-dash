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
  BODY: "#ffffff",
  HIGHLIGHT: "rgba(255, 255, 255, 0.8)",
} as const;

// Sushi Colors
export const SUSHI_COLORS = {
  BASE: "#ff9500",
  RICE: "#FFFFFF",
  FISH: "#ff6b6b",
  NORI: "#000000",
} as const;

// Torii Colors
export const TORII_COLORS = {
  PRIMARY: "#dc2626",
  SECONDARY: "#ef4444",
  WOOD_GRAIN: "rgba(139, 69, 19, 0.3)",
  GOLD_DETAILS: "#FFD700",
  SHADOW: "rgba(0, 0, 0, 0.3)",
  OUTLINE: "rgba(0, 0, 0, 0.5)",
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

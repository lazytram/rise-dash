// ================================
// SCENE MANAGEMENT
// ================================

/**
 * Available scene types in the application
 */
export enum SceneType {
  WELCOME = "welcome",
  GAME = "game",
  INSTRUCTIONS = "instructions",
  LEADERBOARD = "leaderboard",
  PROFILE = "profile",
  SHOP = "shop",
  DAILY_REVEAL = "dailyReveal",
  GAMING_ROOM = "gamingRoom",
  MEMORY_FLIP = "memoryFlip",
}

/**
 * Scene configuration with component and metadata
 */
export interface SceneConfig {
  id: SceneType;
  component: React.ComponentType;
  title: string;
  showHeader?: boolean;
}

/**
 * Scene navigation state
 */
export interface SceneState {
  currentScene: SceneType;
  previousScene?: SceneType;
  history: SceneType[];
}

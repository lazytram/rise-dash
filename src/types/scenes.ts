export enum SceneType {
  WELCOME = "welcome",
  GAME = "game",
  INSTRUCTIONS = "instructions",
  LEADERBOARD = "leaderboard",
  PROFILE = "profile",
  SHOP = "shop",
  DAILY_STREAK = "dailyStreak",
}

export interface Scene {
  id: SceneType;
  component: React.ComponentType;
  title: string;
  showHeader?: boolean;
}

export interface SceneState {
  currentScene: SceneType;
  previousScene?: SceneType;
  history: SceneType[];
}

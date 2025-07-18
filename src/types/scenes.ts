export enum SceneType {
  WELCOME = "welcome",
  GAME = "game",
  PROFILE = "profile",
  LEADERBOARD = "leaderboard",
  INSTRUCTIONS = "instructions",
  SHOP = "shop",
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

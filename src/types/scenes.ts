export type SceneType =
  | "welcome"
  | "game"
  | "profile"
  | "leaderboard"
  | "instructions"
  | "shop";

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

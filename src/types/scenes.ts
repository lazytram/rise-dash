export type SceneType =
  | "welcome"
  | "game"
  | "profile"
  | "leaderboard"
  | "instructions";

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

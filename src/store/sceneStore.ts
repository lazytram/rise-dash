import { create } from "zustand";
import { SceneType, SceneState } from "../types/scenes";

interface SceneStore extends SceneState {
  setScene: (scene: SceneType) => void;
  goBack: () => void;
  reset: () => void;
}

export const useSceneStore = create<SceneStore>((set, get) => ({
  currentScene: SceneType.WELCOME,
  history: [SceneType.WELCOME],
  setScene: (scene: SceneType) => {
    const { currentScene, history } = get();
    set({
      currentScene: scene,
      previousScene: currentScene,
      history: [...history, scene],
    });
  },
  goBack: () => {
    const { history } = get();
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousScene = newHistory[newHistory.length - 1];
      set({
        currentScene: previousScene,
        previousScene: newHistory[newHistory.length - 2],
        history: newHistory,
      });
    }
  },
  reset: () => {
    set({
      currentScene: SceneType.WELCOME,
      previousScene: undefined,
      history: [SceneType.WELCOME],
    });
  },
}));

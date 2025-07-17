import { create } from "zustand";
import { SceneType, SceneState } from "@/types/scenes";

interface SceneStore extends SceneState {
  navigateTo: (scene: SceneType) => void;
  goBack: () => void;
  reset: () => void;
}

const initialState: SceneState = {
  currentScene: "welcome",
  history: ["welcome"],
};

export const useSceneStore = create<SceneStore>((set, get) => ({
  ...initialState,

  navigateTo: (scene: SceneType) => {
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
    set(initialState);
  },
}));

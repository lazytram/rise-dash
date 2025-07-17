"use client";

import { memo } from "react";
import { useSceneStore } from "@/store/sceneStore";
import { SceneRegistry } from "@/components/scenes/SceneRegistry";
export const SceneManager = memo(function SceneManager() {
  const { currentScene } = useSceneStore();
  const SceneComponent = SceneRegistry[currentScene]?.component;

  if (!SceneComponent) {
    console.error(`Scene component not found for: ${currentScene}`);
    return null;
  }

  return (
    <div className="w-full h-full">
      <SceneComponent />
    </div>
  );
});

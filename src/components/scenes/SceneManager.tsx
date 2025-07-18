"use client";

import { memo } from "react";
import { useSceneStore } from "@/store/sceneStore";
import { scenes } from "@/components/scenes/SceneRegistry";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const SceneManager = memo(function SceneManager() {
  const { currentScene } = useSceneStore();
  const scene = scenes.find((s) => s.id === currentScene);
  const SceneComponent = scene?.component;

  if (!SceneComponent) {
    console.error(`Scene component not found for: ${currentScene}`);
    return null;
  }

  return (
    <AuthGuard title={scene.title}>
      <SceneComponent />
    </AuthGuard>
  );
});

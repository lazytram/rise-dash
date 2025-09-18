"use client";

import { memo } from "react";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { scenes } from "./SceneRegistry";
import { AuthGuard } from "../auth/AuthGuard";
import { useScrollToCenter } from "@/shared/hooks/useScrollToCenter";
export const SceneManager = memo(function SceneManager() {
  const { currentScene } = useSceneStore();
  const scene = scenes.find((s) => s.id === currentScene);
  const SceneComponent = scene?.component;

  // Scroll to center when scene changes
  useScrollToCenter();

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

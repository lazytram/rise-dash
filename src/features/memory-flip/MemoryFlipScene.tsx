"use client";

import { memo } from "react";
import { Scene } from "@/shared/components/Scene";
import { MemoryFlipContent } from "./MemoryFlipContent";

export const MemoryFlipScene = memo(function MemoryFlipScene() {
  return (
    <Scene
      sceneKey="memoryFlip"
      config={{ maxWidth: "4xl" }}
      cardClassName="p-8"
    >
      <MemoryFlipContent />
    </Scene>
  );
});

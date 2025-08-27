"use client";

import { memo } from "react";
import { Scene } from "@/shared/components/Scene";
import { GamingRoomContent } from "./GamingRoomContent";

export const GamingRoomScene = memo(function GamingRoomScene() {
  return (
    <Scene
      sceneKey="gamingRoom"
      config={{ maxWidth: "6xl" }}
      cardClassName="p-8"
    >
      <GamingRoomContent />
    </Scene>
  );
});

"use client";

import { memo } from "react";
import { Scene } from "@/shared/components/Scene";
import { TapeRiceContent } from "./TapeRiceContent";

export const TapeRiceScene = memo(function TapeRiceScene() {
  return (
    <Scene sceneKey="tapeRice" config={{ maxWidth: "4xl" }} cardClassName="p-8">
      <TapeRiceContent />
    </Scene>
  );
});

"use client";

import { memo } from "react";
import { Scene } from "@/shared/components/Scene";
import { DojoSelection } from "./components/DojoSelection";

export const DojoScene = memo(function DojoScene() {
  return (
    <Scene sceneKey="dojo" config={{ maxWidth: "4xl" }}>
      <DojoSelection />
    </Scene>
  );
});

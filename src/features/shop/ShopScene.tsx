"use client";

import { memo } from "react";
import { ShopContent } from "./ShopContent";
import { Scene } from "@/shared/components/Scene";

export const ShopScene = memo(function ShopScene() {
  return (
    <Scene sceneKey="shop">
      <ShopContent />
    </Scene>
  );
});

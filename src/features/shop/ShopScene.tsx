"use client";

import { memo } from "react";
import { ShopContent } from "./ShopContent";
import { SceneContainer } from "@/shared/components/SceneContainer";

export const ShopScene = memo(function ShopScene() {
  return (
    <SceneContainer maxWidth="6xl">
      <ShopContent />
    </SceneContainer>
  );
});

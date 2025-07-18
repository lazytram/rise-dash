"use client";

import { memo } from "react";
import { ShopContent } from "@/components/shop/ShopContent";
import { SceneContainer } from "@/components/ui/SceneContainer";

export const ShopScene = memo(function ShopScene() {
  return (
    <SceneContainer maxWidth="6xl">
      <ShopContent />
    </SceneContainer>
  );
});

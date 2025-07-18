"use client";

import { memo } from "react";
import { ProfileContent } from "@/components/game/ProfileContent";
import { SceneContainer } from "@/components/ui/SceneContainer";

export const ProfileScene = memo(function ProfileScene() {
  return (
    <SceneContainer>
      <ProfileContent />
    </SceneContainer>
  );
});

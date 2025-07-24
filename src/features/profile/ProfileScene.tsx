"use client";

import { memo } from "react";
import { ProfileContent } from "./ProfileContent";
import { SceneContainer } from "@/shared/components/SceneContainer";

export const ProfileScene = memo(function ProfileScene() {
  return (
    <SceneContainer>
      <ProfileContent />
    </SceneContainer>
  );
});

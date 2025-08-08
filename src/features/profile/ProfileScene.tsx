"use client";

import { memo } from "react";
import { ProfileContent } from "./ProfileContent";
import { Scene } from "@/shared/components/Scene";

export const ProfileScene = memo(function ProfileScene() {
  return (
    <Scene sceneKey="profile">
      <ProfileContent />
    </Scene>
  );
});

"use client";

import { memo } from "react";
import { ProfileContent } from "@/components/game/ProfileContent";

export const ProfileScene = memo(function ProfileScene() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <ProfileContent />
      </div>
    </div>
  );
});

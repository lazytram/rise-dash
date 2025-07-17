"use client";

import { memo } from "react";
import { InstructionsContent } from "@/components/game/InstructionsContent";

export const InstructionsScene = memo(function InstructionsScene() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <InstructionsContent />
      </div>
    </div>
  );
});

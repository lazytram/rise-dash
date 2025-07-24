"use client";

import { memo } from "react";
import { AuthButton } from "@/features/auth/AuthButton";
import { LanguageSelector } from "@/shared/components/LanguageSelector";

export const RightColumn = memo(function RightColumn() {
  return (
    <div className="fixed right-4 top-4 z-30">
      <div className="flex flex-col items-end gap-y-4">
        <AuthButton />
        <LanguageSelector />
      </div>
    </div>
  );
});

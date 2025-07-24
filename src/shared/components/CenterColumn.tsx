"use client";

import { ReactNode, memo } from "react";

interface CenterColumnProps {
  children: ReactNode;
}

export const CenterColumn = memo(function CenterColumn({
  children,
}: CenterColumnProps) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen z-10 relative bg-transparent">
      <div className="w-full max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
});

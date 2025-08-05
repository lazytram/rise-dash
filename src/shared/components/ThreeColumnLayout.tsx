"use client";

import { ReactNode, memo } from "react";
import { LeftColumn } from "./LeftColumn";
import { RightColumn } from "./RightColumn";
import { CenterColumn } from "./CenterColumn";

interface ThreeColumnLayoutProps {
  children: ReactNode;
}

export const ThreeColumnLayout = memo(function ThreeColumnLayout({
  children,
}: ThreeColumnLayoutProps) {
  return (
    <div className="bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] min-h-screen relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse animation-delay-400"></div>
      </div>

      <LeftColumn />
      <CenterColumn>{children}</CenterColumn>
      <RightColumn />
    </div>
  );
});

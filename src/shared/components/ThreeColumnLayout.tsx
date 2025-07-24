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
    <div className="bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] min-h-screen relative">
      <LeftColumn />

      <CenterColumn>{children}</CenterColumn>

      <RightColumn />
    </div>
  );
});

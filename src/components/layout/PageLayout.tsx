"use client";

import { ReactNode, memo } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = memo(function PageLayout({
  children,
  className = "",
}: PageLayoutProps) {
  return (
    <main
      className={`bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] min-h-screen ${className}`}
    >
      <div className="pt-20 px-4">{children}</div>
    </main>
  );
});

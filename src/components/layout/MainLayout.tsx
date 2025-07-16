"use client";

import { ReactNode, memo } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = memo(function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <main className="bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {children}
      </div>
    </main>
  );
});

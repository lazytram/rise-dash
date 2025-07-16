"use client";

import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <main
      className={`bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] min-h-screen ${className}`}
    >
      <Header />
      <div className="pt-20 px-4">{children}</div>
    </main>
  );
}

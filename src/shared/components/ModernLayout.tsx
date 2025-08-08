"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Toaster } from "./Toaster";

interface ModernLayoutProps {
  children: ReactNode;
}

export function ModernLayout({ children }: ModernLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Main content - properly spaced from navbar */}
      <main className="pt-16 min-h-[calc(100vh-4rem)]">{children}</main>

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}

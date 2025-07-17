"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/Toaster";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Toaster />
    </>
  );
}

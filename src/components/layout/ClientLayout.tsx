"use client";

import { ReactNode } from "react";
import { Header } from "./Header";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

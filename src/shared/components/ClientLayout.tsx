"use client";

import { ReactNode } from "react";
import { ThreeColumnLayout } from "./ThreeColumnLayout";
import { Toaster } from "@/shared/components/Toaster";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <ThreeColumnLayout>{children}</ThreeColumnLayout>
      <Toaster />
    </>
  );
}

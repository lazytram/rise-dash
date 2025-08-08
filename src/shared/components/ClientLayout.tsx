"use client";

import { ReactNode } from "react";
import { ModernLayout } from "./ModernLayout";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return <ModernLayout>{children}</ModernLayout>;
}

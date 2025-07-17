"use client";

import { ReactNode } from "react";
import { HeaderPortal } from "./HeaderPortal";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return <HeaderPortal>{children}</HeaderPortal>;
}

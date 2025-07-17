"use client";

import { ReactNode, Suspense } from "react";
import { useHydration } from "@/hooks/useHydration";
import { Header } from "./Header";
import { HeaderSkeleton } from "./HeaderSkeleton";

interface HeaderLayoutProps {
  children: ReactNode;
}

function HeaderWithErrorBoundary() {
  const { isHydrated, isMounted, isServer } = useHydration();

  if (isServer || !isMounted) {
    return <HeaderSkeleton />;
  }

  if (!isHydrated) {
    return <HeaderSkeleton />;
  }

  return <Header />;
}

export function HeaderLayout({ children }: HeaderLayoutProps) {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderWithErrorBoundary />
      </Suspense>
      {children}
    </>
  );
}

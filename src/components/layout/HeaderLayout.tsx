"use client";

import { ReactNode, Suspense } from "react";
import { useHydration } from "@/hooks/useHydration";
import { Header } from "./Header";
import { HeaderSkeleton } from "./HeaderSkeleton";

interface HeaderLayoutProps {
  children: ReactNode;
}

// Composant Header avec gestion d'erreurs
function HeaderWithErrorBoundary() {
  const { isHydrated, isMounted, isServer } = useHydration();

  // Rendu côté serveur ou pendant l'hydratation - afficher le skeleton
  if (isServer || !isMounted) {
    return <HeaderSkeleton />;
  }

  // Attendre que l'hydratation soit complète avant d'afficher le Header
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

"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useHydration } from "@/hooks/useHydration";
import { Header } from "./Header";
import { HeaderSkeleton } from "./HeaderSkeleton";

interface HeaderPortalProps {
  children: ReactNode;
}

// Composant Header isolé via portal
function HeaderPortalContent() {
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

export function HeaderPortal({ children }: HeaderPortalProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);

  // Créer le conteneur pour le portal
  useEffect(() => {
    setIsClient(true);

    // Créer un conteneur dédié pour le header
    const container = document.createElement("div");
    container.id = "header-portal-container";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.right = "0";
    container.style.zIndex = "50";
    container.style.pointerEvents = "none"; // Permettre les clics à travers par défaut

    document.body.appendChild(container);
    setPortalContainer(container);

    // Cleanup lors du démontage
    return () => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  return (
    <>
      {/* Portal pour le Header - complètement isolé de la hiérarchie React */}
      {isClient &&
        portalContainer &&
        createPortal(
          <div style={{ pointerEvents: "auto" }}>
            <HeaderPortalContent />
          </div>,
          portalContainer
        )}

      {/* Contenu principal */}
      {children}
    </>
  );
}

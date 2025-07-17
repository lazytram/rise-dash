"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useHydration } from "@/hooks/useHydration";
import { Header } from "./Header";
import { HeaderSkeleton } from "./HeaderSkeleton";

interface HeaderPortalProps {
  children: ReactNode;
}

function HeaderPortalContent() {
  const { isHydrated, isMounted, isServer } = useHydration();

  if (isServer || !isMounted) {
    return <HeaderSkeleton />;
  }

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

  useEffect(() => {
    setIsClient(true);

    const container = document.createElement("div");
    container.id = "header-portal-container";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.right = "0";
    container.style.zIndex = "50";
    container.style.pointerEvents = "none";

    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  return (
    <>
      {isClient &&
        portalContainer &&
        createPortal(
          <div style={{ pointerEvents: "auto" }}>
            <HeaderPortalContent />
          </div>,
          portalContainer
        )}

      {children}
    </>
  );
}

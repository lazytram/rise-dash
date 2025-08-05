import { useEffect, useRef } from "react";
import { useSceneStore } from "@/infrastructure/store/sceneStore";

export const useScrollToCenter = () => {
  const { currentScene } = useSceneStore();
  const previousSceneRef = useRef(currentScene);

  useEffect(() => {
    // Only scroll if scene actually changed
    if (previousSceneRef.current !== currentScene) {
      previousSceneRef.current = currentScene;

      // Scroll to center of the screen when scene changes
      const scrollToCenter = () => {
        // Check if we're in a browser environment
        if (typeof window === "undefined") return;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Calculate center position
        const centerY = Math.max(
          0,
          (viewportHeight - window.document.documentElement.scrollHeight) / 2
        );
        const centerX = Math.max(
          0,
          (viewportWidth - window.document.documentElement.scrollWidth) / 2
        );

        // Smooth scroll to center
        window.scrollTo({
          top: centerY,
          left: centerX,
          behavior: "smooth",
        });
      };

      // Add a small delay to ensure the scene has rendered
      const timeoutId = setTimeout(scrollToCenter, 150);

      return () => clearTimeout(timeoutId);
    }
  }, [currentScene]);
};

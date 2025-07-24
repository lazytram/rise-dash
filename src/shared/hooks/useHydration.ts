import { useState, useEffect, useCallback } from "react";

export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleHydration = useCallback(() => {
    setIsMounted(true);
    // Délai pour s'assurer que l'hydratation est complète
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    handleHydration();
  }, [handleHydration]);

  return {
    isHydrated,
    isMounted,
    isServer: typeof window === "undefined",
  };
};

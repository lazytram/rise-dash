import { useEffect, useState } from "react";
import { useTutorialStore } from "@/store/tutorialStore";

export const useTutorialAutoShow = () => {
  const { hasSeenTutorial } = useTutorialStore();
  const [shouldShowTutorial, setShouldShowTutorial] = useState(false);

  useEffect(() => {
    // Check if user hasn't seen the tutorial
    if (!hasSeenTutorial) {
      // Add a small delay to ensure the app is fully loaded
      const timer = setTimeout(() => {
        setShouldShowTutorial(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial]);

  const closeTutorial = () => {
    setShouldShowTutorial(false);
  };

  return {
    shouldShowTutorial,
    closeTutorial,
  };
};

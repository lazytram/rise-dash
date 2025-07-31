import { useState, useEffect } from "react";
import { useDailyRevealSelectors } from "@/infrastructure/store/dailyRevealStore";
import { formatTimeRemaining, getTimeUntilNextReveal } from "../utils";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { CountdownState } from "../types";

export const useCountdown = (): CountdownState => {
  const { lastRevealTime, canReveal } = useDailyRevealSelectors();
  const { t } = useTranslations();
  const [, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeRemaining = getTimeUntilNextReveal(lastRevealTime);
  const readyText = t("scenes.dailyReveal.readyToReveal");
  const formattedTime = formatTimeRemaining(timeRemaining, readyText);

  return {
    timeRemaining,
    formattedTime,
    canReveal,
  };
};

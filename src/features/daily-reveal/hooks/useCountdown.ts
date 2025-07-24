import { useState, useEffect } from "react";
import { useDailyRevealSelectors } from "@/infrastructure/store/dailyRevealStore";
import { formatTimeRemaining, getTimeUntilNextReveal } from "../utils";
import { CountdownState } from "../types";

export const useCountdown = (): CountdownState => {
  const { lastRevealTime, canReveal } = useDailyRevealSelectors();
  const [, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeRemaining = getTimeUntilNextReveal(lastRevealTime);
  const formattedTime = formatTimeRemaining(timeRemaining);

  return {
    timeRemaining,
    formattedTime,
    canReveal,
  };
};

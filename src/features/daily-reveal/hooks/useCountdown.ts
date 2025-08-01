import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useDailyRevealSelectors } from "@/infrastructure/store/dailyRevealStore";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { CountdownState } from "../types";

export const useCountdown = (): CountdownState => {
  const { address } = useAccount();
  const { timeUntilNextReveal, formattedTimeRemaining, canReveal } =
    useDailyRevealSelectors(address);
  const { t } = useTranslations();
  const [, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const readyText = t("scenes.dailyReveal.readyToReveal");
  const formattedTime =
    formattedTimeRemaining === "Ready to reveal"
      ? readyText
      : formattedTimeRemaining;

  return {
    timeRemaining: timeUntilNextReveal,
    formattedTime,
    canReveal,
  };
};

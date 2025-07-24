"use client";

import React from "react";
import { Text } from "@/shared/components/Text";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useCountdown } from "./hooks/useCountdown";
import { isDevelopmentMode } from "./utils";
import { CountdownTimerProps } from "./types";

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  className = "",
}) => {
  const { formattedTime, canReveal } = useCountdown();
  const { t } = useTranslations();
  const isDevelopment = isDevelopmentMode();

  if (isDevelopment) {
    return (
      <div
        className={`flex items-center justify-center space-x-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 ${className}`}
      >
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <Text className="text-blue-400 font-medium">
          🚀 DEV Mode - Infinite Reveals!
        </Text>
      </div>
    );
  }

  if (canReveal) {
    return (
      <div
        className={`flex items-center justify-center space-x-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20 ${className}`}
      >
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <Text className="text-green-400 font-medium">
          {t("scenes.dailyReveal.readyToReveal")}
        </Text>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center space-x-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 ${className}`}
    >
      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
      <Text className="text-amber-400 font-medium">
        {t("scenes.dailyReveal.nextRevealIn")}: {formattedTime}
      </Text>
    </div>
  );
};

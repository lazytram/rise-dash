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
        className={`flex items-center justify-center space-x-2 p-4 bg-blue-500/20 rounded-lg border-2 border-blue-500/40 ${className}`}
      >
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
        <Text className="text-blue-300 font-semibold text-base">
          🚀 DEV Mode - Infinite Reveals!
        </Text>
      </div>
    );
  }

  if (canReveal) {
    return (
      <div
        className={`flex items-center justify-center space-x-3 p-4 bg-green-500/20 rounded-lg border-2 border-green-500/40 ${className}`}
      >
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        <Text className="text-green-300 font-semibold text-base">
          {t("scenes.dailyReveal.readyToReveal")}
        </Text>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center space-x-3 p-4 bg-amber-500/20 rounded-lg border-2 border-amber-500/40 ${className}`}
    >
      <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
      <div className="flex flex-col items-center">
        <Text className="text-amber-300 font-medium text-sm">
          {t("scenes.dailyReveal.nextRevealIn")}:
        </Text>
        <Text className="text-amber-200 font-bold text-lg">
          {formattedTime}
        </Text>
      </div>
    </div>
  );
};

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
      className={`flex items-center justify-center space-x-3 p-4 rounded-xl ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(255,193,7,0.18) 0%, rgba(255,167,38,0.18) 100%)",
        border: "2px solid rgba(255, 179, 0, 0.5)",
        boxShadow:
          "0 6px 16px rgba(255, 179, 0, 0.14), inset 0 0 0 1px rgba(255,255,255,0.25)",
      }}
    >
      <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
      <div className="flex flex-col items-center leading-tight">
        <Text className="text-amber-900 font-semibold text-sm tracking-wide">
          {t("scenes.dailyReveal.nextRevealIn")}:
        </Text>
        <Text className="text-amber-800 font-extrabold text-xl">
          {formattedTime}
        </Text>
      </div>
    </div>
  );
};

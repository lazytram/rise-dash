"use client";

import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { isDevelopmentMode } from "./utils";
import { RevealButtonProps } from "./types";

export const RevealButton: React.FC<RevealButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
}) => {
  const { t } = useTranslations();
  const isDevelopment = isDevelopmentMode();

  const getButtonText = (): string => {
    if (isDevelopment) {
      return t("scenes.dailyStreak.reveal");
    }
    return disabled
      ? t("scenes.dailyStreak.completed")
      : t("scenes.dailyStreak.reveal");
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white font-bold py-2.5 px-7 rounded-full shadow-lg hover:shadow-xl disabled:shadow-md transform hover:scale-105 disabled:scale-100 transition-all duration-300 border-2 border-blue-300/50 disabled:border-gray-300/50 cursor-pointer disabled:cursor-not-allowed ${className}`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">✨</span>
        <span className="text-xs font-black uppercase tracking-wider">
          {getButtonText()}
        </span>
        <span className="text-lg">✨</span>
      </div>
    </button>
  );
};

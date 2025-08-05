import React from "react";
import { cn } from "@/shared/utils/cn";
import { Text } from "../../../shared/components/Text";
import { AchievementCardProps } from "./types";
import { RARITY_COLORS, RARITY_LABELS } from "./constants";

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  className,
  onClick,
}) => {
  const colors = RARITY_COLORS[achievement.rarity];
  const progressPercentage =
    (achievement.progress / achievement.maxProgress) * 100;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border-2 transition-all duration-300",
        colors.border,
        colors.bg,
        achievement.isCompleted
          ? "opacity-75 grayscale-[0.3] hover:scale-102 hover:shadow-md"
          : "hover:scale-105 hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      {/* Overlay pour les achievements complétés */}
      {achievement.isCompleted && (
        <div className="absolute inset-0 bg-green-500/20 z-10 pointer-events-none" />
      )}

      {/* Overlay label au hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20 opacity-0 hover:opacity-100 transition-all duration-500 z-30 flex items-center justify-center backdrop-blur-[2px]">
        <div
          className={cn(
            "px-8 py-4 rounded-2xl text-base font-medium text-white shadow-xl border border-white/20 transform scale-90 hover:scale-100 transition-all duration-300",
            "bg-black/40 backdrop-blur-md"
          )}
        >
          <div className="text-center">
            <div className="text-3xl mb-2 opacity-90">{achievement.icon}</div>
            <div className="text-sm font-light opacity-80">
              {RARITY_LABELS[achievement.rarity]} Achievement
            </div>
          </div>
        </div>
      </div>

      {/* Completion overlay */}
      {achievement.isCompleted && (
        <div className="absolute top-2 left-2 z-20">
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-medium shadow-sm">
            <span>✓</span>
            <span>Completed</span>
          </div>
        </div>
      )}

      <div className="p-4 relative z-10 flex flex-col h-full">
        {/* Icon and title - amélioré l'espacement */}
        <div className="flex items-start space-x-3 mb-4 pt-2">
          <div className="text-4xl flex-shrink-0">{achievement.icon}</div>
          <div className="flex-1 min-w-0">
            <Text
              variant="subtitle"
              className="font-semibold mb-2 text-gray-900 leading-tight"
            >
              {achievement.title}
            </Text>
            <Text variant="caption" className="text-gray-600 leading-relaxed">
              {achievement.description}
            </Text>
          </div>
        </div>

        {/* Espace flexible pour aligner les progress bars */}
        <div className="flex-1" />

        {/* Progress bar - alignée en bas */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="text-gray-600 font-medium">
              {achievement.progress} / {achievement.maxProgress}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={cn(
                "h-3 rounded-full transition-all duration-300 shadow-sm",
                colors.progress
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Reward - collée en bas */}
        {achievement.reward && (
          <div className="mt-3 pt-3 border-t border-gray-200/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Reward:</span>
              <div className="flex items-center space-x-2">
                {achievement.reward.type === "rice" && (
                  <>
                    <span className="text-lg">🍚</span>
                    <span className="text-sm font-semibold text-yellow-600">
                      {achievement.reward.amount} RICE
                    </span>
                  </>
                )}
                {achievement.reward.type === "powerup" && (
                  <>
                    <span className="text-lg">⚡</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {achievement.reward.name}
                    </span>
                  </>
                )}
                {achievement.reward.type === "title" && (
                  <>
                    <span className="text-lg">👑</span>
                    <span className="text-sm font-semibold text-purple-600">
                      {achievement.reward.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shimmer effect for completed achievements */}
      {achievement.isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse pointer-events-none z-5" />
      )}
    </div>
  );
};

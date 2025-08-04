import React from "react";
import { cn } from "@/shared/utils/cn";
import { AchievementCard } from "../../features/profile/achievements/AchievementCard";
import { Achievement } from "../../features/profile/achievements/types";

interface AchievementGridProps {
  achievements: Achievement[];
  className?: string;
  onAchievementClick?: (achievement: Achievement) => void;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  className,
  onAchievementClick,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          onClick={() => onAchievementClick?.(achievement)}
          className="cursor-pointer"
        />
      ))}
    </div>
  );
};

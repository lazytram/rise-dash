import React from "react";
import { cn } from "@/shared/utils/cn";
import { AchievementCard } from "./AchievementCard";
import { AchievementGridProps } from "./types";

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  className,
}) => {
  return (
    <div
      className={cn(
        "max-h-96 overflow-y-auto achievement-scrollbar pr-4",
        className
      )}
    >
      <div className="border-2 border-purple-400/50 rounded-xl p-4 bg-white/5 backdrop-blur-sm">
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-lg font-medium">No achievements found</div>
              <div className="text-sm">Try changing your filters</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

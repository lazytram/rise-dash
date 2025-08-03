import React from "react";
import { cn } from "@/shared/utils/cn";

interface RankBadgeProps {
  rank: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold";
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-white font-bold";
    case 3:
      return "bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold";
    default:
      return "bg-white/10 text-white";
  }
};

const getSizeClasses = (size: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm":
      return "w-6 h-6 text-xs";
    case "md":
      return "w-8 h-8 text-sm";
    case "lg":
      return "w-10 h-10 text-base";
    default:
      return "w-8 h-8 text-sm";
  }
};

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  className,
  size = "md",
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold shadow-lg transition-all duration-300 hover:scale-110",
        getSizeClasses(size),
        getRankStyle(rank),
        className
      )}
    >
      {rank}
    </div>
  );
};

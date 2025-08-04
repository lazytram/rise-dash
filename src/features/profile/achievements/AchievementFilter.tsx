import React from "react";
import { cn } from "@/shared/utils/cn";
import { Button } from "../../../shared/components/Button";
import { AchievementFilterProps } from "./types";
import { FILTER_OPTIONS, RARITY_OPTIONS, CATEGORY_OPTIONS } from "./constants";

export const AchievementFilter: React.FC<AchievementFilterProps> = ({
  activeFilter,
  activeRarity,
  activeCategory,
  onFilterChange,
  onRarityChange,
  onCategoryChange,
  className,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Filtres compacts sur une ligne */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-300 mr-2">Filters:</span>

        {/* Filtres par statut */}
        <div className="flex items-center space-x-1">
          {FILTER_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => onFilterChange(option.value)}
              className="text-xs px-3 py-1"
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </Button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-600 mx-2" />

        {/* Filtres par rareté */}
        <div className="flex items-center space-x-1">
          {RARITY_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={activeRarity === option.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => onRarityChange(option.value)}
              className="text-xs px-3 py-1"
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </Button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-600 mx-2" />

        {/* Filtres par catégorie */}
        <div className="flex items-center space-x-1">
          {CATEGORY_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={
                activeCategory === option.value ? "primary" : "secondary"
              }
              size="sm"
              onClick={() => onCategoryChange(option.value)}
              className="text-xs px-3 py-1"
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

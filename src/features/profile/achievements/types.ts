export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: "distance" | "powerups" | "upgrades" | "samurai" | "ninja" | "boss";
  reward: {
    type: "rice" | "powerup" | "title";
    amount: number;
    name: string;
  };
}

export type FilterType = "all" | "completed" | "in-progress";
export type RarityFilter = "all" | "common" | "rare" | "epic" | "legendary";
export type CategoryFilter =
  | "all"
  | "distance"
  | "powerups"
  | "upgrades"
  | "samurai"
  | "ninja"
  | "boss";

export interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
  onClick?: () => void;
}

export interface AchievementGridProps {
  achievements: Achievement[];
  className?: string;
}

export interface AchievementFilterProps {
  activeFilter: FilterType;
  activeRarity: RarityFilter;
  activeCategory: CategoryFilter;
  onFilterChange: (filter: FilterType) => void;
  onRarityChange: (rarity: RarityFilter) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  className?: string;
}

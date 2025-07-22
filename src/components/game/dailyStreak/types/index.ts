import { CardReward } from "@/types/dailyStreak";

// Component Props
export interface CardProps {
  card?: CardReward | null;
  isSpinning?: boolean;
  isRevealed?: boolean;
  size?: number;
  onClick?: () => void;
}

export interface RevealButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export interface DailyStreakCardProps {
  size?: number;
  className?: string;
}

export interface CountdownTimerProps {
  className?: string;
}

export interface RewardsTableProps {
  className?: string;
}

export interface DailyStreakContentProps {
  className?: string;
}

// Utility Types
export interface RarityColorScheme {
  borderColor: string;
  badgeColor: string;
  glowColor: string;
}

export interface CountdownState {
  timeRemaining: number;
  formattedTime: string;
  canReveal: boolean;
}

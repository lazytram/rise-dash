import { CardRarity } from "@/shared/types/dailyReveal";

export const getRarityStyles = (rarity: CardRarity) => {
  switch (rarity) {
    case CardRarity.LEGENDARY:
      return {
        borderColor: "#F59E0B",
        badgeColor: "bg-amber-500/20 border-amber-500/40 text-amber-300",
        glowColor: "#F59E0B",
        boxShadow: "0 0 30px #F59E0B80, 0 0 60px #F59E0B40",
        borderWidth: "6px",
      };
    case CardRarity.EPIC:
      return {
        borderColor: "#EF4444",
        badgeColor: "bg-red-500/20 border-red-500/40 text-red-300",
        glowColor: "#EF4444",
        boxShadow: "0 0 25px #EF444480, 0 0 50px #EF444440",
        borderWidth: "5px",
      };
    case CardRarity.RARE:
      return {
        borderColor: "#8B5CF6",
        badgeColor: "bg-purple-500/20 border-purple-500/40 text-purple-300",
        glowColor: "#8B5CF6",
        boxShadow: "0 0 20px #8B5CF680, 0 0 40px #8B5CF640",
        borderWidth: "4px",
      };
    case CardRarity.UNCOMMON:
      return {
        borderColor: "#3B82F6",
        badgeColor: "bg-blue-500/20 border-blue-500/40 text-blue-300",
        glowColor: "#3B82F6",
        boxShadow: "0 0 15px #3B82F680, 0 0 30px #3B82F640",
        borderWidth: "3px",
      };
    case CardRarity.COMMON:
      return {
        borderColor: "#10B981",
        badgeColor: "bg-green-500/20 border-green-500/40 text-green-300",
        glowColor: "#10B981",
        boxShadow: "0 0 10px #10B98180, 0 0 20px #10B98140",
        borderWidth: "2px",
      };
    default:
      return {
        borderColor: "#6B7280",
        badgeColor: "bg-gray-500/20 border-gray-500/40 text-gray-300",
        glowColor: "#6B7280",
        boxShadow: "0 0 20px #6B728040",
        borderWidth: "4px",
      };
  }
};

export const formatTimeRemaining = (
  milliseconds: number,
  readyText: string = "Ready!"
): string => {
  if (milliseconds <= 0) return readyText;

  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds
      .toString()
      .padStart(2, "0")}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  } else {
    return `${seconds}s`;
  }
};

export const getTimeUntilNextReveal = (lastRevealTime?: number): number => {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (isDevelopment) return 0;
  if (!lastRevealTime) return 0;
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  const timeDiff = now - lastRevealTime;
  const timeRemaining = twentyFourHours - timeDiff;
  return Math.max(0, timeRemaining);
};

export const isDevelopmentMode = (): boolean => {
  return process.env.NODE_ENV === "development";
};

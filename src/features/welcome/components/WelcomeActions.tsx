import { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";

import { DailyRevealHomeButton } from "@/features/auth/DailyRevealHomeButton";

interface WelcomeActionsProps {
  onPlayClick: () => void;
  onProfileClick: () => void;
  onLeaderboardClick: () => void;
}

export const WelcomeActions = memo(function WelcomeActions({
  onPlayClick,
  onProfileClick,
  onLeaderboardClick,
}: WelcomeActionsProps) {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col items-center w-full space-y-10 animate-fade-in-up animation-delay-300">
      {/* Main Play Button - Enhanced */}
      <div className="flex justify-center w-full">
        <Button
          onClick={onPlayClick}
          variant="gradient"
          size="xl"
          className="w-80 max-w-xs animate-glow-pulse hover:scale-105 transition-transform duration-300 opacity-100 shadow-2xl"
        >
          {t("common.playNow")}
        </Button>
      </div>

      {/* Secondary Actions Grid - Enhanced */}
      <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
        <Button
          onClick={onProfileClick}
          variant="glass"
          size="lg"
          className="w-full hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-400 opacity-90 hover:opacity-100 shadow-lg text-foreground"
        >
          {t("scenes.profile.title")}
        </Button>
        <Button
          onClick={onLeaderboardClick}
          variant="glass"
          size="lg"
          className="w-full hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-500 opacity-90 hover:opacity-100 shadow-lg text-foreground"
        >
          {t("scenes.leaderboard.title")}
        </Button>
      </div>

      {/* Daily Reveal - Enhanced */}
      <div className="flex justify-center items-center w-full animate-fade-in-up animation-delay-600">
        <DailyRevealHomeButton />
      </div>
    </div>
  );
});

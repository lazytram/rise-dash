import { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";

import { DailyRevealHomeButton } from "@/features/auth/DailyRevealHomeButton";
import { Tutorial } from "../../tutorial";

interface WelcomeActionsProps {
  onPlayClick: () => void;
  onProfileClick: () => void;
  onLeaderboardClick: () => void;
  onInstructionsClick: () => void;
}

export const WelcomeActions = memo(function WelcomeActions({
  onPlayClick,
  onProfileClick,
  onLeaderboardClick,
  onInstructionsClick,
}: WelcomeActionsProps) {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      <div className="flex justify-center w-full">
        <Button
          onClick={onPlayClick}
          className="w-2/3 max-w-xs bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {t("common.playNow")}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <Button
          onClick={onProfileClick}
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          {t("scenes.profile.title")}
        </Button>
        <Button
          onClick={onLeaderboardClick}
          className="w-full cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          {t("scenes.leaderboard.title")}
        </Button>
      </div>

      <Button
        onClick={onInstructionsClick}
        className="w-full cursor-pointer bg-slate-600 hover:bg-slate-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
      >
        {t("scenes.instructions.title")}
      </Button>

      <div className="flex justify-center items-center w-full">
        <DailyRevealHomeButton />
      </div>

      <Tutorial />
    </div>
  );
});

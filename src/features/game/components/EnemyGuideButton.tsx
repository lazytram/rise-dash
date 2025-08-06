import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";

interface EnemyGuideButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export const EnemyGuideButton: React.FC<EnemyGuideButtonProps> = ({
  onClick,
  isVisible,
}) => {
  const { t } = useTranslations();

  if (!isVisible) return null;

  return (
    <div className="absolute top-7.5 right-7.5 pointer-events-none">
      <button
        onClick={onClick}
        className="
          group relative w-10 h-10 rounded-full
          bg-white/10 backdrop-blur-md border border-white/20
          hover:bg-white/20 hover:border-white/30
          text-white transition-all duration-300
          transform hover:scale-110 active:scale-95
          pointer-events-auto z-10
          shadow-lg hover:shadow-xl
          flex items-center justify-center cursor-pointer
          animate-pulse
        "
        title={t("scenes.game.enemyGuide.title")}
      >
        <div className="text-lg group-hover:scale-110 transition-transform duration-300">
          📖
        </div>
      </button>
    </div>
  );
};

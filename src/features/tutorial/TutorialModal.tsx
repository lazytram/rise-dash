import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useTutorialStore } from "@/infrastructure/store/tutorialStore";
import { TutorialObjective } from "./TutorialObjective";
import { TutorialControls } from "./TutorialControls";
import { TutorialEnemies } from "./TutorialEnemies";
import { TutorialPowerUps } from "./TutorialPowerUps";
import { TutorialScoring } from "./TutorialScoring";
import { TutorialTips } from "./TutorialTips";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslations();
  const { markTutorialAsSeen } = useTutorialStore();

  if (!isOpen) return null;

  const handleClose = () => {
    markTutorialAsSeen();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg">
            🎮
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2 leading-tight text-center">
          {t("scenes.tutorial.title")}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {t("scenes.tutorial.subtitle")}
        </p>

        {/* Content */}
        <div className="text-gray-700 space-y-6 max-h-96 overflow-y-auto pr-2">
          <TutorialObjective />
          <TutorialControls />
          <TutorialEnemies />
          <TutorialPowerUps />
          <TutorialScoring />
          <TutorialTips />
        </div>

        {/* Action button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleClose}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
          >
            {t("scenes.tutorial.buttons.understood")}
          </button>
        </div>
      </div>
    </div>
  );
};

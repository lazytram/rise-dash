import React from "react";
import { UI_COLORS } from "@/constants/colors";

interface TutorialCardProps {
  title: string;
  description: string;
  progress: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({
  title,
  description,
  progress,
  isFirstStep,
  isLastStep,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm font-medium">Progress</span>
          <span className="text-white/60 text-xs">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${UI_COLORS.GRADIENT_FROM}, ${UI_COLORS.GRADIENT_VIA}, ${UI_COLORS.GRADIENT_TO})`,
            }}
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-white mb-3 leading-tight">
        {title}
      </h2>

      {/* Description */}
      <div className="text-white/90 text-sm leading-relaxed mb-6 whitespace-pre-line">
        {description}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {!isFirstStep && (
            <button
              onClick={onPrevious}
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200"
            >
              Previous
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white/80 transition-colors duration-200"
          >
            Skip
          </button>

          {isLastStep ? (
            <button
              onClick={onComplete}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
            >
              Get Started!
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

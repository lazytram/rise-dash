import React from "react";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

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
    <Card variant="glass" className="max-w-md w-full animate-scale-in">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-muted-foreground text-sm font-medium">
            Progress
          </span>
          <span className="text-muted-foreground text-xs">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500 ease-out gradient-bg"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-foreground mb-4 leading-tight">
        {title}
      </h2>

      {/* Description */}
      <div className="text-muted-foreground text-sm leading-relaxed mb-8 whitespace-pre-line">
        {description}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {!isFirstStep && (
            <Button
              onClick={onPrevious}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Previous
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onSkip}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Skip
          </Button>

          {isLastStep ? (
            <Button
              onClick={onComplete}
              variant="gradient"
              size="sm"
              className="animate-glow-pulse"
            >
              Get Started!
            </Button>
          ) : (
            <Button onClick={onNext} variant="primary" size="sm">
              Next
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

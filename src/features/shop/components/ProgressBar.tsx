import React from "react";

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => (
  <div className="w-full bg-primary/10 rounded-full h-2 mb-4 overflow-hidden">
    <div
      className="bg-gradient-to-r from-primary to-primary-hover rounded-full h-2 transition-all duration-500 ease-out"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

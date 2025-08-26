import React from "react";

interface LoadingIndicatorProps {
  label: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  label,
}) => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

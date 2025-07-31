import React from "react";
import { Loader } from "./Loader";

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  size?: "sm" | "md" | "lg";
  color?: "white" | "purple" | "gradient";
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text,
  size = "lg",
  color = "gradient",
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <Loader size={size} color={color} text={text} showText={!!text} />
      </div>
    </div>
  );
};

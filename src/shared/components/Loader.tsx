import React from "react";
import { cn } from "@/shared/utils/cn";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "white" | "purple" | "gradient";
  className?: string;
  text?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  color = "gradient",
  className,
  text,
  showText = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Clean spinner */}
      <div className={cn("relative", sizeClasses[size], className)}>
        <div
          className={cn(
            "rounded-full border-2 animate-spin",
            color === "gradient"
              ? "border-purple-500 border-t-transparent"
              : color === "purple"
              ? "border-purple-500 border-t-transparent"
              : "border-white border-t-transparent"
          )}
          style={{
            background:
              color === "gradient"
                ? "linear-gradient(45deg, #8b5cf6, #a855f7, #06b6d4)"
                : undefined,
          }}
        />
      </div>

      {/* Optional text */}
      {showText && text && (
        <p className="text-sm text-gray-400 mt-3 text-center max-w-xs">
          {text}
        </p>
      )}
    </div>
  );
};

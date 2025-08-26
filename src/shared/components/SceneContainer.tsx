import React from "react";
import { cn } from "@/shared/utils/cn";

interface SceneContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "none" | "gradient" | "glass" | "pattern";
  fullHeight?: boolean;
  centered?: boolean;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
  children,
  className,
  maxWidth = "4xl",
  padding = "lg",
  background = "none",
  fullHeight = false,
  centered = true,
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
    xl: "p-9",
  };

  const backgroundClasses = {
    none: "",
    gradient: "gradient-bg",
    glass: "glass",
    pattern: "bg-pattern",
  };

  // Special handling for Game scene (full width, no padding)
  if (maxWidth === "full" && padding === "none") {
    return (
      <div className="w-full h-full">
        <div className={cn("w-full h-full", className)}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center px-4 pt-10",
        fullHeight ? "h-full" : "h-full py-2",
        centered && "justify-center"
      )}
    >
      <div
        className={cn(
          "w-full",
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          backgroundClasses[background],
          "animate-fade-in-up",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

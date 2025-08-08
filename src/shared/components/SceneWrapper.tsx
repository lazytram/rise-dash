import React from "react";
import { cn } from "@/shared/utils/cn";

interface SceneWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "none" | "gradient" | "glass" | "pattern";
}

export const SceneWrapper: React.FC<SceneWrapperProps> = ({
  children,
  className,
  maxWidth = "4xl",
  padding = "lg",
  background = "none",
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
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const backgroundClasses = {
    none: "",
    gradient: "gradient-bg",
    glass: "glass",
    pattern:
      "bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]",
  };

  return (
    <div className={cn("flex items-center justify-center px-4 py-8 h-full")}>
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

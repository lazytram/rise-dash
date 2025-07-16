import React from "react";
import { cn } from "@/utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = "xl",
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className={cn("mx-auto", sizeClasses[size], className)}>
      {children}
    </div>
  );
};

import React from "react";
import { cn } from "@/utils/cn";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "centered";
}

export const Box: React.FC<BoxProps> = ({
  children,
  className,
  variant = "default",
}) => {
  const baseClasses = "text-center py-8";

  const variantClasses = {
    default: "",
    centered: "text-center py-8",
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
};

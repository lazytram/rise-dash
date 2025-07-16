import React from "react";
import { cn } from "@/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient-purple" | "gradient-blue" | "gradient-green";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
}) => {
  const variantClasses = {
    default: "bg-white rounded-lg p-8 shadow-2xl",
    "gradient-purple":
      "bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white",
    "gradient-blue":
      "bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white",
    "gradient-green":
      "bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white",
  };

  return (
    <div className={cn(variantClasses[variant], className)}>{children}</div>
  );
};

import React from "react";
import { cn } from "@/shared/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  padding = "md",
  hover = false,
  style,
}) => {
  const variantClasses = {
    default: "bg-background border border-border rounded-xl shadow-sm",
    glass: "glass rounded-xl",
    gradient: "gradient-bg text-white rounded-xl shadow-lg",
    elevated:
      "bg-background rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300",
    bordered: "bg-background border-2 border-primary/20 rounded-xl shadow-sm",
  };

  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  return (
    <div
      className={cn(
        "card-modern",
        variantClasses[variant],
        paddingClasses[padding],
        hover && "hover:scale-[1.02] transition-transform duration-300",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

import React from "react";
import { cn } from "@/shared/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error" | "gradient" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
  icon,
}) => {
  const variantClasses = {
    default: "bg-muted text-muted-foreground border border-border",
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-error/10 text-error border-error/20",
    gradient: "gradient-bg text-white",
    glass: "glass text-foreground",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs rounded-md",
    md: "px-3 py-1.5 text-sm rounded-lg",
    lg: "px-4 py-2 text-base rounded-lg",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border transition-all duration-200",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </span>
  );
};

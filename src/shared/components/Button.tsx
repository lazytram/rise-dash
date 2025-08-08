import React from "react";
import { cn } from "@/shared/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "ghost"
    | "gradient"
    | "glass";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const buttonVariants = {
  primary:
    "bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg hover:shadow-xl",
  secondary: "bg-muted hover:bg-muted/80 text-foreground border border-border",
  success: "bg-success hover:bg-success/90 text-white shadow-lg",
  danger: "bg-error hover:bg-error/90 text-white shadow-lg",
  ghost: "bg-transparent hover:bg-muted text-foreground",
  gradient: "gradient-bg text-white shadow-lg hover:shadow-xl",
  glass: "glass glass-hover text-foreground",
};

const buttonSizes = {
  sm: "h-8 px-3 text-sm rounded-md",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-12 px-6 text-base rounded-lg",
  xl: "h-14 px-8 text-lg rounded-xl",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  loading = false,
  icon,
  iconPosition = "left",
  ...props
}) => {
  return (
    <button
      className={cn(
        "btn-modern font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-ring",
        buttonVariants[variant],
        buttonSizes[size],
        loading && "pointer-events-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      )}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
};

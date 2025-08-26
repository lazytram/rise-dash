import React from "react";
import { cn } from "@/shared/utils/cn";

interface TextProps {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "title"
    | "subtitle"
    | "body"
    | "caption"
    | "error"
    | "success"
    | "muted"
    | "bold";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({
  children,
  className,
  variant = "default",
  size = "base",
  as: Component = "p",
  style,
}) => {
  const variantClasses = {
    default: "text-foreground",
    title: "text-foreground font-bold",
    subtitle: "text-muted-foreground",
    body: "text-foreground",
    caption: "text-muted-foreground text-sm",
    error: "text-error",
    success: "text-success",
    muted: "text-muted-foreground",
    bold: "font-bold",
  };

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  };

  return (
    <Component
      className={cn(variantClasses[variant], sizeClasses[size], className)}
      style={style}
    >
      {children}
    </Component>
  );
};

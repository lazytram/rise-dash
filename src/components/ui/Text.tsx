import React from "react";
import { cn } from "@/utils/cn";

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
}

export const Text: React.FC<TextProps> = ({
  children,
  className,
  variant = "default",
  size = "base",
  as: Component = "p",
}) => {
  const variantClasses = {
    default: "text-gray-800",
    title: "text-gray-800 font-bold",
    subtitle: "text-gray-600",
    body: "text-gray-700",
    caption: "text-gray-500 text-sm",
    error: "text-red-600",
    success: "text-green-600",
    muted: "text-gray-500",
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
    >
      {children}
    </Component>
  );
};

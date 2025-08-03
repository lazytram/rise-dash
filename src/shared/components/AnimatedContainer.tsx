import React, { useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: "fadeIn" | "slideUp" | "scaleIn" | "slideInLeft" | "slideInRight";
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className,
  delay = 0,
  duration = 500,
  animation = "fadeIn",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-500 ease-out";

    switch (animation) {
      case "fadeIn":
        return cn(
          baseClasses,
          isVisible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-4"
        );
      case "slideUp":
        return cn(
          baseClasses,
          isVisible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        );
      case "scaleIn":
        return cn(
          baseClasses,
          isVisible
            ? "opacity-100 transform scale-100"
            : "opacity-0 transform scale-95"
        );
      case "slideInLeft":
        return cn(
          baseClasses,
          isVisible
            ? "opacity-100 transform translate-x-0"
            : "opacity-0 transform -translate-x-8"
        );
      case "slideInRight":
        return cn(
          baseClasses,
          isVisible
            ? "opacity-100 transform translate-x-0"
            : "opacity-0 transform translate-x-8"
        );
      default:
        return baseClasses;
    }
  };

  return (
    <div
      className={cn(getAnimationClasses(), className)}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

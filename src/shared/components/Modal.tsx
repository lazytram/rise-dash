import React, { useEffect } from "react";
import { cn } from "@/shared/utils/cn";

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Modal: React.FC<ModalProps> = ({
  children,
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };

  // Block scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-50 p-4">
      <div
        className={cn(
          "backdrop-blur-sm bg-white/5 border border-white/20 rounded-lg p-8 w-full shadow-2xl animate-scale-in",
          sizeClasses[size],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

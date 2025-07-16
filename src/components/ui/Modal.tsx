import React from "react";
import { cn } from "@/utils/cn";

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

  return (
    <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-15 rounded-lg animate-fade-in">
      <div
        className={cn(
          "bg-white rounded-lg p-8 w-full mx-4 shadow-2xl animate-scale-in",
          sizeClasses[size],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

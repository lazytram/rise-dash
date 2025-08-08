import React, { useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Button } from "./Button";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
  className,
  icon,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeClasses = {
    success: "bg-success/10 border-success/20 text-success",
    error: "bg-error/10 border-error/20 text-error",
    warning: "bg-warning/10 border-warning/20 text-warning",
    info: "bg-primary/10 border-primary/20 text-primary",
  };

  const defaultIcons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={cn(
        "glass rounded-lg p-4 border transition-all duration-300",
        typeClasses[type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon || defaultIcons[type]}</span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose(), 300);
            }}
            className="ml-2"
            icon="✕"
          />
        )}
      </div>
    </div>
  );
};

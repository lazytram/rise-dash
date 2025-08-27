import React from "react";
import { cn } from "@/shared/utils/cn";

interface StatChipProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const StatChip: React.FC<StatChipProps> = ({
  children,
  className,
  icon,
}) => {
  return (
    <div
      className={cn(
        "glass px-3 py-1 rounded-lg border border-primary/20 inline-flex items-center gap-2 text-sm",
        className
      )}
    >
      {icon && <span className="text-base leading-none">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};

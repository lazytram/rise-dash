import React from "react";
import { cn } from "@/shared/utils/cn";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "gradient" | "glass" | "success" | "warning" | "error";
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  className,
  trend,
}) => {
  const variantClasses = {
    default: "bg-background border border-border",
    gradient: "gradient-bg text-white",
    glass: "glass glass-hover",
    success: "bg-success/10 border-success/20 text-success",
    warning: "bg-warning/10 border-warning/20 text-warning",
    error: "bg-error/10 border-error/20 text-error",
  };

  return (
    <div
      className={cn(
        "card-modern rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]",
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-lg">{icon}</span>}
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>

            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}

            {trend && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-success" : "text-error"
                  )}
                >
                  {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last period
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

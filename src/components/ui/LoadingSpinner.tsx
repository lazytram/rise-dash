import { cn } from "@/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "white" | "purple";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

const colorClasses = {
  white: "border-white",
  purple: "border-purple-500",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "purple",
  className,
}) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-b-2",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
};

import { cn } from "@/shared/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "white" | "purple" | "gradient";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "gradient",
  className,
}) => {
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Simple gradient spinner */}
      <div
        className={cn(
          "rounded-full border-2 border-transparent animate-spin",
          color === "gradient"
            ? "bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-400"
            : color === "purple"
            ? "border-purple-500 border-b-transparent"
            : "border-white border-b-transparent"
        )}
        style={{
          background:
            color === "gradient"
              ? "conic-gradient(from 0deg, #8b5cf6, #a855f7, #06b6d4, #8b5cf6)"
              : undefined,
          mask: "radial-gradient(farthest-side, transparent 70%, #000 71%)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent 70%, #000 71%)",
        }}
      />
    </div>
  );
};

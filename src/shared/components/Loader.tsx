import React from "react";
import { cn } from "@/shared/utils/cn";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "white" | "purple" | "gradient";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  color = "gradient",
  className,
  text,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Rice grain spinner */}
      <div className={cn("relative", sizeClasses[size], className)}>
        {/* Rice grain shape */}
        <div
          className={cn(
            "absolute inset-0 animate-spin",
            color === "gradient"
              ? "text-primary"
              : color === "purple"
                ? "text-primary"
                : "text-foreground"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full"
          >
            {/* Rice grain path */}
            <path
              d="M12 2C10.5 2 9.5 3 9.5 4.5C9.5 6 10.5 7 12 7C13.5 7 14.5 6 14.5 4.5C14.5 3 13.5 2 12 2ZM12 17C10.5 17 9.5 18 9.5 19.5C9.5 21 10.5 22 12 22C13.5 22 14.5 21 14.5 19.5C14.5 18 13.5 17 12 17ZM4.5 9.5C3 9.5 2 10.5 2 12C2 13.5 3 14.5 4.5 14.5C6 14.5 7 13.5 7 12C7 10.5 6 9.5 4.5 9.5ZM19.5 9.5C18 9.5 17 10.5 17 12C17 13.5 18 14.5 19.5 14.5C21 14.5 22 13.5 22 12C22 10.5 21 9.5 19.5 9.5Z"
              opacity="0.3"
            />
            {/* Main rice grain */}
            <path d="M12 4C11.2 4 10.5 4.7 10.5 5.5C10.5 6.3 11.2 7 12 7C12.8 7 13.5 6.3 13.5 5.5C13.5 4.7 12.8 4 12 4ZM12 17C11.2 17 10.5 17.7 10.5 18.5C10.5 19.3 11.2 20 12 20C12.8 20 13.5 19.3 13.5 18.5C13.5 17.7 12.8 17 12 17ZM5.5 10.5C4.7 10.5 4 11.2 4 12C4 12.8 4.7 13.5 5.5 13.5C6.3 13.5 7 12.8 7 12C7 11.2 6.3 10.5 5.5 10.5ZM18.5 10.5C17.7 10.5 17 11.2 17 12C17 12.8 17.7 13.5 18.5 13.5C19.3 13.5 20 12.8 20 12C20 11.2 19.3 10.5 18.5 10.5Z" />
          </svg>
        </div>
      </div>

      {/* Simple text */}
      {text && (
        <p className="text-sm text-muted-foreground mt-3 text-center max-w-xs">
          {text}
        </p>
      )}
    </div>
  );
};

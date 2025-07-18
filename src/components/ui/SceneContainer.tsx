import { ReactNode } from "react";

interface SceneContainerProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
  className?: string;
  centered?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
  full: "max-w-full",
};

export const SceneContainer = ({
  children,
  maxWidth = "4xl",
  className = "",
  centered = true,
}: SceneContainerProps) => {
  const containerClasses = centered
    ? "min-h-[calc(100vh-80px)] flex items-center justify-center p-4"
    : "min-h-[calc(100vh-80px)] p-4";

  const contentClasses = `w-full ${maxWidthClasses[maxWidth]} ${className}`;

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>{children}</div>
    </div>
  );
};

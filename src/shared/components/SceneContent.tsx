import React from "react";
import { cn } from "@/shared/utils/cn";
import { Card } from "./Card";
import { SceneHeader } from "./SceneHeader";

interface SceneContentProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  cardClassName?: string;
  showCard?: boolean;
}

export const SceneContent: React.FC<SceneContentProps> = ({
  children,
  title,
  subtitle,
  className,
  cardClassName,
  showCard = true,
}) => {
  if (!showCard) {
    return <div className={cn("w-full", className)}>{children}</div>;
  }

  const baseCardClasses =
    "glass-light backdrop-blur-sm border border-primary/20 shadow-lg p-8";
  const finalCardClasses = cardClassName
    ? cn(baseCardClasses, cardClassName)
    : baseCardClasses;

  return (
    <div className={cn("w-full", className)}>
      <Card className={finalCardClasses}>
        {title && <SceneHeader title={title} subtitle={subtitle} />}
        {children}
      </Card>
    </div>
  );
};

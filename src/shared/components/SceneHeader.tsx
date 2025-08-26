import React from "react";
import { Text } from "./Text";

interface SceneHeaderProps {
  title: string;
  subtitle?: string;
}

export const SceneHeader: React.FC<SceneHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="text-center space-y-3 mb-8">
      <div className="relative">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground animate-pulse">
          {title}
        </h1>
        <div className="absolute inset-0 blur-xl bg-gradient-to-r from-primary/30 via-primary-hover/30 to-primary/30 rounded-lg -z-10"></div>
      </div>
      <div className="relative">
        <Text
          variant="subtitle"
          className="text-xl text-muted-foreground font-medium"
        >
          {subtitle}
        </Text>
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 rounded-full bg-primary/30"></div>
      </div>
    </div>
  );
};

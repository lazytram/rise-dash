import React from "react";
import { Text } from "@/components/ui/Text";

interface SceneHeaderProps {
  title: string;
  subtitle: string;
}

export const SceneHeader: React.FC<SceneHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="text-center space-y-2 mb-6">
      <div className="relative">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white animate-pulse">
          {title}
        </h1>
        <div className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 rounded-lg -z-10"></div>
      </div>
      <div className="relative">
        <Text variant="subtitle" className="text-xl text-white/90 font-medium">
          {subtitle}
        </Text>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full bg-white/30"></div>
      </div>
    </div>
  );
};

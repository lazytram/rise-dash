import React from "react";
import { Text } from "@/components/ui/Text";

interface SceneHeaderProps {
  title: string;
  subtitle: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}

export const SceneHeader: React.FC<SceneHeaderProps> = ({
  title,
  subtitle,
  gradientFrom,
  gradientVia,
  gradientTo,
}) => {
  return (
    <div className="text-center space-y-2 mb-6">
      <div className="relative">
        <div
          className="absolute inset-0 blur-xl opacity-30 animate-pulse"
          style={{
            background: `linear-gradient(to right, ${gradientFrom}, ${gradientVia}, ${gradientTo})`,
          }}
        ></div>
        <h1
          className="relative text-3xl md:text-4xl font-bold mb-2"
          style={{
            background: `linear-gradient(to right, ${gradientFrom}, ${gradientVia}, ${gradientTo})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </h1>
      </div>
      <div className="relative">
        <Text variant="subtitle" className="text-xl text-white/90 font-medium">
          {subtitle}
        </Text>
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full"
          style={{
            background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
          }}
        ></div>
      </div>
    </div>
  );
};

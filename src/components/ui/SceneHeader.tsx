import React from "react";
import { Text } from "@/components/ui/Text";
import { getMenuColor, MenuColorKey } from "@/constants/colors";

interface SceneHeaderProps {
  title: string;
  subtitle: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  menuColorKey?: MenuColorKey; // New prop for automatic color selection
}

export const SceneHeader: React.FC<SceneHeaderProps> = ({
  title,
  subtitle,
  gradientFrom,
  gradientVia,
  gradientTo,
  menuColorKey,
}) => {
  // Use menu color if provided, otherwise use custom gradients
  const colors = menuColorKey
    ? getMenuColor(menuColorKey).titleGradient
    : { from: gradientFrom!, via: gradientVia!, to: gradientTo! };

  return (
    <div className="text-center space-y-2 mb-6">
      <div className="relative">
        <div
          className="absolute inset-0 blur-xl opacity-30 animate-pulse"
          style={{
            background: `linear-gradient(to right, ${colors.from}, ${colors.via}, ${colors.to})`,
          }}
        ></div>
        <h1
          className="relative text-3xl md:text-4xl font-bold mb-2"
          style={{
            background: `linear-gradient(to right, ${colors.from}, ${colors.via}, ${colors.to})`,
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
            background: `linear-gradient(to right, ${colors.from}, ${colors.to})`,
          }}
        ></div>
      </div>
    </div>
  );
};

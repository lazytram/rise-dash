import React from "react";
import { SceneContainer } from "./SceneContainer";
import { SceneContent } from "./SceneContent";
import { useScene } from "../hooks/useScene";

interface SceneProps {
  sceneKey: string;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
  config?: {
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    background?: "none" | "gradient" | "glass" | "pattern";
    fullHeight?: boolean;
    showCard?: boolean;
  };
}

export const Scene: React.FC<SceneProps> = ({
  sceneKey,
  children,
  className,
  cardClassName,
  config,
}) => {
  const { config: sceneConfig, title, subtitle } = useScene(sceneKey, config);

  return (
    <SceneContainer
      maxWidth={sceneConfig.maxWidth}
      padding={sceneConfig.padding}
      background={sceneConfig.background}
      fullHeight={sceneConfig.fullHeight}
      className={className}
    >
      <SceneContent
        title={title}
        subtitle={subtitle}
        showCard={sceneConfig.showCard}
        cardClassName={cardClassName}
      >
        {children}
      </SceneContent>
    </SceneContainer>
  );
};

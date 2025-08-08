import { useTranslations } from "./useTranslations";

interface SceneConfig {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "none" | "gradient" | "glass" | "pattern";
  fullHeight?: boolean;
  showCard?: boolean;
}

export const useScene = (sceneKey: string, config?: SceneConfig) => {
  const { t } = useTranslations();

  const defaultConfig: SceneConfig = {
    maxWidth: "4xl",
    padding: "lg",
    background: "none",
    fullHeight: false,
    showCard: true,
    ...config,
  };

  const getSceneTitle = () => t(`scenes.${sceneKey}.title`);
  const getSceneSubtitle = () => t(`scenes.${sceneKey}.subtitle`);

  return {
    config: defaultConfig,
    title: getSceneTitle(),
    subtitle: getSceneSubtitle(),
  };
};

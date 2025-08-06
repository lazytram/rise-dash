import { useTranslations } from "@/shared/hooks/useTranslations";

export type EnemyType = "samurai" | "ninja" | "boss";

export interface EnemyData {
  type: EnemyType;
  name: string;
  description: string;
  attack: string;
  frequency: string;
  tip: string;
  color: string;
  icon: string;
  difficulty: string;
  strategy: string;
}

export interface ColorScheme {
  bg: string;
  border: string;
  text: string;
  accent: string;
  card: string;
  cardText: string;
  gradient: string;
  badge: string;
}

export const useEnemyData = () => {
  const { t } = useTranslations();

  const getColorClasses = (color: string): ColorScheme => {
    const schemes = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        accent: "text-blue-600",
        card: "bg-blue-100",
        cardText: "text-blue-900",
        gradient: "from-blue-500 to-blue-600",
        badge: "bg-blue-200 text-blue-800",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-800",
        accent: "text-purple-600",
        card: "bg-purple-100",
        cardText: "text-purple-900",
        gradient: "from-purple-500 to-purple-600",
        badge: "bg-purple-200 text-purple-800",
      },
      red: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        accent: "text-red-600",
        card: "bg-red-100",
        cardText: "text-red-900",
        gradient: "from-red-500 to-red-600",
        badge: "bg-red-200 text-red-800",
      },
    };
    return schemes[color as keyof typeof schemes];
  };

  const enemies: EnemyData[] = [
    {
      type: "samurai",
      name: t("scenes.game.enemyInfo.enemies.samurai.name"),
      description: t("scenes.game.enemyInfo.enemies.samurai.description"),
      attack: t("scenes.game.enemyInfo.enemies.samurai.attack"),
      frequency: t("scenes.game.enemyInfo.enemies.samurai.frequency"),
      tip: t("scenes.game.enemyInfo.enemies.samurai.tip"),
      color: "blue",
      icon: "⚔️",
      difficulty: t("scenes.game.enemyInfo.enemies.samurai.difficulty"),
      strategy: t("scenes.game.enemyInfo.enemies.samurai.strategy"),
    },
    {
      type: "ninja",
      name: t("scenes.game.enemyInfo.enemies.ninja.name"),
      description: t("scenes.game.enemyInfo.enemies.ninja.description"),
      attack: t("scenes.game.enemyInfo.enemies.ninja.attack"),
      frequency: t("scenes.game.enemyInfo.enemies.ninja.frequency"),
      tip: t("scenes.game.enemyInfo.enemies.ninja.tip"),
      color: "purple",
      icon: "🥷",
      difficulty: t("scenes.game.enemyInfo.enemies.ninja.difficulty"),
      strategy: t("scenes.game.enemyInfo.enemies.ninja.strategy"),
    },
    {
      type: "boss",
      name: t("scenes.game.enemyInfo.enemies.boss.name"),
      description: t("scenes.game.enemyInfo.enemies.boss.description"),
      attack: t("scenes.game.enemyInfo.enemies.boss.attack"),
      frequency: t("scenes.game.enemyInfo.enemies.boss.frequency"),
      tip: t("scenes.game.enemyInfo.enemies.boss.tip"),
      color: "red",
      icon: "👹",
      difficulty: t("scenes.game.enemyInfo.enemies.boss.difficulty"),
      strategy: t("scenes.game.enemyInfo.enemies.boss.strategy"),
    },
  ];

  return {
    enemies,
    getColorClasses,
  };
};

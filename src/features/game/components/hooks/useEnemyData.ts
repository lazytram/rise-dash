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
        bg: "bg-[#7967e5]/10",
        border: "border-[#7967e5]/30",
        text: "text-[#7967e5]",
        accent: "text-[#7967e5]",
        card: "bg-[#7967e5]/5",
        cardText: "text-[#7967e5]",
        gradient: "from-[#7967e5] to-[#99eafc]",
        badge: "bg-[#7967e5]/20 text-[#7967e5]",
      },
      purple: {
        bg: "bg-[#99eafc]/10",
        border: "border-[#99eafc]/30",
        text: "text-[#99eafc]",
        accent: "text-[#99eafc]",
        card: "bg-[#99eafc]/5",
        cardText: "text-[#99eafc]",
        gradient: "from-[#99eafc] to-[#7967e5]",
        badge: "bg-[#99eafc]/20 text-[#99eafc]",
      },
      red: {
        bg: "bg-[#3a1344]/10",
        border: "border-[#3a1344]/30",
        text: "text-[#3a1344]",
        accent: "text-[#3a1344]",
        card: "bg-[#3a1344]/5",
        cardText: "text-[#3a1344]",
        gradient: "from-[#3a1344] to-[#7967e5]",
        badge: "bg-[#3a1344]/20 text-[#3a1344]",
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

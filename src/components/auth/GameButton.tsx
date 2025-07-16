"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { CircularButton } from "@/components/ui/CircularButton";

export function GameButton() {
  const { t } = useTranslations();

  return (
    <CircularButton
      href="/"
      icon={<span className="text-2xl">🎮</span>}
      tooltip={t("game.title")}
      gradientFrom="#4ade80"
      gradientTo="#16a34a"
    />
  );
}

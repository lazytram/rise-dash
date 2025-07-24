"use client";

import Game from "./Game";
import { useTranslations } from "@/shared/hooks/useTranslations";

export function GameScreen() {
  const { t } = useTranslations();

  return (
    <>
      <div className="flex justify-between mb-8 w-full">
        <h1 className="text-4xl font-bold text-white text-center flex-1">
          {t("common.title")}
        </h1>
      </div>
      <Game />
    </>
  );
}

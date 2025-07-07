"use client";

import Game from "@/components/Game";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslations } from "@/hooks/useTranslations";

export default function Home() {
  const { t } = useTranslations();

  return (
    <main className="bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] max-xs:p-5 p-14 flex justify-center rounded-[20px] min-h-[calc(100vh_-_48px)] relative z-10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1" />
          <h1 className="text-4xl font-bold text-white text-center flex-1">
            {t("game.title")}
          </h1>
          <div className="flex-1 flex justify-end">
            <LanguageSelector />
          </div>
        </div>
        <Game />
      </div>
    </main>
  );
}

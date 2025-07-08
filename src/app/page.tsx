"use client";

import Game from "@/components/Game";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslations } from "@/hooks/useTranslations";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const { t } = useTranslations();

  return (
    <main className="bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] max-xs:p-5 p-14 flex justify-center overflow-hidden">
      <div className="container mx-auto px-4 py-8 ">
        <div className="flex flex-col items-end gap-y-4 ">
          <ConnectButton />
          <LanguageSelector />
        </div>
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold text-white text-center flex-1">
            {t("game.title")}
          </h1>
        </div>
        <Game />
      </div>
    </main>
  );
}

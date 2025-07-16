"use client";

import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";
import { Text } from "@/components/ui/Text";

export function WelcomeScreen() {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center gap-8 mt-16">
      <Image
        src="/pfp.png"
        alt="Rise Dash"
        width={128}
        height={128}
        className="rounded-full shadow-lg border-4 border-white/20"
      />
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-2 text-center">
        {t("auth.welcomeTitle")}
      </h1>
      <Text
        variant="subtitle"
        size="xl"
        className="text-white/80 mb-6 text-center max-w-xl"
      >
        {t("auth.welcomeSubtitle")}
        <br />
        {t("auth.connectWallet")}
      </Text>
    </div>
  );
}

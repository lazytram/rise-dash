"use client";

import { useState } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Leaderboard } from "@/components/game/Leaderboard";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { t } = useTranslations();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <>
      <div className="flex flex-col items-end gap-y-4 absolute top-4 right-4">
        <AuthButton />
        <LanguageSelector />
        <Button
          onClick={() => setShowLeaderboard(true)}
          variant="primary"
          size="sm"
        >
          {t("blockchain.leaderboard")}
        </Button>
      </div>

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </>
  );
}

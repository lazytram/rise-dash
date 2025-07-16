"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { CircularButton } from "@/components/ui/CircularButton";

export function InstructionsButton() {
  const { t } = useTranslations();

  return (
    <CircularButton
      href="/instructions"
      icon={<span className="text-2xl">📖</span>}
      tooltip={t("instructions.title")}
      gradientFrom="#10b981"
      gradientTo="#059669"
    />
  );
}

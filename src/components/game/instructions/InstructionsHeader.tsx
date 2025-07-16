import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { PageHeader } from "@/components/layout/PageHeader";

export const InstructionsHeader: React.FC = () => {
  const { t } = useTranslations();

  return <PageHeader title={t("instructions.title")} />;
};

import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { PageHeader } from "@/components/layout/PageHeader";

export const ProfileHeader: React.FC = () => {
  const { t } = useTranslations();

  return <PageHeader title={t("profile.title")} />;
};

import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showBackButton = true,
}) => {
  const { t } = useTranslations();
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-6 relative z-10">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {showBackButton && (
        <Button variant="secondary" size="sm" onClick={() => router.back()}>
          {t("common.back")}
        </Button>
      )}
    </div>
  );
};

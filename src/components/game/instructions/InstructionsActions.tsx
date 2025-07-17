import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const InstructionsActions: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="text-center pt-4 z-15">
      <Link href="/">
        <Button variant="primary" className="px-8 py-3 text-lg">
          {t("instructions.playNow")}
        </Button>
      </Link>
    </div>
  );
};

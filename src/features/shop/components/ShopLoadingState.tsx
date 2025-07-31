import React from "react";
import { Loader } from "@/shared/components/Loader";
import { useTranslations } from "@/shared/hooks/useTranslations";

interface ShopLoadingStateProps {
  isLoadingBalance: boolean;
  isLoadingCosts: boolean;
}

export const ShopLoadingState: React.FC<ShopLoadingStateProps> = ({
  isLoadingBalance,
  isLoadingCosts,
}) => {
  const { t } = useTranslations();

  if (!isLoadingBalance && !isLoadingCosts) {
    return null;
  }

  const loadingText =
    isLoadingBalance && isLoadingCosts
      ? t("scenes.shop.loadingData")
      : isLoadingBalance
      ? t("scenes.shop.loadingBalance")
      : t("scenes.shop.loadingCosts");

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader size="lg" color="gradient" text={loadingText} showText={true} />
    </div>
  );
};

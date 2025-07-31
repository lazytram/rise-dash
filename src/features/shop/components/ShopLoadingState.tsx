import React from "react";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Text } from "@/shared/components/Text";
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

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" color="gradient" />
      <Text variant="subtitle" size="sm" className="text-white/70 mt-4">
        {isLoadingBalance && isLoadingCosts
          ? t("scenes.shop.loadingData")
          : isLoadingBalance
          ? t("scenes.shop.loadingBalance")
          : t("scenes.shop.loadingCosts")}
      </Text>
    </div>
  );
};

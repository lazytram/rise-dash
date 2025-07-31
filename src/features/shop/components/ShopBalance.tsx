import React, { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { RiceLogo } from "@/shared/components/RiceLogo";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";

interface ShopBalanceProps {
  riceBalance: number;
  isLoadingBalance: boolean;
  progression: number;
}

export const ShopBalance: React.FC<ShopBalanceProps> = memo(
  ({ riceBalance, isLoadingBalance, progression }) => {
    const { t } = useTranslations();

    return (
      <div className="mb-8 p-4 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-xl border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="subtitle" size="sm" className="text-white/70 mb-1">
              {t("scenes.shop.riceBalance")}
            </Text>
            <div className="flex items-center space-x-2">
              {isLoadingBalance ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <Text variant="subtitle" size="sm" className="text-white/70">
                    Loading...
                  </Text>
                </div>
              ) : (
                <>
                  <Text
                    variant="title"
                    size="2xl"
                    className="text-white font-bold"
                  >
                    {riceBalance}
                  </Text>
                  <div className="w-6 h-6 flex-shrink-0">
                    <RiceLogo className="w-full h-full" size={24} />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <Text variant="subtitle" size="sm" className="text-white/70 mb-1">
              {t("scenes.shop.progression")}
            </Text>
            <Text variant="title" size="lg" className="text-white font-bold">
              {progression}%
            </Text>
          </div>
        </div>
      </div>
    );
  }
);

ShopBalance.displayName = "ShopBalance";

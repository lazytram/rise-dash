import React, { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { RiceLogo } from "@/shared/components/RiceLogo";
import { Loader } from "@/shared/components/Loader";

interface ShopBalanceProps {
  riceBalance: number;
  isLoadingBalance: boolean;
  progression: number;
}

export const ShopBalance: React.FC<ShopBalanceProps> = memo(
  ({ riceBalance, isLoadingBalance, progression }) => {
    const { t } = useTranslations();

    return (
      <div className="mb-8 p-4 glass-light rounded-xl border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="subtitle" size="sm" className="text-muted-foreground mb-1">
              {t("scenes.shop.riceBalance")}
            </Text>
            <div className="flex items-center space-x-2">
              {isLoadingBalance ? (
                <div className="flex items-center space-x-2">
                  <Loader size="sm" />
                  <Text variant="subtitle" size="sm" className="text-muted-foreground">
                    {t("features.powerUps.loading")}
                  </Text>
                </div>
              ) : (
                <>
                  <Text
                    variant="title"
                    size="2xl"
                    className="text-foreground font-bold"
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
            <Text variant="subtitle" size="sm" className="text-muted-foreground mb-1">
              {t("scenes.shop.progression")}
            </Text>
            <Text variant="title" size="lg" className="text-foreground font-bold">
              {progression}%
            </Text>
          </div>
        </div>
      </div>
    );
  }
);

ShopBalance.displayName = "ShopBalance";

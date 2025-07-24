import { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";

export const WelcomeHeader = memo(function WelcomeHeader() {
  const { t } = useTranslations();

  return (
    <>
      <Text className="text-4xl font-bold text-white mb-6">
        {t("common.title")}
      </Text>

      <Text className="text-lg text-white mb-2">
        {t("scenes.welcome.subtitle")}
      </Text>
      <Text className="text-lg text-white mb-8">
        {t("scenes.welcome.connectWallet")}
      </Text>
    </>
  );
});

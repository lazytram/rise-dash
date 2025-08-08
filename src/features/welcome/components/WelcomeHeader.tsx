import { memo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";

export const WelcomeHeader = memo(function WelcomeHeader() {
  const { t } = useTranslations();
  const { data: session, status } = useSession();
  const { isConnected } = useAccount();

  const isAuthenticated = isConnected && session && status === "authenticated";

  return (
    <div className="text-center animate-fade-in-up animation-delay-100">
      <Text className="text-responsive-2xl font-bold gradient-text mb-8 animate-scale-in">
        {t("common.title")}
      </Text>

      <div className="space-y-4 animate-fade-in-up animation-delay-200 max-w-2xl mx-auto">
        <Text className="text-responsive-lg text-[#99eafc]/90 text-balance leading-relaxed">
          {t("scenes.welcome.subtitle")}
        </Text>
        {!isAuthenticated && (
          <Text className="text-responsive text-[#99eafc]/70 text-balance leading-relaxed">
            {t("scenes.welcome.connectWallet")}
          </Text>
        )}
      </div>
    </div>
  );
});

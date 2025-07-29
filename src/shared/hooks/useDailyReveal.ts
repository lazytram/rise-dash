import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { DailyRevealService } from "@/shared/services/dailyRevealService";
import { CardType } from "@/shared/types/dailyReveal";
import { useToastStore } from "@/infrastructure/store/toastStore";
import { useTranslations } from "./useTranslations";
import { retryWithBackoff } from "../utils/retryUtils";

export const useDailyReveal = () => {
  const { address } = useAccount();
  const [isClaiming, setIsClaiming] = useState(false);
  const [riceBalance, setRiceBalance] = useState(0);
  const { showError, showSuccess, showPending } = useToastStore();
  const { t } = useTranslations();

  const claimDailyRevealReward = useCallback(
    async (cardType: CardType) => {
      if (!address) {
        showError(t("common.error"), t("features.blockchain.connectWallet"));
        return false;
      }

      setIsClaiming(true);
      showPending(
        t("features.dailyReveal.claimingReward"),
        t("features.dailyReveal.claimingRewardMessage")
      );

      try {
        const success = await retryWithBackoff(() =>
          DailyRevealService.claimDailyRevealReward(address, cardType)
        );

        if (success) {
          // Refresh RICE balance
          const newBalance = await retryWithBackoff(() =>
            DailyRevealService.getPlayerRICEBalance(address)
          );
          setRiceBalance(newBalance);

          showSuccess(
            t("features.dailyReveal.rewardClaimed"),
            t("features.dailyReveal.rewardClaimedMessage")
          );
          return true;
        } else {
          showError(
            t("common.error"),
            t("features.dailyReveal.failedToClaimReward")
          );
          return false;
        }
      } catch (error) {
        console.error("❌ Error claiming daily reveal reward:", error);
        showError(
          t("common.error"),
          t("features.dailyReveal.failedToClaimReward")
        );
        return false;
      } finally {
        setIsClaiming(false);
      }
    },
    [address, showError, showSuccess, showPending, t]
  );

  const loadRiceBalance = useCallback(async () => {
    if (!address) return;

    try {
      const balance = await retryWithBackoff(() =>
        DailyRevealService.getPlayerRICEBalance(address)
      );
      setRiceBalance(balance);
    } catch (error) {
      console.error("❌ Error loading RICE balance:", error);
    }
  }, [address]);

  return {
    claimDailyRevealReward,
    loadRiceBalance,
    riceBalance,
    isClaiming,
  };
};

import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { ProfileSection } from "./ProfileSection";

interface ProfileAchievementsProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({
  loading = false,
  error = null,
  onRetry,
}) => {
  const { t } = useTranslations();

  if (loading) {
    return (
      <ProfileSection>
        <Box variant="centered" className="flex-1">
          <LoadingSpinner className="mx-auto mb-4" />
          <Text variant="subtitle">{t("blockchain.loadingAchievements")}</Text>
        </Box>
      </ProfileSection>
    );
  }

  if (error) {
    return (
      <ProfileSection>
        <Box variant="centered" className="flex-1">
          <Text variant="error" className="mb-4">
            {error}
          </Text>
          {onRetry && (
            <Button onClick={onRetry} variant="primary">
              {t("common.retry")}
            </Button>
          )}
        </Box>
      </ProfileSection>
    );
  }

  return (
    <ProfileSection>
      <Box variant="centered" className="flex-1">
        <Text variant="title" size="2xl" className="mb-4">
          {t("profile.achievements")}
        </Text>
        <Text variant="subtitle" size="lg">
          {t("profile.comingSoon")}
        </Text>
      </Box>
    </ProfileSection>
  );
};

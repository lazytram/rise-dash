import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Box } from "@/shared/components/Box";
import { Text } from "@/shared/components/Text";
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
          <Text variant="subtitle">
            {t("scenes.profile.loadingAchievements")}
          </Text>
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
          {t("scenes.profile.achievements")}
        </Text>
        <Text variant="subtitle" className="text-white mb-2">
          {t("scenes.profile.achievements")}
        </Text>
        <Text variant="caption" className="text-white/60">
          {t("scenes.profile.comingSoon")}
        </Text>
      </Box>
    </ProfileSection>
  );
};

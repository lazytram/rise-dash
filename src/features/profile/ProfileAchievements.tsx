import React, { useState } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Button } from "@/shared/components/Button";
import { Loader } from "@/shared/components/Loader";
import { Box } from "@/shared/components/Box";
import { Text } from "@/shared/components/Text";
import { ProfileSection } from "./ProfileSection";
import { useAchievements } from "./hooks/useAchievements";
import {
  AchievementGrid,
  AchievementFilter,
  type FilterType,
  type RarityFilter,
} from "./achievements";
import { type CategoryFilter } from "./achievements/types";

export const ProfileAchievements: React.FC = () => {
  const { t } = useTranslations();
  const { achievements, loading, error, retry } = useAchievements();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeRarity, setActiveRarity] = useState<RarityFilter>("all");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  // Filtrer les achievements
  const filteredAchievements = achievements.filter((achievement) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "completed" && achievement.isCompleted) ||
      (activeFilter === "in-progress" && !achievement.isCompleted);

    const matchesRarity =
      activeRarity === "all" || achievement.rarity === activeRarity;

    const matchesCategory =
      activeCategory === "all" || achievement.category === activeCategory;

    return matchesFilter && matchesRarity && matchesCategory;
  });

  if (loading) {
    return (
      <ProfileSection>
        <Box variant="centered" className="flex-1">
          <Loader className="mx-auto mb-4" />
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
          <Button onClick={retry} variant="primary">
            {t("common.retry")}
          </Button>
        </Box>
      </ProfileSection>
    );
  }

  const completedAchievements = achievements.filter(
    (a) => a.isCompleted
  ).length;
  const totalAchievements = achievements.length;

  return (
    <ProfileSection>
      <div className="space-y-8">
        {/* Header avec statistiques */}
        <div className="text-center">
          <Text
            variant="title"
            size="2xl"
            className="mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent font-bold"
          >
            {t("scenes.profile.achievements")}
          </Text>
          <Text variant="subtitle" className="text-white/80 mb-6">
            {completedAchievements} / {totalAchievements}{" "}
            {t("scenes.profile.achievementsCompleted")}
          </Text>

          {/* Barre de progression globale */}
          <div className="w-full max-w-md mx-auto">
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (completedAchievements / totalAchievements) * 100
                  }%`,
                }}
              />
            </div>
            <Text variant="caption" className="text-gray-400 text-center">
              {Math.round((completedAchievements / totalAchievements) * 100)}%
              {t("scenes.profile.percentComplete")}
            </Text>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex justify-center">
          <AchievementFilter
            activeFilter={activeFilter}
            activeRarity={activeRarity}
            activeCategory={activeCategory}
            onFilterChange={setActiveFilter}
            onRarityChange={setActiveRarity}
            onCategoryChange={setActiveCategory}
            className="max-w-4xl"
          />
        </div>

        {/* Grille d'achievements */}
        <div className="flex justify-center">
          <AchievementGrid
            achievements={filteredAchievements}
            className="max-w-6xl"
          />
        </div>
      </div>
    </ProfileSection>
  );
};

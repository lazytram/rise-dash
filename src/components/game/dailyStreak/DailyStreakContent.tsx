"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SceneHeader } from "@/components/ui/SceneHeader";
import { DailyStreakCard } from "./DailyStreakCard";
import { RewardsTable } from "./RewardsTable";
import { useTranslations } from "@/hooks/useTranslations";
import { DailyStreakContentProps } from "./types";

export const DailyStreakContent: React.FC<DailyStreakContentProps> = ({
  className = "",
}) => {
  const { t } = useTranslations();

  return (
    <Container className={`py-6 ${className}`}>
      <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-2xl p-4">
        {/* Enhanced Header */}
        <SceneHeader
          title={t("scenes.dailyStreak.title")}
          subtitle={t("scenes.dailyStreak.subtitle")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Daily Streak Card */}
          <div className="flex flex-col items-center">
            <DailyStreakCard size={280} />
          </div>

          {/* Rewards Table */}
          <div className="flex flex-col">
            <RewardsTable />
          </div>
        </div>
      </Card>
    </Container>
  );
};

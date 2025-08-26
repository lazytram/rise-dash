import React from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import { DataTable } from "@/shared/components/DataTable";
import { RankBadge } from "@/shared/components/RankBadge";

interface LeaderboardEntryWithRank {
  rank: number;
  score: bigint;
  playerName: string;
  playerAddress: string;
}

interface LeaderboardTableProps {
  data: LeaderboardEntryWithRank[];
  userAddress?: `0x${string}`;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  data,
  userAddress,
}) => {
  const { t } = useTranslations();

  const columns = [
    {
      key: "rank",
      header: "#",
      render: (entry: LeaderboardEntryWithRank) => (
        <RankBadge rank={entry.rank} />
      ),
    },
    {
      key: "score",
      header: t("scenes.leaderboard.score"),
      render: (entry: LeaderboardEntryWithRank) => (
        <div className="text-center group-hover:scale-110 transition-transform duration-200">
          <Text variant="bold" className="text-gray-900 text-lg">
            {entry.score.toString()}
          </Text>
          <Text variant="caption" className="text-gray-600 mt-1">
            {t("features.gameplay.meters")}
          </Text>
        </div>
      ),
    },
    {
      key: "player",
      header: t("scenes.leaderboard.player"),
      render: (entry: LeaderboardEntryWithRank) => (
        <div className="text-center">
          <Text variant="body" className="text-gray-800 font-medium">
            {entry.playerName}
          </Text>
          {userAddress &&
            entry.playerAddress.toLowerCase() === userAddress.toLowerCase() && (
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-500/20 text-blue-700 rounded-full border border-blue-500/30">
                  {t("common.you")}
                </span>
              </div>
            )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      highlightRow={(entry) =>
        userAddress
          ? entry.playerAddress.toLowerCase() === userAddress.toLowerCase()
          : false
      }
      animationDelay={100}
      rowDelay={50}
    />
  );
};

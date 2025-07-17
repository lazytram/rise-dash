import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Table, TableHeader, TableCell } from "@/components/ui/Table";
import { getRankStyle } from "./utils";

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

  return (
    <div className="overflow-x-auto">
      <Table>
        <thead>
          <tr className="border-b border-gray-200">
            <TableHeader>#</TableHeader>
            <TableHeader>{t("profile.score")}</TableHeader>
            <TableHeader>{t("profile.player")}</TableHeader>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => {
            const isUserRow =
              userAddress &&
              entry.playerAddress.toLowerCase() === userAddress.toLowerCase();
            return (
              <tr
                key={`${entry.playerAddress}-${entry.rank}`}
                className={`border-b border-white/10 hover:bg-white/5 transition-all duration-200 cursor-pointer ${
                  isUserRow ? "bg-blue-500/20 border-blue-400/30 shadow-lg" : ""
                }`}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shadow-lg ${getRankStyle(
                        entry.rank
                      )}`}
                    >
                      {entry.rank}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-white/90">
                  {entry.score.toString()} {t("game.meters")}
                </TableCell>
                <TableCell className="text-white/80">
                  <div className="flex items-center gap-2">
                    {entry.playerName}
                    {isUserRow && (
                      <span className="px-2 py-1 text-xs bg-blue-500/30 text-blue-200 rounded-full border border-blue-400/50">
                        {t("common.you")}
                      </span>
                    )}
                  </div>
                </TableCell>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

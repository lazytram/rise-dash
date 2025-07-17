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
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
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
          {data.map((entry) => (
            <tr
              key={`${entry.playerAddress}-${entry.rank}`}
              className="border-b border-white/10 hover:bg-white/5 transition-all duration-200 cursor-pointer"
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
                {entry.playerName}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

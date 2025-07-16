import React, { useMemo } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { UI_COLORS } from "@/constants/colors";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

interface PlayerScore {
  score: bigint;
  timestamp: bigint;
  playerName: string;
  gameHash: string;
}

interface ProfileGameHistoryProps {
  playerScores: PlayerScore[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const ProfileGameHistory: React.FC<ProfileGameHistoryProps> = ({
  playerScores,
  loading,
  error,
  onRetry,
}) => {
  const { t } = useTranslations();

  const formatScore = (score: bigint) => {
    return score.toString();
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Table configuration with @tanstack/react-table
  const columnHelper = createColumnHelper<PlayerScore>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("score", {
        id: "index",
        header: "#",
        cell: ({ row }) => (
          <span className="font-semibold text-gray-700 text-sm">
            {row.index + 1}
          </span>
        ),
      }),
      columnHelper.accessor("score", {
        id: "score",
        header: t("profile.score"),
        cell: ({ getValue }) => (
          <span
            className="font-bold text-lg"
            style={{ color: UI_COLORS.GRADIENT_FROM }}
          >
            {formatScore(getValue())} {t("game.meters")}
          </span>
        ),
      }),
      columnHelper.accessor("timestamp", {
        id: "date",
        header: t("profile.date"),
        cell: ({ getValue }) => (
          <span className="text-gray-700 font-medium text-sm">
            {formatDate(getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("score", {
        id: "status",
        header: t("profile.status"),
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.index === 0
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.index === 0
              ? t("profile.personalBest")
              : t("profile.completed")}
          </span>
        ),
      }),
    ],
    [t, columnHelper]
  );

  const table = useReactTable({
    data: playerScores,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (loading) {
    return (
      <Box variant="centered">
        <LoadingSpinner className="mx-auto mb-4" />
        <Text variant="subtitle">{t("blockchain.loadingScores")}</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box variant="centered">
        <Text variant="error" className="mb-4">
          {error}
        </Text>
        <Button onClick={onRetry} variant="primary">
          {t("common.retry")}
        </Button>
      </Box>
    );
  }

  if (playerScores.length === 0) {
    return (
      <Box variant="centered">
        <Text variant="subtitle" className="mb-4">
          {t("blockchain.noScoresYet")}
        </Text>
        <Text variant="caption">{t("blockchain.playGameToSeeScores")}</Text>
      </Box>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-200"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3 border-b border-gray-100"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t("common.previous")}
            </Button>
            <span className="text-sm text-gray-600">
              {t("common.page")} {table.getState().pagination.pageIndex + 1}{" "}
              {t("common.of")} {table.getPageCount()}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

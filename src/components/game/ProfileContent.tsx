import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { blockchainService } from "@/services/blockchainService";
import { useTranslations } from "@/hooks/useTranslations";
import { UI_COLORS } from "@/constants/colors";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";
import { Tabs } from "@/components/ui/Tabs";
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

export const ProfileContent: React.FC = () => {
  const { t } = useTranslations();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("gameHistory");

  const loadPlayerScores = useCallback(async () => {
    try {
      setLoading(true);
      const scores = await blockchainService.getPlayerScores(address!);

      // Sort scores by score (descending) and then by timestamp (descending)
      const sortedScores = scores.sort((a, b) => {
        if (a.score !== b.score) {
          return Number(b.score - a.score);
        }
        return Number(b.timestamp - a.timestamp);
      });

      setPlayerScores(sortedScores);
    } catch (err) {
      console.error("Error loading player scores:", err);
      setError("Error loading player scores");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      loadPlayerScores();
    }
  }, [isConnected, address, loadPlayerScores]);

  const formatScore = (score: bigint) => {
    return score.toString();
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getBestScore = () => {
    if (playerScores.length === 0) return 0;
    return Number(playerScores[0].score);
  };

  const getTotalGames = () => {
    return playerScores.length;
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

  if (!isConnected) {
    return (
      <Container>
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t("profile.title")}
          </h2>
          <Text variant="error" className="mb-4">
            {t("blockchain.connectWalletToView")}
          </Text>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("profile.title")}
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              router.push("/");
            }}
          >
            {t("common.back")}
          </Button>
        </div>

        {/* Profile Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card variant="gradient-purple">
            <h3 className="text-sm font-medium opacity-90">
              {t("profile.bestScore")}
            </h3>
            <Text variant="bold" size="2xl">
              {getBestScore()} {t("game.meters")}
            </Text>
          </Card>
          <Card variant="gradient-blue">
            <h3 className="text-sm font-medium opacity-90">
              {t("profile.totalGames")}
            </h3>
            <Text variant="bold" size="2xl">
              {getTotalGames()}
            </Text>
          </Card>
          <Card variant="gradient-green">
            <h3 className="text-sm font-medium opacity-90">
              {t("profile.averageScore")}
            </h3>
            <Text variant="bold" size="2xl">
              {playerScores.length > 0
                ? Math.round(
                    playerScores.reduce(
                      (acc, score) => acc + Number(score.score),
                      0
                    ) / playerScores.length
                  )
                : 0}{" "}
              {t("game.meters")}
            </Text>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs
          tabs={[
            {
              id: "gameHistory",
              label: t("profile.gameHistory"),
              content: (
                <div>
                  {loading ? (
                    <Box variant="centered">
                      <LoadingSpinner className="mx-auto mb-4" />
                      <Text variant="subtitle">
                        {t("blockchain.loadingScores")}
                      </Text>
                    </Box>
                  ) : error ? (
                    <Box variant="centered">
                      <Text variant="error" className="mb-4">
                        {error}
                      </Text>
                      <Button onClick={loadPlayerScores} variant="primary">
                        {t("common.retry")}
                      </Button>
                    </Box>
                  ) : playerScores.length === 0 ? (
                    <Box variant="centered">
                      <Text variant="subtitle" className="mb-4">
                        {t("blockchain.noScoresYet")}
                      </Text>
                      <Text variant="caption">
                        {t("blockchain.playToEarnScores")}
                      </Text>
                    </Box>
                  ) : (
                    <div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              {table.getHeaderGroups().map((headerGroup) =>
                                headerGroup.headers.map((header) => (
                                  <th
                                    key={header.id}
                                    className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b"
                                  >
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                  </th>
                                ))
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {table.getRowModel().rows.map((row) => (
                              <tr
                                key={row.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                              >
                                {row.getVisibleCells().map((cell) => (
                                  <td
                                    key={cell.id}
                                    className="px-4 py-3 text-sm border-b"
                                  >
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {table.getPageCount() > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span>
                              Showing{" "}
                              {table.getState().pagination.pageIndex *
                                table.getState().pagination.pageSize +
                                1}
                              -
                              {Math.min(
                                (table.getState().pagination.pageIndex + 1) *
                                  table.getState().pagination.pageSize,
                                table.getFilteredRowModel().rows.length
                              )}{" "}
                              of {table.getFilteredRowModel().rows.length}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => table.previousPage()}
                              disabled={!table.getCanPreviousPage()}
                              className="flex items-center justify-center w-8 h-8 p-0"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="15,18 9,12 15,6"></polyline>
                              </svg>
                            </Button>
                            <span className="text-sm text-gray-700">
                              {table.getState().pagination.pageIndex + 1} /{" "}
                              {table.getPageCount()}
                            </span>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => table.nextPage()}
                              disabled={!table.getCanNextPage()}
                              className="flex items-center justify-center w-8 h-8 p-0"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="9,18 15,12 9,6"></polyline>
                              </svg>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ),
            },
            {
              id: "achievements",
              label: t("profile.achievements"),
              content: (
                <Box variant="centered" className="text-gray-500">
                  <p>{t("profile.comingSoon")}</p>
                </Box>
              ),
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6 pt-4 ">
          <Text variant="caption" className="text-center">
            {t("blockchain.scoresOnBlockchain")}
          </Text>
        </div>
      </Card>
    </Container>
  );
};

import { useGameHistory } from "./useGameHistory";

export const useProfileStats = () => {
  const { playerScores } = useGameHistory();

  const getBestScore = () => {
    if (playerScores.length === 0) return 0;
    return Number(playerScores[0].score);
  };

  const getTotalGames = () => {
    return playerScores.length;
  };

  const getAverageScore = () => {
    if (playerScores.length === 0) return 0;
    return Math.round(
      playerScores.reduce((acc, score) => acc + Number(score.score), 0) /
        playerScores.length
    );
  };

  return {
    bestScore: getBestScore(),
    totalGames: getTotalGames(),
    averageScore: getAverageScore(),
  };
};

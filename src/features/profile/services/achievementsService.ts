import { Achievement } from "../achievements/types";
import { MOCK_ACHIEVEMENTS } from "../achievements/constants";

export interface AchievementProgress {
  achievementId: string;
  progress: number;
  isCompleted: boolean;
}

export const achievementsService = {
  async getAchievements(): Promise<Achievement[]> {
    try {
      // TODO: Fetch achievements from blockchain
      // For now, using mock data
      const mockAchievements = [...MOCK_ACHIEVEMENTS];

      // TODO: Fetch achievement progress from blockchain
      // const progress = await blockchainService.getAchievementProgress(address);

      // TODO: Update achievements with real progress
      // mockAchievements.forEach(achievement => {
      //   const progressData = progress.find(p => p.achievementId === achievement.id);
      //   if (progressData) {
      //     achievement.progress = progressData.progress;
      //     achievement.isCompleted = progressData.isCompleted;
      //   }
      // });

      return mockAchievements;
    } catch (error) {
      console.error("Error fetching achievements:", error);
      throw new Error("Failed to load achievements");
    }
  },

  async getAchievementProgress(): Promise<AchievementProgress[]> {
    try {
      // TODO: Implement achievement progress fetching from blockchain
      // For now, returning mock data
      return MOCK_ACHIEVEMENTS.map((achievement) => ({
        achievementId: achievement.id,
        progress: achievement.progress,
        isCompleted: achievement.isCompleted,
      }));
    } catch (error) {
      console.error("Error fetching achievement progress:", error);
      throw new Error("Failed to load achievement progress");
    }
  },
};

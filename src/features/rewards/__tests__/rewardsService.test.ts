import { RewardsService } from "../rewardsService";

describe("RewardsService", () => {
  describe("calculateDistanceRewards", () => {
    it("should calculate rewards for 100m", () => {
      const rewards = RewardsService.calculateDistanceRewards(100);

      expect(rewards.totalDistance).toBe(100);
      expect(rewards.totalRice).toBe(10);
      expect(rewards.distanceRewards).toHaveLength(1);
      expect(rewards.distanceRewards[0]).toEqual({
        distance: 100,
        riceReward: 10,
        description: "100m milestone",
      });
    });

    it("should calculate rewards for 250m", () => {
      const rewards = RewardsService.calculateDistanceRewards(250);

      expect(rewards.totalDistance).toBe(250);
      expect(rewards.totalRice).toBe(25); // 2 full milestones (200m) = 20 rice + 50m partial = 5 rice = 25 total
      expect(rewards.distanceRewards).toHaveLength(3);
      expect(rewards.distanceRewards[0]).toEqual({
        distance: 100,
        riceReward: 10,
        description: "100m milestone",
      });
      expect(rewards.distanceRewards[1]).toEqual({
        distance: 200,
        riceReward: 10,
        description: "200m milestone",
      });
      expect(rewards.distanceRewards[2]).toEqual({
        distance: 250,
        riceReward: 5,
        description: "Partial reward for 50m",
      });
    });

    it("should calculate rewards for 350m", () => {
      const rewards = RewardsService.calculateDistanceRewards(350);

      expect(rewards.totalDistance).toBe(350);
      expect(rewards.totalRice).toBe(35); // 3 full milestones (300m) = 30 rice + 50m partial = 5 rice = 35 total
      expect(rewards.distanceRewards).toHaveLength(4);
      expect(rewards.distanceRewards[2]).toEqual({
        distance: 300,
        riceReward: 10,
        description: "300m milestone",
      });
      expect(rewards.distanceRewards[3]).toEqual({
        distance: 350,
        riceReward: 5,
        description: "Partial reward for 50m",
      });
    });

    it("should handle 0m distance", () => {
      const rewards = RewardsService.calculateDistanceRewards(0);

      expect(rewards.totalDistance).toBe(0);
      expect(rewards.totalRice).toBe(0);
      expect(rewards.distanceRewards).toHaveLength(0);
    });

    it("should handle small distances under 100m", () => {
      const rewards = RewardsService.calculateDistanceRewards(50);

      expect(rewards.totalDistance).toBe(50);
      expect(rewards.totalRice).toBe(5); // 50/100 * 10 = 5 rice
      expect(rewards.distanceRewards).toHaveLength(1);
      expect(rewards.distanceRewards[0]).toEqual({
        distance: 50,
        riceReward: 5,
        description: "Partial reward for 50m",
      });
    });
  });

  describe("formatDistance", () => {
    it("should format meters correctly", () => {
      expect(RewardsService.formatDistance(50)).toBe("50m");
      expect(RewardsService.formatDistance(100)).toBe("100m");
      expect(RewardsService.formatDistance(999)).toBe("999m");
    });

    it("should format kilometers correctly", () => {
      expect(RewardsService.formatDistance(1000)).toBe("1.0km");
      expect(RewardsService.formatDistance(1500)).toBe("1.5km");
      expect(RewardsService.formatDistance(2500)).toBe("2.5km");
    });
  });

  describe("formatRice", () => {
    it("should format rice amounts correctly", () => {
      expect(RewardsService.formatRice(0)).toBe("0 Rice");
      expect(RewardsService.formatRice(10)).toBe("10 Rice");
      expect(RewardsService.formatRice(100)).toBe("100 Rice");
    });
  });

  describe("isNewMilestone", () => {
    it("should return true for milestone distances", () => {
      expect(RewardsService.isNewMilestone(100)).toBe(true);
      expect(RewardsService.isNewMilestone(200)).toBe(true);
      expect(RewardsService.isNewMilestone(300)).toBe(true);
    });

    it("should return false for non-milestone distances", () => {
      expect(RewardsService.isNewMilestone(50)).toBe(false);
      expect(RewardsService.isNewMilestone(150)).toBe(false);
      expect(RewardsService.isNewMilestone(250)).toBe(false);
    });

    it("should return false for 0 distance", () => {
      expect(RewardsService.isNewMilestone(0)).toBe(false);
    });
  });

  describe("getNextMilestone", () => {
    it("should return the next milestone distance", () => {
      expect(RewardsService.getNextMilestone(50)).toBe(100);
      expect(RewardsService.getNextMilestone(150)).toBe(200);
      expect(RewardsService.getNextMilestone(250)).toBe(300);
    });

    it("should return 100 for 0 distance", () => {
      expect(RewardsService.getNextMilestone(0)).toBe(100);
    });
  });

  describe("getProgressToNextMilestone", () => {
    it("should calculate progress correctly", () => {
      expect(RewardsService.getProgressToNextMilestone(50)).toBe(50);
      expect(RewardsService.getProgressToNextMilestone(75)).toBe(75);
      expect(RewardsService.getProgressToNextMilestone(0)).toBe(0);
    });

    it("should return 0 for milestone distances", () => {
      expect(RewardsService.getProgressToNextMilestone(100)).toBe(0);
      expect(RewardsService.getProgressToNextMilestone(200)).toBe(0);
    });
  });
});

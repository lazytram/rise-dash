import { DistanceReward, GameRewards } from "../../shared/types/game";

// Rewards configuration
export const REWARDS_CONFIG = {
  RICE_PER_100M: 10,
  MILESTONE_DISTANCE: 100,
} as const;

/**
 * Service to manage distance-based rewards
 */
export class RewardsService {
  /**
   * Calculates rewards based on distance traveled
   * @param distance - Distance in meters
   * @returns Object containing calculated rewards
   */
  static calculateDistanceRewards(distance: number): GameRewards {
    const distanceRewards: DistanceReward[] = [];
    let totalRice = 0;

    // Calculate rewards for each 100m milestone reached
    const milestones = Math.floor(distance / REWARDS_CONFIG.MILESTONE_DISTANCE);

    for (let i = 1; i <= milestones; i++) {
      const milestoneDistance = i * REWARDS_CONFIG.MILESTONE_DISTANCE;
      const riceReward = REWARDS_CONFIG.RICE_PER_100M;

      distanceRewards.push({
        distance: milestoneDistance,
        riceReward,
        description: `${milestoneDistance}m milestone`,
      });

      totalRice += riceReward;
    }

    // Add partial reward for remaining distance
    const remainingDistance = distance % REWARDS_CONFIG.MILESTONE_DISTANCE;
    if (remainingDistance > 0) {
      const partialRice = Math.floor(
        (remainingDistance / REWARDS_CONFIG.MILESTONE_DISTANCE) *
          REWARDS_CONFIG.RICE_PER_100M
      );
      if (partialRice > 0) {
        distanceRewards.push({
          distance: distance,
          riceReward: partialRice,
          description: `Partial reward for ${remainingDistance}m`,
        });
        totalRice += partialRice;
      }
    }

    return {
      totalDistance: distance,
      totalRice,
      distanceRewards,
    };
  }

  /**
   * Formats distance for display
   * @param meters - Distance in meters
   * @returns Formatted distance (e.g., "100m", "1.5km")
   */
  static formatDistance(meters: number): string {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}km`;
    }
    return `${Math.floor(meters)}m`;
  }

  /**
   * Formats rice amount for display
   * @param amount - Rice quantity
   * @returns Formatted amount (e.g., "10 Rice")
   */
  static formatRice(amount: number): string {
    return `${amount} Rice`;
  }

  /**
   * Checks if a distance reaches a new milestone
   * @param distance - Current distance
   * @returns true if a new milestone is reached
   */
  static isNewMilestone(distance: number): boolean {
    return distance > 0 && distance % REWARDS_CONFIG.MILESTONE_DISTANCE === 0;
  }

  /**
   * Gets the next milestone to reach
   * @param currentDistance - Current distance
   * @returns Distance of the next milestone
   */
  static getNextMilestone(currentDistance: number): number {
    const currentMilestone = Math.floor(
      currentDistance / REWARDS_CONFIG.MILESTONE_DISTANCE
    );
    return (currentMilestone + 1) * REWARDS_CONFIG.MILESTONE_DISTANCE;
  }

  /**
   * Calculates progress percentage towards the next milestone
   * @param currentDistance - Current distance
   * @returns Progress percentage (0-100)
   */
  static getProgressToNextMilestone(currentDistance: number): number {
    const remainingDistance =
      currentDistance % REWARDS_CONFIG.MILESTONE_DISTANCE;
    return (remainingDistance / REWARDS_CONFIG.MILESTONE_DISTANCE) * 100;
  }
}

import { DistanceReward, GameRewards } from "../types/game";

// Reward rate: 10 rice per 100 meters
const RICE_PER_100M = 10;

export function calculateDistanceRewards(distance: number): GameRewards {
  const distanceRewards: DistanceReward[] = [];
  let totalRice = 0;

  // Calculate rewards for each 100m milestone
  const milestones = Math.floor(distance / 100);

  for (let i = 1; i <= milestones; i++) {
    const milestoneDistance = i * 100;
    const riceReward = RICE_PER_100M;

    distanceRewards.push({
      distance: milestoneDistance,
      riceReward,
      description: `${milestoneDistance}m milestone`,
    });

    totalRice += riceReward;
  }

  // Add partial reward for remaining distance only if it's less than 100m total
  const remainingDistance = distance % 100;
  if (remainingDistance > 0 && distance < 100) {
    const partialRice = Math.floor((remainingDistance / 100) * RICE_PER_100M);
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

export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${Math.floor(meters)}m`;
}

export function formatRice(amount: number): string {
  return `${amount} Rice`;
}

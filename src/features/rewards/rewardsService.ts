import { DistanceReward, GameRewards } from "../../shared/types/game";

// Configuration des récompenses
export const REWARDS_CONFIG = {
  RICE_PER_100M: 10,
  MILESTONE_DISTANCE: 100,
} as const;

/**
 * Service pour gérer les récompenses basées sur la distance
 */
export class RewardsService {
  /**
   * Calcule les récompenses basées sur la distance parcourue
   * @param distance - Distance en mètres
   * @returns Objet contenant les récompenses calculées
   */
  static calculateDistanceRewards(distance: number): GameRewards {
    const distanceRewards: DistanceReward[] = [];
    let totalRice = 0;

    // Calcul des récompenses pour chaque palier de 100m atteint
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

    // Ajout d'une récompense partielle pour la distance restante
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
   * Formate la distance pour l'affichage
   * @param meters - Distance en mètres
   * @returns Distance formatée (ex: "100m", "1.5km")
   */
  static formatDistance(meters: number): string {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}km`;
    }
    return `${Math.floor(meters)}m`;
  }

  /**
   * Formate le montant de riz pour l'affichage
   * @param amount - Quantité de riz
   * @returns Montant formaté (ex: "10 Rice")
   */
  static formatRice(amount: number): string {
    return `${amount} Rice`;
  }

  /**
   * Vérifie si une distance atteint un nouveau palier
   * @param distance - Distance actuelle
   * @returns true si un nouveau palier est atteint
   */
  static isNewMilestone(distance: number): boolean {
    return distance > 0 && distance % REWARDS_CONFIG.MILESTONE_DISTANCE === 0;
  }

  /**
   * Obtient le prochain palier à atteindre
   * @param currentDistance - Distance actuelle
   * @returns Distance du prochain palier
   */
  static getNextMilestone(currentDistance: number): number {
    const currentMilestone = Math.floor(
      currentDistance / REWARDS_CONFIG.MILESTONE_DISTANCE
    );
    return (currentMilestone + 1) * REWARDS_CONFIG.MILESTONE_DISTANCE;
  }

  /**
   * Calcule le pourcentage de progression vers le prochain palier
   * @param currentDistance - Distance actuelle
   * @returns Pourcentage de progression (0-100)
   */
  static getProgressToNextMilestone(currentDistance: number): number {
    const remainingDistance =
      currentDistance % REWARDS_CONFIG.MILESTONE_DISTANCE;
    return (remainingDistance / REWARDS_CONFIG.MILESTONE_DISTANCE) * 100;
  }
}

import { PLAYER_COLORS } from "@/shared/constants/colors";
import { Player } from "@/shared/types/game";
import { PowerUpType } from "@/shared/types/powerUps";
import {
  getMaxAmmo,
  getPowerUpService,
} from "@/shared/services/powerUpService";

// Create player with dynamic power-up levels from service
const createPlayer = (): Player => {
  const powerUpService = getPowerUpService();

  return {
    x: 100,
    y: 300,
    width: 30,
    height: 30,
    velocityY: 0,
    isJumping: false,
    color: PLAYER_COLORS.BODY,
    riceRocketAmmo: getMaxAmmo(),
    maxRiceRocketAmmo: getMaxAmmo(),
    lastAmmoRechargeTime: Date.now(),
    // Power-up states
    hasShield: false,
    hasInfiniteAmmo: false,
    hasJumpBoost: false, // Renamed from hasSpeedBoost
    hasSlowMotion: false, // New power-up
    hasMultiShot: false,
    powerUpEndTimes: {
      shield: 0,
      infiniteAmmo: 0,
      jumpBoost: 0, // Renamed from speedBoost
      slowMotion: 0, // New power-up
      multiShot: 0,
    },
    // Stacked power-ups inventory
    stackedPowerUps: {},
    // Power-up levels from service
    powerUpLevels: {
      [PowerUpType.SHIELD]: powerUpService.getPowerUpLevel(PowerUpType.SHIELD),
      [PowerUpType.INFINITE_AMMO]: powerUpService.getPowerUpLevel(
        PowerUpType.INFINITE_AMMO
      ),
      [PowerUpType.JUMP_BOOST]: powerUpService.getPowerUpLevel(
        PowerUpType.JUMP_BOOST
      ),
      [PowerUpType.SLOW_MOTION]: powerUpService.getPowerUpLevel(
        PowerUpType.SLOW_MOTION
      ),
      [PowerUpType.MULTI_SHOT]: powerUpService.getPowerUpLevel(
        PowerUpType.MULTI_SHOT
      ),
      [PowerUpType.RICE_ROCKET_AMMO]: powerUpService.getPowerUpLevel(
        PowerUpType.RICE_ROCKET_AMMO
      ),
      [PowerUpType.PHOENIX_PACT]: powerUpService.getPowerUpLevel(
        PowerUpType.PHOENIX_PACT
      ),
    },
  };
};

export const player = createPlayer();

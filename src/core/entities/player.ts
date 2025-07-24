import { PLAYER_COLORS } from "@/shared/constants/colors";
import { Player } from "@/shared/types/game";
import { PowerUpType } from "@/shared/types/powerUps";
import { getMaxAmmo } from "@/shared/services/powerUpService";

export const player: Player = {
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
  // Power-up levels
  powerUpLevels: {
    [PowerUpType.SHIELD]: 1,
    [PowerUpType.INFINITE_AMMO]: 1,
    [PowerUpType.JUMP_BOOST]: 1,
    [PowerUpType.SLOW_MOTION]: 1,
    [PowerUpType.MULTI_SHOT]: 1,
    [PowerUpType.RICE_ROCKET_AMMO]: 1,
  },
};

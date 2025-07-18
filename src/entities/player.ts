import { PLAYER_COLORS } from "@/constants/colors";
import { Player } from "@/types/game";
import { getMaxAmmo } from "@/services/powerUpService";

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
  hasSpeedBoost: false,
  hasMultiShot: false,
  powerUpEndTimes: {
    shield: 0,
    infiniteAmmo: 0,
    speedBoost: 0,
    multiShot: 0,
  },
  // Power-up levels
  powerUpLevels: {
    shield: 1,
    infiniteAmmo: 1,
    speedBoost: 1,
    multiShot: 1,
    riceRocketAmmo: 1,
  },
};

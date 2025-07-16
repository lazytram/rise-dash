import { PLAYER_COLORS } from "@/constants/colors";
import { Player } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";

export const player: Player = {
  x: 100,
  y: 300,
  width: 30,
  height: 30,
  velocityY: 0,
  isJumping: false,
  color: PLAYER_COLORS.BODY,
  riceRocketAmmo: GAME_CONSTANTS.MAX_RICE_ROCKET_AMMO,
  maxRiceRocketAmmo: GAME_CONSTANTS.MAX_RICE_ROCKET_AMMO,
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
};

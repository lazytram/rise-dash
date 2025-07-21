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
    shield: 1,
    infiniteAmmo: 1,
    jumpBoost: 1, // Renamed from speedBoost
    slowMotion: 1, // New power-up
    multiShot: 1,
    riceRocketAmmo: 1,
  },
};

import { PLAYER_COLORS } from "@/constants/colors";
import { Player } from "@/types/game";

export const player: Player = {
  x: 100,
  y: 300,
  width: 30,
  height: 30,
  velocityY: 0,
  isJumping: false,
  color: PLAYER_COLORS.BODY,
};

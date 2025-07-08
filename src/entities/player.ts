import { Player } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import { getGroundY } from "@/utils/entityUtils";

export const resetPlayer = (player: Player): Player => ({
  ...player,
  x: 100,
  y: 300,
  velocityY: 0,
  isJumping: false,
});

export const updatePlayerPhysics = (player: Player): Player => {
  const newPlayer = { ...player };

  // Apply gravity
  newPlayer.velocityY += GAME_CONSTANTS.GRAVITY;
  newPlayer.y += newPlayer.velocityY;

  // Check ground collision
  const groundY = getGroundY() - newPlayer.height;

  if (newPlayer.y >= groundY) {
    newPlayer.y = groundY;
    newPlayer.velocityY = 0;
    newPlayer.isJumping = false;
  }

  return newPlayer;
};

export const canJump = (player: Player): boolean => !player.isJumping;

export const makePlayerJump = (player: Player): Player => {
  if (!canJump(player)) return player;

  return {
    ...player,
    velocityY: GAME_CONSTANTS.JUMP_STRENGTH,
    isJumping: true,
  };
};

import { Player, GameState } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";

export class GameLogic {
  static createInitialGameState(): GameState {
    return {
      player: {
        x: 100,
        y: 300,
        width: 30,
        height: 30,
        velocityY: 0,
        isJumping: false,
        color: "#ff6b6b",
      },
      distance: 0,
      isGameRunning: false,
      isGameOver: false,
    };
  }

  static resetPlayer(player: Player): Player {
    return {
      ...player,
      x: 100,
      y: 300,
      velocityY: 0,
      isJumping: false,
    };
  }

  static updatePlayerPhysics(player: Player): Player {
    const newPlayer = { ...player };

    // Apply gravity
    newPlayer.velocityY += GAME_CONSTANTS.GRAVITY;
    newPlayer.y += newPlayer.velocityY;

    // Check if player touches the ground
    const groundY =
      GAME_CONSTANTS.CANVAS_HEIGHT -
      GAME_CONSTANTS.GROUND_HEIGHT -
      newPlayer.height;
    if (newPlayer.y >= groundY) {
      newPlayer.y = groundY;
      newPlayer.velocityY = 0;
      newPlayer.isJumping = false;
    }

    return newPlayer;
  }

  static canJump(player: Player): boolean {
    return !player.isJumping;
  }

  static makePlayerJump(player: Player): Player {
    if (!this.canJump(player)) return player;

    return {
      ...player,
      velocityY: GAME_CONSTANTS.JUMP_STRENGTH,
      isJumping: true,
    };
  }

  static updateDistance(currentDistance: number): number {
    return currentDistance + 1;
  }

  static formatDistance(distance: number): number {
    return Math.floor(distance / 10);
  }
}

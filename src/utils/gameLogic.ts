import { Player, GameState, RiceRocket } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import { player } from "@/entities/player";

export class GameLogic {
  static createInitialGameState(): GameState {
    return {
      player: player,
      riceRockets: [],
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

  static createRiceRocket(player: Player): RiceRocket {
    return {
      id: Date.now().toString() + Math.random(),
      x: player.x + player.width,
      y: player.y + player.height / 2,
      width: GAME_CONSTANTS.RICE_ROCKET_SIZE,
      height: GAME_CONSTANTS.RICE_ROCKET_SIZE,
      velocityX: GAME_CONSTANTS.RICE_ROCKET_SPEED,
      color: "#ffffff",
    };
  }

  static updateRiceRockets(riceRockets: RiceRocket[]): RiceRocket[] {
    return riceRockets
      .map((rocket) => ({
        ...rocket,
        x: rocket.x + rocket.velocityX,
      }))
      .filter((rocket) => rocket.x < GAME_CONSTANTS.CANVAS_WIDTH + 50);
  }

  static addRiceRocket(gameState: GameState): GameState {
    const newRiceRocket = this.createRiceRocket(gameState.player);
    return {
      ...gameState,
      riceRockets: [...gameState.riceRockets, newRiceRocket],
    };
  }
}

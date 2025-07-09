import { Player, GameState, RiceRocket, Sushi } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import { player } from "@/entities/player";

export class GameLogic {
  // ================================
  // GAME STATE MANAGEMENT
  // ================================

  static createInitialGameState(): GameState {
    return {
      player: player,
      riceRockets: [],
      sushis: [],
      distance: 0,
      isGameRunning: false,
      isGameOver: false,
    };
  }

  static updateGameState(gameState: GameState): GameState {
    if (!gameState.isGameRunning || gameState.isGameOver) {
      return gameState;
    }

    // Update all game entities
    const updatedPlayer = this.updatePlayerPhysics(gameState.player);
    const updatedRiceRockets = this.updateRiceRockets(gameState.riceRockets);
    const updatedSushis = this.updateSushis(gameState.sushis);
    const updatedDistance = this.updateDistance(gameState.distance);

    let newGameState = {
      ...gameState,
      player: updatedPlayer,
      riceRockets: updatedRiceRockets,
      sushis: updatedSushis,
      distance: updatedDistance,
    };

    // Spawn new sushi if needed
    if (this.shouldSpawnSushi(newGameState)) {
      newGameState = this.addSushi(newGameState);
    }

    // Check for game over conditions
    if (this.checkPlayerSushiCollisions(newGameState)) {
      newGameState = {
        ...newGameState,
        isGameRunning: false,
        isGameOver: true,
      };
    }

    return newGameState;
  }

  // ================================
  // PLAYER MANAGEMENT
  // ================================

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

    // Check ground collision
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

  // ================================
  // RICE ROCKET MANAGEMENT
  // ================================

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

  // ================================
  // SUSHI MANAGEMENT
  // ================================

  static createSushi(): Sushi {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - player.height, // Same height as player, on the ground
      width: player.width, // Same width as player
      height: player.height, // Same height as player
      velocityX: GAME_CONSTANTS.SUSHI_SPEED,
      color: "#ff9500",
    };
  }

  static updateSushis(sushis: Sushi[]): Sushi[] {
    return sushis
      .map((sushi) => ({
        ...sushi,
        x: sushi.x + sushi.velocityX,
      }))
      .filter((sushi) => sushi.x > -sushi.width);
  }

  static shouldSpawnSushi(gameState: GameState): boolean {
    if (gameState.sushis.length === 0) {
      return gameState.distance > 100; // Start spawning after some distance
    }

    const lastSushi = gameState.sushis[gameState.sushis.length - 1];
    const distanceFromLast = GAME_CONSTANTS.CANVAS_WIDTH - lastSushi.x;
    return distanceFromLast >= GAME_CONSTANTS.SUSHI_SPAWN_DISTANCE;
  }

  static addSushi(gameState: GameState): GameState {
    const newSushi = this.createSushi();
    return {
      ...gameState,
      sushis: [...gameState.sushis, newSushi],
    };
  }

  // ================================
  // COLLISION DETECTION
  // ================================

  static checkCollisionWithSushi(player: Player, sushi: Sushi): boolean {
    return (
      player.x < sushi.x + sushi.width &&
      player.x + player.width > sushi.x &&
      player.y < sushi.y + sushi.height &&
      player.y + player.height > sushi.y
    );
  }

  static checkPlayerSushiCollisions(gameState: GameState): boolean {
    return gameState.sushis.some((sushi) =>
      this.checkCollisionWithSushi(gameState.player, sushi)
    );
  }

  // ================================
  // UTILITY FUNCTIONS
  // ================================

  static updateDistance(currentDistance: number): number {
    return currentDistance + 1;
  }

  static formatDistance(distance: number): number {
    return Math.floor(distance / 10);
  }
}

import { Player, GameState, RiceRocket, Sushi, Torii } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import {
  RICE_ROCKET_COLORS,
  SUSHI_COLORS,
  TORII_COLORS,
} from "@/constants/colors";
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
      toriis: [],
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
    const updatedToriis = this.updateToriis(gameState.toriis);
    const updatedDistance = this.updateDistance(gameState.distance);

    let newGameState = {
      ...gameState,
      player: updatedPlayer,
      riceRockets: updatedRiceRockets,
      sushis: updatedSushis,
      toriis: updatedToriis,
      distance: updatedDistance,
    };

    // Spawn new entities
    newGameState = this.spawnEntities(newGameState);

    // Check for game over conditions
    if (this.checkPlayerSushiCollisions(newGameState)) {
      newGameState = {
        ...newGameState,
        isGameOver: true,
        isGameRunning: false,
      };
    }

    return newGameState;
  }

  // ================================
  // ENTITY SPAWNING
  // ================================

  static spawnEntities(gameState: GameState): GameState {
    let newGameState = gameState;

    if (this.shouldSpawnSushi(newGameState)) {
      newGameState = this.addSushi(newGameState);
    }

    // Spawn Torii
    if (this.shouldSpawnTorii(newGameState)) {
      newGameState = this.addTorii(newGameState);
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
      color: RICE_ROCKET_COLORS.BODY,
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
      color: SUSHI_COLORS.BASE,
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
    const spawnDistance =
      GAME_CONSTANTS.SUSHI_MIN_SPAWN_DISTANCE +
      Math.random() *
        (GAME_CONSTANTS.SUSHI_MAX_SPAWN_DISTANCE -
          GAME_CONSTANTS.SUSHI_MIN_SPAWN_DISTANCE);
    return distanceFromLast >= spawnDistance;
  }

  static addSushi(gameState: GameState): GameState {
    const newSushi = this.createSushi();
    return {
      ...gameState,
      sushis: [...gameState.sushis, newSushi],
    };
  }

  // ================================
  // TORII MANAGEMENT
  // ================================

  static createTorii(): Torii {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.TORII_HEIGHT,
      width: GAME_CONSTANTS.TORII_WIDTH,
      height: GAME_CONSTANTS.TORII_HEIGHT,
      velocityX: GAME_CONSTANTS.SUSHI_SPEED,
      color: TORII_COLORS.PRIMARY,
    };
  }

  static updateToriis(toriis: Torii[]): Torii[] {
    return toriis
      .map((torii) => ({
        ...torii,
        x: torii.x + torii.velocityX,
      }))
      .filter((torii) => torii.x > -torii.width);
  }

  static shouldSpawnTorii(gameState: GameState): boolean {
    // Only spawn a torii if there are none currently on screen
    if (gameState.toriis.length > 0) return false;
    return (
      GameLogic.formatDistance(gameState.distance) %
        GAME_CONSTANTS.TORII_SPAWN_DISTANCE ===
      0
    );
  }

  static addTorii(gameState: GameState): GameState {
    const newTorii = this.createTorii();
    return {
      ...gameState,
      toriis: [...gameState.toriis, newTorii],
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

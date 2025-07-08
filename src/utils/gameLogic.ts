import { Player, GameState } from "@/types/game";
import { player } from "@/entities/playerData";
import {
  resetPlayer,
  updatePlayerPhysics,
  canJump,
  makePlayerJump,
} from "@/entities/player";
import { updateSushis, shouldSpawnSushi, addSushi } from "@/entities/sushi";
import { updateTorii, shouldSpawnTorii, addTorii } from "@/entities/torii";
import { updateRiceRockets, addRiceRocket } from "@/entities/riceRocket";
import { formatDistance } from "@/utils/entityUtils";

// ================================
// UTILITY FUNCTIONS
// ================================

export const updateDistance = (currentDistance: number): number => {
  return currentDistance + 1;
};

export const formatGameDistance = (distance: number): number => {
  return formatDistance(distance);
};

// ================================
// GAME STATE MANAGEMENT
// ================================

export const createInitialGameState = (): GameState => {
  return {
    player: player,
    riceRockets: [],
    sushis: [],
    torii: [],
    distance: 0,
    isGameRunning: false,
    isGameOver: false,
  };
};

export const updateGameState = (gameState: GameState): GameState => {
  if (!gameState.isGameRunning || gameState.isGameOver) {
    return gameState;
  }

  // Update all game entities
  const updatedPlayer = updatePlayerPhysics(gameState.player);
  const updatedRiceRockets = updateRiceRockets(gameState.riceRockets);
  const updatedSushis = updateSushis(gameState.sushis);
  const updatedTorii = updateTorii(gameState.torii);
  const updatedDistance = updateDistance(gameState.distance);

  let newGameState = {
    ...gameState,
    player: updatedPlayer,
    riceRockets: updatedRiceRockets,
    sushis: updatedSushis,
    torii: updatedTorii,
    distance: updatedDistance,
  };

  // Spawn new entities
  newGameState = spawnEntities(newGameState);

  // Check for game over conditions
  if (checkPlayerSushiCollisions(newGameState)) {
    newGameState = {
      ...newGameState,
      isGameRunning: false,
      isGameOver: true,
    };
  }

  return newGameState;
};

const spawnEntities = (gameState: GameState): GameState => {
  let newGameState = gameState;

  if (shouldSpawnSushi(newGameState)) {
    newGameState = addSushi(newGameState);
  }

  if (shouldSpawnTorii(newGameState)) {
    newGameState = addTorii(newGameState);
  }

  return newGameState;
};

// ================================
// PLAYER MANAGEMENT
// ================================

export const resetGamePlayer = (player: Player): Player => {
  return resetPlayer(player);
};

export const updateGamePlayerPhysics = (player: Player): Player => {
  return updatePlayerPhysics(player);
};

export const canPlayerJump = (player: Player): boolean => {
  return canJump(player);
};

export const makeGamePlayerJump = (player: Player): Player => {
  return makePlayerJump(player);
};

// ================================
// ENTITY SPAWNING
// ================================

export const addGameRiceRocket = (gameState: GameState): GameState => {
  return addRiceRocket(gameState);
};

// ================================
// COLLISION DETECTION
// ================================

export const checkPlayerSushiCollisions = (gameState: GameState): boolean => {
  return gameState.sushis.some((sushi) =>
    checkCollision(gameState.player, sushi)
  );
};

const checkCollision = (
  player: Player,
  entity: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    player.x < entity.x + entity.width &&
    player.x + player.width > entity.x &&
    player.y < entity.y + entity.height &&
    player.y + player.height > entity.y
  );
};

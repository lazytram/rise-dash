import { Sushi, GameState } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import { GAME_COLORS } from "@/constants/colors";
import { player } from "./playerData";
import {
  generateId,
  getGroundY,
  updateMovingEntities,
} from "@/utils/entityUtils";

export const createSushi = (): Sushi => {
  const groundY = getGroundY();

  return {
    id: generateId(),
    x: GAME_CONSTANTS.CANVAS_WIDTH,
    y: groundY - player.height,
    width: player.width,
    height: player.height,
    velocityX: GAME_CONSTANTS.SUSHI_SPEED,
    color: GAME_COLORS.SUSHI_BASE,
  };
};

export const updateSushis = (sushis: Sushi[]): Sushi[] => {
  return updateMovingEntities(sushis, -sushis[0]?.width || 0);
};

export const shouldSpawnSushi = (gameState: GameState): boolean => {
  if (gameState.sushis.length === 0) {
    return gameState.distance > GAME_CONSTANTS.INITIAL_SUSHI_SPAWN_DISTANCE;
  }

  const lastSushi = gameState.sushis[gameState.sushis.length - 1];
  const distanceFromLast = GAME_CONSTANTS.CANVAS_WIDTH - lastSushi.x;

  const randomDistance = getRandomSpawnDistance();
  const shouldSpawn = Math.random() < GAME_CONSTANTS.SUSHI_SPAWN_PROBABILITY;

  return distanceFromLast >= randomDistance && shouldSpawn;
};

export const addSushi = (gameState: GameState): GameState => {
  const newSushi = createSushi();
  return {
    ...gameState,
    sushis: [...gameState.sushis, newSushi],
  };
};

const getRandomSpawnDistance = (): number => {
  return (
    Math.random() *
      (GAME_CONSTANTS.SUSHI_MAX_SPAWN_DISTANCE -
        GAME_CONSTANTS.SUSHI_MIN_SPAWN_DISTANCE) +
    GAME_CONSTANTS.SUSHI_MIN_SPAWN_DISTANCE
  );
};

import { Torii, GameState } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import {
  getGroundY,
  formatDistance,
  updateMovingEntities,
} from "@/utils/entityUtils";

export const createTorii = (gameState: GameState): Torii => {
  const groundY = getGroundY();
  const distanceTraveled = formatDistance(gameState.distance);

  return {
    id: `torii_${distanceTraveled}_${Date.now()}`,
    x: GAME_CONSTANTS.CANVAS_WIDTH,
    y: groundY - GAME_CONSTANTS.TORII_HEIGHT,
    width: GAME_CONSTANTS.TORII_WIDTH,
    height: GAME_CONSTANTS.TORII_HEIGHT,
    velocityX: GAME_CONSTANTS.SUSHI_SPEED,
  };
};

export const updateTorii = (torii: Torii[]): Torii[] => {
  return updateMovingEntities(torii, -torii[0]?.width || 0);
};

export const shouldSpawnTorii = (gameState: GameState): boolean => {
  const currentDistanceMeters = formatDistance(gameState.distance);

  const shouldSpawn =
    currentDistanceMeters > 0 &&
    currentDistanceMeters % GAME_CONSTANTS.TORII_SPAWN_DISTANCE === 0;

  if (!shouldSpawn) return false;

  const existingTorii = findToriiAtDistance(
    gameState.torii,
    currentDistanceMeters
  );
  return !existingTorii;
};

export const addTorii = (gameState: GameState): GameState => {
  const newTorii = createTorii(gameState);
  return {
    ...gameState,
    torii: [...gameState.torii, newTorii],
  };
};

const findToriiAtDistance = (
  torii: Torii[],
  distance: number
): Torii | undefined => {
  return torii.find((torii) => {
    const toriiDistance = parseInt(torii.id.split("_")[1] || "0");
    return toriiDistance === distance;
  });
};

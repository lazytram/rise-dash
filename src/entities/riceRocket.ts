import { RiceRocket, GameState, Player } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import { generateId, updateMovingEntities } from "@/utils/entityUtils";

export const createRiceRocket = (player: Player): RiceRocket => {
  return {
    id: generateId(),
    x: player.x + player.width,
    y: player.y + player.height / 2,
    width: GAME_CONSTANTS.RICE_ROCKET_SIZE,
    height: GAME_CONSTANTS.RICE_ROCKET_SIZE,
    velocityX: GAME_CONSTANTS.RICE_ROCKET_SPEED,
    color: "#ffffff",
  };
};

export const updateRiceRockets = (riceRockets: RiceRocket[]): RiceRocket[] => {
  return updateMovingEntities(riceRockets, GAME_CONSTANTS.CANVAS_WIDTH + 50);
};

export const addRiceRocket = (gameState: GameState): GameState => {
  const newRiceRocket = createRiceRocket(gameState.player);
  return {
    ...gameState,
    riceRockets: [...gameState.riceRockets, newRiceRocket],
  };
};

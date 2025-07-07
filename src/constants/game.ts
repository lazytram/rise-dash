import { GameConstants } from "@/types/game";
import { GAME_COLORS } from "./colors";

export const GAME_CONSTANTS: GameConstants = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  GRAVITY: 0.8,
  JUMP_STRENGTH: -15,
  GROUND_HEIGHT: 50,
  FPS: 60,
  RICE_ROCKET_SPEED: 8,
  RICE_ROCKET_SIZE: 4,
  SUSHI_SPEED: -4,
  SUSHI_SPAWN_DISTANCE: 150,
};

// Re-export game colors for backward compatibility
export const COLORS = GAME_COLORS;

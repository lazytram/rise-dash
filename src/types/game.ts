export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  color: string;
}

export interface RiceRocket {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  color: string;
}

export interface Sushi {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  color: string;
}

export interface GameState {
  player: Player;
  riceRockets: RiceRocket[];
  sushis: Sushi[];
  distance: number;
  isGameRunning: boolean;
  isGameOver: boolean;
}

export interface GameConstants {
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  GRAVITY: number;
  JUMP_STRENGTH: number;
  GROUND_HEIGHT: number;
  FPS: number;
  RICE_ROCKET_SPEED: number;
  RICE_ROCKET_SIZE: number;
  SUSHI_SPEED: number;
  SUSHI_SPAWN_DISTANCE: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  color: string;
}

export interface GameState {
  player: Player;
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
}

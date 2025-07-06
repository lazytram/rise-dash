import { Player } from "@/types/game";
import { GAME_CONSTANTS, COLORS } from "@/constants/game";
import { GameLogic } from "@/utils/gameLogic";

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clearCanvas(): void {
    this.ctx.fillStyle = COLORS.SKY;
    this.ctx.fillRect(
      0,
      0,
      GAME_CONSTANTS.CANVAS_WIDTH,
      GAME_CONSTANTS.CANVAS_HEIGHT
    );
  }

  drawGround(): void {
    // Draw ground
    this.ctx.fillStyle = COLORS.GROUND;
    this.ctx.fillRect(
      0,
      GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT,
      GAME_CONSTANTS.CANVAS_WIDTH,
      GAME_CONSTANTS.GROUND_HEIGHT
    );

    // Draw grass on ground
    this.ctx.fillStyle = COLORS.GRASS;
    this.ctx.fillRect(
      0,
      GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT,
      GAME_CONSTANTS.CANVAS_WIDTH,
      10
    );
  }

  drawPlayer(player: Player): void {
    // Draw player body
    this.ctx.fillStyle = player.color;
    this.ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw character eyes
    this.ctx.fillStyle = COLORS.WHITE;
    this.ctx.fillRect(player.x + 5, player.y + 5, 6, 6);
    this.ctx.fillRect(player.x + 19, player.y + 5, 6, 6);

    this.ctx.fillStyle = COLORS.BLACK;
    this.ctx.fillRect(player.x + 7, player.y + 7, 2, 2);
    this.ctx.fillRect(player.x + 21, player.y + 7, 2, 2);
  }

  drawDistance(distance: number): void {
    this.ctx.fillStyle = COLORS.WHITE;
    this.ctx.font = "bold 20px Arial";
    this.ctx.fillText(
      `Distance: ${GameLogic.formatDistance(distance)}m`,
      20,
      40
    );
  }

  drawStartScreen(): void {
    // Semi-transparent overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(
      0,
      0,
      GAME_CONSTANTS.CANVAS_WIDTH,
      GAME_CONSTANTS.CANVAS_HEIGHT
    );

    // Game title
    this.ctx.fillStyle = COLORS.WHITE;
    this.ctx.font = "bold 30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "RISE DASH",
      GAME_CONSTANTS.CANVAS_WIDTH / 2,
      GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 50
    );

    // Instructions
    this.ctx.font = "20px Arial";
    this.ctx.fillText(
      "Press SPACE to start",
      GAME_CONSTANTS.CANVAS_WIDTH / 2,
      GAME_CONSTANTS.CANVAS_HEIGHT / 2
    );
    this.ctx.fillText(
      "SPACE to jump",
      GAME_CONSTANTS.CANVAS_WIDTH / 2,
      GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 30
    );

    this.ctx.textAlign = "left";
  }

  render(
    player: Player,
    distance: number,
    isGameRunning: boolean,
    isGameOver: boolean
  ): void {
    this.clearCanvas();
    this.drawGround();
    this.drawPlayer(player);
    this.drawDistance(distance);

    if (!isGameRunning && !isGameOver) {
      this.drawStartScreen();
    }
  }
}

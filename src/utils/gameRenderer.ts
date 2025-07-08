import { Player, RiceRocket, Sushi } from "@/types/game";
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

  drawRiceRockets(riceRockets: RiceRocket[]): void {
    riceRockets.forEach((rocket) => {
      this.ctx.fillStyle = rocket.color;
      this.ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);

      this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      this.ctx.fillRect(
        rocket.x,
        rocket.y,
        rocket.width / 2,
        rocket.height / 2
      );
    });
  }

  drawSushis(sushis: Sushi[]): void {
    sushis.forEach((sushi) => {
      // Draw sushi base
      this.ctx.fillStyle = sushi.color;
      this.ctx.fillRect(sushi.x, sushi.y, sushi.width, sushi.height);

      // Draw rice (white part)
      this.ctx.fillStyle = COLORS.WHITE;
      this.ctx.fillRect(
        sushi.x + 2,
        sushi.y + sushi.height * 0.4,
        sushi.width - 4,
        sushi.height * 0.6
      );

      // Draw nori (black outline)
      this.ctx.strokeStyle = COLORS.BLACK;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(sushi.x, sushi.y, sushi.width, sushi.height);

      // Draw fish/topping (red/pink part)
      this.ctx.fillStyle = "#ff6b6b";
      this.ctx.fillRect(
        sushi.x + 4,
        sushi.y + 2,
        sushi.width - 8,
        sushi.height * 0.3
      );
    });
  }

  drawDistance(
    distance: number,
    distanceText?: string,
    metersText?: string
  ): void {
    this.ctx.fillStyle = COLORS.WHITE;
    this.ctx.font = "bold 20px Arial";
    const text = distanceText
      ? `${distanceText}: ${GameLogic.formatDistance(distance)}${
          metersText ? ` ${metersText}` : "m"
        }`
      : `Distance: ${GameLogic.formatDistance(distance)}m`;
    this.ctx.fillText(text, 20, 40);
  }

  drawStartScreen(startText?: string, jumpText?: string): void {
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

    // Instructions
    this.ctx.font = "20px Arial";
    this.ctx.fillText(
      startText || "Press SPACE to start",
      GAME_CONSTANTS.CANVAS_WIDTH / 2,
      GAME_CONSTANTS.CANVAS_HEIGHT / 2
    );
    this.ctx.fillText(
      jumpText || "SPACE to jump",
      GAME_CONSTANTS.CANVAS_WIDTH / 2,
      GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 30
    );

    this.ctx.textAlign = "left";
  }

  render(
    player: Player,
    riceRockets: RiceRocket[],
    sushis: Sushi[],
    distance: number,
    isGameRunning: boolean,
    isGameOver: boolean,
    translations?: {
      title?: string;
      distance?: string;
      meters?: string;
      startMessage?: string;
      jumpMessage?: string;
    }
  ): void {
    this.clearCanvas();
    this.drawGround();
    this.drawPlayer(player);
    this.drawRiceRockets(riceRockets);
    this.drawSushis(sushis);
    this.drawDistance(distance, translations?.distance, translations?.meters);

    if (!isGameRunning && !isGameOver) {
      this.drawStartScreen(
        translations?.startMessage,
        translations?.jumpMessage
      );
    }
  }
}

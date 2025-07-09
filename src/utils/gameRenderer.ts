import { Player, RiceRocket, Sushi, Torii } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import {
  ENVIRONMENT_COLORS,
  PLAYER_COLORS,
  RICE_ROCKET_COLORS,
  SUSHI_COLORS,
  TORII_COLORS,
  COMMON_COLORS,
} from "@/constants/colors";
import { GameLogic } from "@/utils/gameLogic";

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clearCanvas(): void {
    this.ctx.fillStyle = ENVIRONMENT_COLORS.SKY;
    this.ctx.fillRect(
      0,
      0,
      GAME_CONSTANTS.CANVAS_WIDTH,
      GAME_CONSTANTS.CANVAS_HEIGHT
    );
  }

  drawGround(): void {
    // Draw ground
    this.ctx.fillStyle = ENVIRONMENT_COLORS.GROUND;
    this.ctx.fillRect(
      0,
      GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT,
      GAME_CONSTANTS.CANVAS_WIDTH,
      GAME_CONSTANTS.GROUND_HEIGHT
    );

    // Draw grass on ground
    this.ctx.fillStyle = ENVIRONMENT_COLORS.GRASS;
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
    this.ctx.fillStyle = PLAYER_COLORS.EYES_WHITE;
    this.ctx.fillRect(player.x + 5, player.y + 5, 6, 6);
    this.ctx.fillRect(player.x + 19, player.y + 5, 6, 6);

    this.ctx.fillStyle = PLAYER_COLORS.EYES_PUPIL;
    this.ctx.fillRect(player.x + 7, player.y + 7, 2, 2);
    this.ctx.fillRect(player.x + 21, player.y + 7, 2, 2);
  }

  drawRiceRockets(riceRockets: RiceRocket[]): void {
    riceRockets.forEach((rocket) => {
      this.ctx.fillStyle = rocket.color;
      this.ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);

      this.ctx.fillStyle = RICE_ROCKET_COLORS.HIGHLIGHT;
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
      this.ctx.fillStyle = SUSHI_COLORS.RICE;
      this.ctx.fillRect(
        sushi.x + 2,
        sushi.y + sushi.height * 0.4,
        sushi.width - 4,
        sushi.height * 0.6
      );

      // Draw nori (black outline)
      this.ctx.strokeStyle = SUSHI_COLORS.NORI;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(sushi.x, sushi.y, sushi.width, sushi.height);

      // Draw fish/topping (red/pink part)
      this.ctx.fillStyle = SUSHI_COLORS.FISH;
      this.ctx.fillRect(
        sushi.x + 4,
        sushi.y + 2,
        sushi.width - 8,
        sushi.height * 0.3
      );
    });
  }

  drawToriis(toriis: Torii[]): void {
    toriis.forEach((torii) => {
      const baseY = torii.y + torii.height;

      // Save context for transformations
      this.ctx.save();

      // Draw shadow
      this.ctx.fillStyle = TORII_COLORS.SHADOW;
      this.ctx.fillRect(torii.x + 3, baseY + 2, torii.width, 8);

      // Draw main pillars with gradient effect
      const pillarWidth = GAME_CONSTANTS.TORII_PILLAR_WIDTH;
      const pillarHeight = torii.height;

      // Left pillar with gradient
      const leftGradient = this.ctx.createLinearGradient(
        torii.x,
        torii.y,
        torii.x + pillarWidth,
        torii.y
      );
      leftGradient.addColorStop(0, TORII_COLORS.PRIMARY);
      leftGradient.addColorStop(0.5, TORII_COLORS.SECONDARY);
      leftGradient.addColorStop(1, TORII_COLORS.PRIMARY);
      this.ctx.fillStyle = leftGradient;
      this.ctx.fillRect(torii.x, torii.y, pillarWidth, pillarHeight);

      // Right pillar with gradient
      const rightGradient = this.ctx.createLinearGradient(
        torii.x + torii.width - pillarWidth,
        torii.y,
        torii.x + torii.width,
        torii.y
      );
      rightGradient.addColorStop(0, TORII_COLORS.PRIMARY);
      rightGradient.addColorStop(0.5, TORII_COLORS.SECONDARY);
      rightGradient.addColorStop(1, TORII_COLORS.PRIMARY);
      this.ctx.fillStyle = rightGradient;
      this.ctx.fillRect(
        torii.x + torii.width - pillarWidth,
        torii.y,
        pillarWidth,
        pillarHeight
      );

      // Draw pillar details (wood grain effect)
      this.ctx.fillStyle = TORII_COLORS.WOOD_GRAIN;
      for (let i = 0; i < 3; i++) {
        this.ctx.fillRect(
          torii.x + 1,
          torii.y + i * (pillarHeight / 3),
          pillarWidth - 2,
          2
        );
        this.ctx.fillRect(
          torii.x + torii.width - pillarWidth + 1,
          torii.y + i * (pillarHeight / 3),
          pillarWidth - 2,
          2
        );
      }

      // Draw top horizontal beam (kasagi) with curve
      this.ctx.fillStyle = TORII_COLORS.PRIMARY;
      this.ctx.beginPath();
      this.ctx.moveTo(torii.x - 8, torii.y);
      this.ctx.lineTo(torii.x + torii.width + 8, torii.y);
      this.ctx.lineTo(
        torii.x + torii.width + 6,
        torii.y + GAME_CONSTANTS.TORII_TOP_BAR_HEIGHT
      );
      this.ctx.lineTo(
        torii.x - 6,
        torii.y + GAME_CONSTANTS.TORII_TOP_BAR_HEIGHT
      );
      this.ctx.closePath();
      this.ctx.fill();

      // Draw bottom horizontal beam (nuki)
      this.ctx.fillRect(
        torii.x + pillarWidth,
        torii.y + torii.height - GAME_CONSTANTS.TORII_BOTTOM_BAR_HEIGHT - 10,
        torii.width - 2 * pillarWidth,
        GAME_CONSTANTS.TORII_BOTTOM_BAR_HEIGHT
      );

      // Draw center beam (shimagi) with curve
      this.ctx.beginPath();
      this.ctx.moveTo(
        torii.x + pillarWidth,
        torii.y + torii.height / 2 - GAME_CONSTANTS.TORII_CENTER_BAR_HEIGHT / 2
      );
      this.ctx.lineTo(
        torii.x + torii.width - pillarWidth,
        torii.y + torii.height / 2 - GAME_CONSTANTS.TORII_CENTER_BAR_HEIGHT / 2
      );
      this.ctx.lineTo(
        torii.x + torii.width - pillarWidth - 2,
        torii.y + torii.height / 2 + GAME_CONSTANTS.TORII_CENTER_BAR_HEIGHT / 2
      );
      this.ctx.lineTo(
        torii.x + pillarWidth + 2,
        torii.y + torii.height / 2 + GAME_CONSTANTS.TORII_CENTER_BAR_HEIGHT / 2
      );
      this.ctx.closePath();
      this.ctx.fill();

      // Add golden details
      this.ctx.fillStyle = TORII_COLORS.GOLD_DETAILS;
      this.ctx.fillRect(
        torii.x - 8,
        torii.y,
        2,
        GAME_CONSTANTS.TORII_TOP_BAR_HEIGHT
      );
      this.ctx.fillRect(
        torii.x + torii.width + 6,
        torii.y,
        2,
        GAME_CONSTANTS.TORII_TOP_BAR_HEIGHT
      );

      // Draw decorative elements on pillars
      this.ctx.fillStyle = TORII_COLORS.GOLD_DETAILS;
      this.ctx.fillRect(torii.x + 1, torii.y + 15, pillarWidth - 2, 3);
      this.ctx.fillRect(
        torii.x + torii.width - pillarWidth + 1,
        torii.y + 15,
        pillarWidth - 2,
        3
      );
      this.ctx.fillRect(torii.x + 1, torii.y + 45, pillarWidth - 2, 3);
      this.ctx.fillRect(
        torii.x + torii.width - pillarWidth + 1,
        torii.y + 45,
        pillarWidth - 2,
        3
      );

      // Draw subtle outline
      this.ctx.strokeStyle = TORII_COLORS.OUTLINE;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(torii.x, torii.y, torii.width, torii.height);

      // Restore context
      this.ctx.restore();
    });
  }

  drawDistance(
    distance: number,
    distanceText?: string,
    metersText?: string
  ): void {
    this.ctx.fillStyle = COMMON_COLORS.WHITE;
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
    this.ctx.fillStyle = COMMON_COLORS.WHITE;
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
    toriis: Torii[],
    distance: number,
    isGameRunning: boolean,
    isGameOver: boolean,
    translations?: {
      title?: string;
      distance?: string;
      meters?: string;
      startMessage?: string;
      jumpMessage?: string;
      gameOver?: string;
      finalScore?: string;
      restartMessage?: string;
    }
  ): void {
    this.clearCanvas();
    this.drawGround();
    this.drawPlayer(player);
    this.drawRiceRockets(riceRockets);
    this.drawSushis(sushis);
    this.drawToriis(toriis);
    this.drawDistance(distance, translations?.distance, translations?.meters);

    if (!isGameRunning && !isGameOver) {
      this.drawStartScreen(
        translations?.startMessage,
        translations?.jumpMessage
      );
    }
  }
}

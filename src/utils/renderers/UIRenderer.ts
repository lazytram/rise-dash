import { BaseRenderer } from "./BaseRenderer";
import { COMMON_COLORS } from "@/constants/colors";
import { GAME_CONSTANTS } from "@/constants/game";

export class UIRenderer extends BaseRenderer {
  drawDistance(
    distance: number,
    distanceText?: string,
    metersText?: string
  ): void {
    this.ctx.fillStyle = COMMON_COLORS.WHITE;
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      `${distanceText || "Distance"}: ${Math.floor(distance / 10)} ${
        metersText || "m"
      }`,
      GAME_CONSTANTS.CANVAS_WIDTH / 2,
      30
    );
  }

  drawStartScreen(
    startText?: string,
    jumpText?: string,
    enemyText?: string
  ): void {
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
    this.ctx.fillText(
      enemyText || "Enemies appear every 500m",
      GAME_CONSTANTS.CANVAS_WIDTH / 2,
      GAME_CONSTANTS.CANVAS_HEIGHT / 2 + 60
    );

    this.ctx.textAlign = "left";
  }
}

import { BaseRenderer } from "./BaseRenderer";
import { ENVIRONMENT_COLORS } from "@/constants/colors";
import { GAME_CONSTANTS } from "@/constants/game";

export class EnvironmentRenderer extends BaseRenderer {
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
}

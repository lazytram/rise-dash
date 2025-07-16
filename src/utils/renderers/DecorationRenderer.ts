import { BaseRenderer } from "./BaseRenderer";
import { Torii } from "@/types/game";
import { TORII_COLORS } from "@/constants/colors";
import { GAME_CONSTANTS } from "@/constants/game";

export class DecorationRenderer extends BaseRenderer {
  drawToriis(toriis: Torii[]): void {
    toriis.forEach((torii) => {
      this.drawTorii(torii);
    });
  }

  private drawTorii(torii: Torii): void {
    const baseY = torii.y + torii.height;

    // Save context for transformations
    this.ctx.save();

    this.drawToriiShadow(torii, baseY);
    this.drawToriiPillars(torii);
    this.drawToriiBeams(torii);
    this.drawToriiDetails(torii);

    // Restore context
    this.ctx.restore();
  }

  private drawToriiShadow(torii: Torii, baseY: number): void {
    this.ctx.fillStyle = "#654321"; // Dark brown shadow
    this.ctx.fillRect(torii.x + 3, baseY + 2, torii.width, 8);
  }

  private drawToriiPillars(torii: Torii): void {
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
    leftGradient.addColorStop(0.5, "#A0522D"); // Saddle brown
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
    rightGradient.addColorStop(0.5, "#A0522D"); // Saddle brown
    rightGradient.addColorStop(1, TORII_COLORS.PRIMARY);
    this.ctx.fillStyle = rightGradient;
    this.ctx.fillRect(
      torii.x + torii.width - pillarWidth,
      torii.y,
      pillarWidth,
      pillarHeight
    );

    // Draw pillar details (wood grain effect)
    this.ctx.fillStyle = "#654321"; // Dark brown wood grain
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
  }

  private drawToriiBeams(torii: Torii): void {
    const pillarWidth = GAME_CONSTANTS.TORII_PILLAR_WIDTH;

    // Draw top horizontal beam (kasagi) with curve
    this.ctx.fillStyle = TORII_COLORS.PRIMARY;
    this.ctx.beginPath();
    this.ctx.moveTo(torii.x - 8, torii.y);
    this.ctx.lineTo(torii.x + torii.width + 8, torii.y);
    this.ctx.lineTo(
      torii.x + torii.width + 6,
      torii.y + GAME_CONSTANTS.TORII_TOP_BAR_HEIGHT
    );
    this.ctx.lineTo(torii.x - 6, torii.y + GAME_CONSTANTS.TORII_TOP_BAR_HEIGHT);
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
  }

  private drawToriiDetails(torii: Torii): void {
    const pillarWidth = GAME_CONSTANTS.TORII_PILLAR_WIDTH;

    // Add golden details
    this.ctx.fillStyle = "#FFD700"; // Gold
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
    this.ctx.fillStyle = "#FFD700"; // Gold
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
    this.ctx.strokeStyle = "#654321"; // Dark brown outline
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(torii.x, torii.y, torii.width, torii.height);
  }
}

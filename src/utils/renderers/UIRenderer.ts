import { BaseRenderer } from "./BaseRenderer";
import { Player } from "@/types/game";
import { COMMON_COLORS, RICE_ROCKET_COLORS } from "@/constants/colors";
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

  drawAmmoIndicator(player: Player, riceRocketsText?: string): void {
    const ammoX = 20;
    const ammoY = 60;
    const ammoSpacing = 18;
    const slotSize = 16;
    const frameWidth = 240;
    const frameHeight = 50;

    this.drawAmmoBackground(ammoX, ammoY, frameWidth, frameHeight);
    this.drawAmmoLabel(ammoX, ammoY, riceRocketsText);
    this.drawAmmoSlots(player, ammoX, ammoY, ammoSpacing, slotSize);
    this.drawAmmoCount(player, ammoX, ammoY, frameWidth);
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

  private drawAmmoBackground(
    ammoX: number,
    ammoY: number,
    frameWidth: number,
    frameHeight: number
  ): void {
    // Enhanced background with multiple layers
    // Outer glow effect
    this.setShadow("rgba(0, 0, 0, 0.5)", 10, 0, 2);

    // Main background with enhanced gradient
    const gradient = this.ctx.createLinearGradient(
      ammoX - 15,
      ammoY - 15,
      ammoX + frameWidth,
      ammoY + frameHeight
    );
    gradient.addColorStop(0, "rgba(20, 20, 20, 0.95)");
    gradient.addColorStop(0.3, "rgba(40, 40, 40, 0.9)");
    gradient.addColorStop(0.7, "rgba(30, 30, 30, 0.85)");
    gradient.addColorStop(1, "rgba(15, 15, 15, 0.8)");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(ammoX - 15, ammoY - 15, frameWidth, frameHeight);

    this.clearShadow();

    // Enhanced border with multiple layers
    // Outer border (glow)
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(ammoX - 15, ammoY - 15, frameWidth, frameHeight);

    // Inner border (main)
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(
      ammoX - 12,
      ammoY - 12,
      frameWidth - 6,
      frameHeight - 6
    );
  }

  private drawAmmoLabel(
    ammoX: number,
    ammoY: number,
    riceRocketsText?: string
  ): void {
    // Label background
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    this.ctx.fillRect(ammoX - 8, ammoY - 8, 95, 20);

    // Label text with shadow
    this.setShadow("rgba(0, 0, 0, 0.8)", 2, 1, 1);
    this.ctx.fillStyle = COMMON_COLORS.WHITE;
    this.ctx.font = "bold 15px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillText(
      `${riceRocketsText || "Rice Rockets"}:`,
      ammoX,
      ammoY + 6
    );
    this.clearShadow();
  }

  private drawAmmoSlots(
    player: Player,
    ammoX: number,
    ammoY: number,
    ammoSpacing: number,
    slotSize: number
  ): void {
    // Calculate recharge progress for the next ammo
    const currentTime = Date.now();
    const timeSinceLastRecharge = currentTime - player.lastAmmoRechargeTime;
    const rechargeProgress = Math.min(
      timeSinceLastRecharge / GAME_CONSTANTS.AMMO_RECHARGE_INTERVAL,
      1
    );
    const isRecharging = player.riceRocketAmmo < player.maxRiceRocketAmmo;

    // Draw enhanced ammo slots (bottom section, below text)
    const slotsStartX = ammoX - 5;
    const slotsY = ammoY + 15;

    for (let i = 0; i < player.maxRiceRocketAmmo; i++) {
      const slotX = slotsStartX + i * ammoSpacing;
      const slotY = slotsY;

      this.drawAmmoSlot(
        player,
        i,
        slotX,
        slotY,
        slotSize,
        isRecharging,
        rechargeProgress
      );
    }
  }

  private drawAmmoSlot(
    player: Player,
    slotIndex: number,
    slotX: number,
    slotY: number,
    slotSize: number,
    isRecharging: boolean,
    rechargeProgress: number
  ): void {
    // Slot shadow
    this.setShadow("rgba(0, 0, 0, 0.3)", 3, 1, 1);

    // Determine if this slot should show recharge progress
    const isRechargingSlot =
      isRecharging && slotIndex === player.riceRocketAmmo;

    // Slot background with enhanced gradient
    const slotGradient = this.ctx.createLinearGradient(
      slotX,
      slotY,
      slotX + slotSize,
      slotY + slotSize
    );

    if (slotIndex < player.riceRocketAmmo) {
      // Filled slot - enhanced rice rocket colors
      slotGradient.addColorStop(0, "#FF6B35");
      slotGradient.addColorStop(0.3, RICE_ROCKET_COLORS.BODY);
      slotGradient.addColorStop(0.7, RICE_ROCKET_COLORS.HIGHLIGHT);
      slotGradient.addColorStop(1, "#FFD700");
    } else if (isRechargingSlot) {
      // Recharging slot - partial fill based on progress
      const progressColor = `rgba(255, 107, 53, ${rechargeProgress * 0.8})`;
      slotGradient.addColorStop(0, progressColor);
      slotGradient.addColorStop(
        0.5,
        `rgba(255, 215, 0, ${rechargeProgress * 0.6})`
      );
      slotGradient.addColorStop(
        1,
        `rgba(255, 69, 0, ${rechargeProgress * 0.7})`
      );
    } else {
      // Empty slot - enhanced gray gradient
      slotGradient.addColorStop(0, "rgba(100, 100, 100, 0.9)");
      slotGradient.addColorStop(0.5, "rgba(70, 70, 70, 0.8)");
      slotGradient.addColorStop(1, "rgba(50, 50, 50, 0.7)");
    }

    this.ctx.fillStyle = slotGradient;
    this.ctx.fillRect(slotX, slotY, slotSize, slotSize);

    this.clearShadow();

    // Enhanced rice rocket icon for filled slots
    if (slotIndex < player.riceRocketAmmo) {
      this.drawRocketIcon(slotX, slotY, slotSize);
    } else if (isRechargingSlot) {
      this.drawPartialRocketIcon(slotX, slotY, slotSize, rechargeProgress);
    }

    // Enhanced slot border
    let borderColor = "rgba(128, 128, 128, 0.6)";
    if (slotIndex < player.riceRocketAmmo) {
      borderColor = "rgba(255, 255, 255, 0.9)";
    } else if (isRechargingSlot) {
      borderColor = `rgba(255, 255, 255, ${0.3 + rechargeProgress * 0.6})`;
    }

    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(slotX, slotY, slotSize, slotSize);

    // Inner border for filled slots
    if (slotIndex < player.riceRocketAmmo) {
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(slotX + 1, slotY + 1, slotSize - 2, slotSize - 2);
    }
  }

  private drawRocketIcon(slotX: number, slotY: number, slotSize: number): void {
    // Main rocket body with gradient
    const rocketGradient = this.ctx.createLinearGradient(
      slotX + 2,
      slotY + 4,
      slotX + slotSize - 2,
      slotY + 12
    );
    rocketGradient.addColorStop(0, "#FFD700");
    rocketGradient.addColorStop(0.5, "#FFA500");
    rocketGradient.addColorStop(1, "#FF4500");

    this.ctx.fillStyle = rocketGradient;
    this.ctx.fillRect(slotX + 2, slotY + 4, slotSize - 4, 8);

    // Rocket tip with glow
    this.setShadow("#FFD700", 3);
    this.ctx.fillStyle = "#FFD700";
    this.ctx.fillRect(slotX + slotSize - 4, slotY + 6, 4, 4);

    // Rocket fins
    this.ctx.fillStyle = "#FF4500";
    this.ctx.fillRect(slotX + 3, slotY + 6, 2, 2);
    this.ctx.fillRect(slotX + slotSize - 5, slotY + 6, 2, 2);

    // Inner glow
    this.setShadow("rgba(255, 255, 255, 0.5)", 2);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.fillRect(slotX + 3, slotY + 5, slotSize - 6, 6);
    this.clearShadow();
  }

  private drawPartialRocketIcon(
    slotX: number,
    slotY: number,
    slotSize: number,
    rechargeProgress: number
  ): void {
    const partialHeight = Math.floor(8 * rechargeProgress);
    if (partialHeight > 0) {
      // Main rocket body with gradient (partial)
      const rocketGradient = this.ctx.createLinearGradient(
        slotX + 2,
        slotY + 4,
        slotX + slotSize - 2,
        slotY + 4 + partialHeight
      );
      rocketGradient.addColorStop(0, "#FFD700");
      rocketGradient.addColorStop(0.5, "#FFA500");
      rocketGradient.addColorStop(1, "#FF4500");

      this.ctx.fillStyle = rocketGradient;
      this.ctx.fillRect(slotX + 2, slotY + 4, slotSize - 4, partialHeight);

      // Partial rocket tip
      if (rechargeProgress > 0.5) {
        this.setShadow("#FFD700", 3);
        this.ctx.fillStyle = "#FFD700";
        this.ctx.fillRect(slotX + slotSize - 4, slotY + 6, 4, 4);
      }

      // Partial rocket fins
      if (rechargeProgress > 0.3) {
        this.ctx.fillStyle = "#FF4500";
        this.ctx.fillRect(slotX + 3, slotY + 6, 2, 2);
        this.ctx.fillRect(slotX + slotSize - 5, slotY + 6, 2, 2);
      }
      this.clearShadow();
    }
  }

  private drawAmmoCount(
    player: Player,
    ammoX: number,
    ammoY: number,
    frameWidth: number
  ): void {
    // Text background
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    this.ctx.fillRect(ammoX + frameWidth - 59, ammoY - 8, 35, 20);

    // Text with shadow
    this.setShadow("rgba(0, 0, 0, 0.8)", 2, 1, 1);
    this.ctx.fillStyle = COMMON_COLORS.WHITE;
    this.ctx.font = "bold 13px Arial";
    this.ctx.textAlign = "right";
    this.ctx.fillText(
      `${player.riceRocketAmmo}/${player.maxRiceRocketAmmo}`,
      ammoX + frameWidth - 25,
      ammoY + 6
    );
    this.clearShadow();
  }
}

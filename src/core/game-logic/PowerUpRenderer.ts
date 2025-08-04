import { PowerUp } from "@/shared/types/game";
import { POWERUP_UPGRADES } from "@/shared/constants/powerUps";
import { BaseRenderer } from "./BaseRenderer";

export class PowerUpRenderer extends BaseRenderer {
  drawPowerUp(powerUp: PowerUp): void {
    // Draw shadow
    this.drawShadow(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

    // Draw glow effect first (behind the power-up)
    this.drawPowerUpGlow(powerUp);

    // Draw power-up with generic method
    this.drawGenericPowerUp(powerUp);

    // Draw floating animation
    this.drawFloatingAnimation(powerUp);
  }

  drawPowerUps(powerUps: PowerUp[]): void {
    powerUps.forEach((powerUp) => this.drawPowerUp(powerUp));
  }

  private drawGenericPowerUp(powerUp: PowerUp): void {
    const centerX = powerUp.x + powerUp.width / 2;
    const centerY = powerUp.y + powerUp.height / 2;
    const size = Math.min(powerUp.width, powerUp.height) / 2 - 2;

    // Draw background circle/hexagon
    this.drawPowerUpBackground(powerUp, centerX, centerY, size);

    // Draw icon from constants
    this.drawPowerUpIcon(powerUp, centerX, centerY);
  }

  private drawPowerUpBackground(
    powerUp: PowerUp,
    centerX: number,
    centerY: number,
    size: number
  ): void {
    this.ctx.fillStyle = powerUp.color;
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;

    // Draw hexagon background
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = centerX + size * Math.cos(angle);
      const y = centerY + size * Math.sin(angle);
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  private drawPowerUpIcon(
    powerUp: PowerUp,
    centerX: number,
    centerY: number
  ): void {
    // Get icon from constants
    const powerUpData = POWERUP_UPGRADES[powerUp.type];
    const icon = powerUpData?.icon || "❓";

    // Draw icon
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "16px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(icon, centerX, centerY);
  }

  private drawPowerUpGlow(powerUp: PowerUp): void {
    // Add a pulsing glow effect
    const time = Date.now() * 0.005;
    const glowIntensity = 0.3 + 0.2 * Math.sin(time);

    this.ctx.shadowColor = powerUp.color;
    this.ctx.shadowBlur = 10 * glowIntensity;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;

    // Draw a subtle glow circle
    this.ctx.fillStyle = `${powerUp.color}${Math.floor(glowIntensity * 255)
      .toString(16)
      .padStart(2, "0")}`;
    this.ctx.beginPath();
    this.ctx.arc(
      powerUp.x + powerUp.width / 2,
      powerUp.y + powerUp.height / 2,
      Math.min(powerUp.width, powerUp.height) / 2 + 5,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Reset shadow
    this.clearShadow();
  }

  private drawFloatingAnimation(powerUp: PowerUp): void {
    // Add a subtle floating animation
    const time = Date.now() * 0.003;
    const floatOffset = Math.sin(time + powerUp.x * 0.01) * 2;

    // Draw floating particles
    this.ctx.fillStyle = powerUp.color;
    this.ctx.globalAlpha = 0.6;

    for (let i = 0; i < 3; i++) {
      const particleX = powerUp.x + powerUp.width / 2 + (i - 1) * 8;
      const particleY = powerUp.y + powerUp.height / 2 + floatOffset + i * 3;

      this.ctx.beginPath();
      this.ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }
}

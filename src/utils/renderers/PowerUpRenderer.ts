import { PowerUp } from "@/types/game";
import { BaseRenderer } from "./BaseRenderer";

export class PowerUpRenderer extends BaseRenderer {
  drawPowerUp(powerUp: PowerUp): void {
    // Draw shadow
    this.drawShadow(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

    // Draw glow effect first (behind the power-up)
    this.drawPowerUpGlow(powerUp);

    // Draw power-up based on type
    switch (powerUp.type) {
      case "shield":
        this.drawShieldPowerUp(powerUp);
        break;
      case "infinite_ammo":
        this.drawInfiniteAmmoPowerUp(powerUp);
        break;
      case "speed_boost":
        this.drawSpeedBoostPowerUp(powerUp);
        break;
      case "multi_shot":
        this.drawMultiShotPowerUp(powerUp);
        break;
    }

    // Draw floating animation
    this.drawFloatingAnimation(powerUp);
  }

  drawPowerUps(powerUps: PowerUp[]): void {
    powerUps.forEach((powerUp) => this.drawPowerUp(powerUp));
  }

  private drawShieldPowerUp(powerUp: PowerUp): void {
    // Draw shield icon (hexagon)
    this.ctx.fillStyle = powerUp.color;
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;

    const centerX = powerUp.x + powerUp.width / 2;
    const centerY = powerUp.y + powerUp.height / 2;
    const radius = Math.min(powerUp.width, powerUp.height) / 2 - 2;

    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Draw shield symbol
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("🛡️", centerX, centerY + 4);
  }

  private drawInfiniteAmmoPowerUp(powerUp: PowerUp): void {
    // Draw infinity symbol
    this.ctx.fillStyle = powerUp.color;
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;

    const centerX = powerUp.x + powerUp.width / 2;
    const centerY = powerUp.y + powerUp.height / 2;
    const radius = Math.min(powerUp.width, powerUp.height) / 3;

    // Draw infinity symbol
    this.ctx.beginPath();
    this.ctx.arc(centerX - radius, centerY, radius, 0, Math.PI * 2);
    this.ctx.arc(centerX + radius, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Draw ammo symbol
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "10px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("∞", centerX, centerY + 3);
  }

  private drawSpeedBoostPowerUp(powerUp: PowerUp): void {
    // Draw lightning bolt
    this.ctx.fillStyle = powerUp.color;
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;

    const centerX = powerUp.x + powerUp.width / 2;
    const centerY = powerUp.y + powerUp.height / 2;
    const size = Math.min(powerUp.width, powerUp.height) / 2 - 2;

    // Draw lightning shape
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY - size);
    this.ctx.lineTo(centerX - size / 2, centerY - size / 3);
    this.ctx.lineTo(centerX + size / 2, centerY + size / 3);
    this.ctx.lineTo(centerX, centerY + size);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Draw speed symbol
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("⚡", centerX, centerY + 4);
  }

  private drawMultiShotPowerUp(powerUp: PowerUp): void {
    // Draw multiple projectiles
    this.ctx.fillStyle = powerUp.color;
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;

    const centerX = powerUp.x + powerUp.width / 2;
    const centerY = powerUp.y + powerUp.height / 2;
    const size = Math.min(powerUp.width, powerUp.height) / 3;

    // Draw three projectiles
    for (let i = 0; i < 3; i++) {
      const offsetX = (i - 1) * size * 0.8;
      const offsetY = (i - 1) * size * 0.3;

      this.ctx.beginPath();
      this.ctx.arc(
        centerX + offsetX,
        centerY + offsetY,
        size / 2,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
      this.ctx.stroke();
    }

    // Draw multi-shot symbol
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "10px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("3", centerX, centerY + 3);
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

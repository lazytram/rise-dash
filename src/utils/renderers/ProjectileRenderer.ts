import { BaseRenderer } from "./BaseRenderer";
import { RiceRocket, SamuraiBullet } from "@/types/game";
import { RICE_ROCKET_COLORS, COMMON_COLORS } from "@/constants/colors";

export class ProjectileRenderer extends BaseRenderer {
  drawRiceRockets(riceRockets: RiceRocket[]): void {
    riceRockets.forEach((rocket) => {
      this.drawRiceRocket(rocket);
    });
  }

  drawSamuraiBullets(samuraiBullets: SamuraiBullet[]): void {
    samuraiBullets.forEach((bullet) => {
      this.drawSamuraiBullet(bullet);
    });
  }

  private drawRiceRocket(rocket: RiceRocket): void {
    // Main body
    this.ctx.fillStyle = RICE_ROCKET_COLORS.BODY;
    this.ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);

    // Highlight
    this.ctx.fillStyle = `${COMMON_COLORS.WHITE}CC`; // White with 80% opacity
    this.ctx.fillRect(rocket.x, rocket.y, rocket.width / 2, rocket.height / 2);
  }

  private drawSamuraiBullet(bullet: SamuraiBullet): void {
    // Draw shuriken trail
    this.ctx.fillStyle = "rgba(255, 69, 0, 0.5)";
    this.ctx.fillRect(bullet.x - 8, bullet.y, 8, bullet.height);

    // Draw shuriken body (star shape)
    this.ctx.fillStyle = bullet.color;

    // Draw the shuriken as a simple cross shape
    const centerX = bullet.x + bullet.width / 2;
    const centerY = bullet.y + bullet.height / 2;

    // Horizontal blade
    this.ctx.fillRect(bullet.x, centerY - 1, bullet.width, 2);
    // Vertical blade
    this.ctx.fillRect(centerX - 1, bullet.y, 2, bullet.height);

    // Diagonal blades
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(Math.PI / 4);
    this.ctx.fillRect(-bullet.width / 2, -1, bullet.width, 2);
    this.ctx.rotate(Math.PI / 2);
    this.ctx.fillRect(-bullet.width / 2, -1, bullet.width, 2);
    this.ctx.restore();

    // Draw shuriken glow effect
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.fillRect(
      bullet.x + 1,
      bullet.y + 1,
      bullet.width - 2,
      bullet.height - 2
    );
  }
}

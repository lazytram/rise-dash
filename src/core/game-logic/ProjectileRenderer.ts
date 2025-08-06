import { BaseRenderer } from "./BaseRenderer";
import { RiceRocket, EnemyBullet, ProjectileType } from "@/shared/types/game";
import { RICE_ROCKET_COLORS, COMMON_COLORS } from "@/shared/constants/colors";

export class ProjectileRenderer extends BaseRenderer {
  drawRiceRockets(riceRockets: RiceRocket[]): void {
    riceRockets.forEach((rocket) => {
      this.drawRiceRocket(rocket);
    });
  }

  drawenemyBullets(enemyBullets: EnemyBullet[]): void {
    enemyBullets.forEach((bullet) => {
      this.drawEnemyBullet(bullet);
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

  private drawEnemyBullet(bullet: EnemyBullet): void {
    // Use projectile type instead of color for better type safety
    switch (bullet.projectileType) {
      case ProjectileType.SHURIKEN:
        this.drawShuriken(bullet);
        break;
      case ProjectileType.KATANA_SLASH:
        this.drawKatanaSlash(bullet);
        break;
      case ProjectileType.BOSS_BULLET:
        this.drawBossBullet(bullet);
        break;
      default:
        this.drawShuriken(bullet); // Default fallback
        break;
    }
  }

  private drawShuriken(bullet: EnemyBullet): void {
    // Draw shuriken trail
    this.ctx.fillStyle = "rgba(128, 0, 128, 0.5)"; // Purple trail
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

  private drawKatanaSlash(bullet: EnemyBullet): void {
    // Draw katana slash as a circular arc
    const centerX = bullet.x + bullet.width / 2;
    const centerY = bullet.y + bullet.height / 2;
    const radius = bullet.width / 2;

    // Draw the slash arc
    this.ctx.strokeStyle = bullet.color;
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI, false);
    this.ctx.stroke();

    // Draw additional slash lines for effect
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius - 5, 0, Math.PI, false);
    this.ctx.stroke();

    // Draw slash glow effect
    this.ctx.fillStyle = "rgba(192, 192, 192, 0.3)";
    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }

  private drawBossBullet(bullet: EnemyBullet): void {
    // Draw boss bullet as a red fireball
    const centerX = bullet.x + bullet.width / 2;
    const centerY = bullet.y + bullet.height / 2;
    const radius = bullet.width / 2;

    // Draw fireball glow
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    this.ctx.fill();

    // Draw fireball core
    this.ctx.fillStyle = bullet.color;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fill();

    // Draw fireball highlight
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.beginPath();
    this.ctx.arc(centerX - 1, centerY - 1, radius / 2, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}

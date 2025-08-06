import { BaseRenderer } from "./BaseRenderer";
import { drawEnemy } from "@/shared/utils/enemyDrawing";
import {
  Samurai,
  Ninja,
  Boss,
  Sushi,
  Torii,
  EnemyBullet,
} from "@/shared/types/game";

export class EnemyRenderer extends BaseRenderer {
  private drawSushi(sushi: Sushi): void {
    // Draw sushi base
    this.ctx.fillStyle = sushi.color;
    this.ctx.fillRect(sushi.x, sushi.y, sushi.width, sushi.height);

    // Draw rice (white part)
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(
      sushi.x + 2,
      sushi.y + sushi.height * 0.4,
      sushi.width - 4,
      sushi.height * 0.6
    );

    // Draw nori (black outline)
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(sushi.x, sushi.y, sushi.width, sushi.height);

    // Draw fish/topping (red/pink part)
    this.ctx.fillStyle = "#FF6B6B";
    this.ctx.fillRect(
      sushi.x + 4,
      sushi.y + 2,
      sushi.width - 8,
      sushi.height * 0.3
    );
  }

  private drawSamurai(samurai: Samurai): void {
    // Use the generic drawing function for samurai with detailed design
    drawEnemy(this.ctx, "samurai", samurai.x, samurai.y, 0, {
      detailed: true, // Same detailed design as modal
      animated: true, // Add animations
      showShadow: true, // Show shadows
    });

    // Draw lives indicator
    this.drawSamuraiLives(samurai);
  }

  private drawSamuraiLives(samurai: Samurai): void {
    const lives = samurai.lives;
    const maxLives = 3;
    const heartSize = 8;
    const spacing = 2;

    for (let i = 0; i < maxLives; i++) {
      const x =
        samurai.x +
        (samurai.width - maxLives * (heartSize + spacing)) / 2 +
        i * (heartSize + spacing);
      const y = samurai.y - heartSize - 5;

      if (i < lives) {
        // Full heart
        this.ctx.fillStyle = "#FF0000";
      } else {
        // Empty heart
        this.ctx.fillStyle = "#666666";
      }

      // Simple heart shape
      this.ctx.fillRect(x, y, heartSize, heartSize);
    }
  }

  private drawNinja(ninja: Ninja): void {
    // Use the generic drawing function for ninja with detailed design
    drawEnemy(this.ctx, "ninja", ninja.x, ninja.y, 0, {
      detailed: true, // Same detailed design as modal
      animated: true, // Add animations
      showShadow: true, // Show shadows
    });

    // Draw lives indicator
    this.drawNinjaLives(ninja);

    // Add jumping animation effect
    if (ninja.isJumping) {
      this.drawNinjaJumpEffect(ninja);
    }
  }

  private drawNinjaLives(ninja: Ninja): void {
    const lives = ninja.lives;
    const maxLives = 3;
    const heartSize = 8;
    const spacing = 2;

    for (let i = 0; i < maxLives; i++) {
      const x =
        ninja.x +
        (ninja.width - maxLives * (heartSize + spacing)) / 2 +
        i * (heartSize + spacing);
      const y = ninja.y - heartSize - 5;

      if (i < lives) {
        // Full heart
        this.ctx.fillStyle = "#800080";
      } else {
        // Empty heart
        this.ctx.fillStyle = "#666666";
      }

      // Simple heart shape
      this.ctx.fillRect(x, y, heartSize, heartSize);
    }
  }

  private drawNinjaJumpEffect(ninja: Ninja): void {
    // Draw jumping effect (dust particles)
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    for (let i = 0; i < 3; i++) {
      const x = ninja.x + Math.random() * ninja.width;
      const y = ninja.y + ninja.height + Math.random() * 5;
      this.ctx.fillRect(x, y, 2, 2);
    }
  }

  private drawBoss(boss: Boss): void {
    // Use the generic drawing function for boss with detailed design
    drawEnemy(this.ctx, "boss", boss.x, boss.y, 0, {
      detailed: true, // Same detailed design as modal
      animated: true, // Add animations
      showShadow: true, // Show shadows
    });

    // Draw lives indicator
    this.drawBossLives(boss);
  }

  private drawBossLives(boss: Boss): void {
    const lives = boss.lives;
    const maxLives = 5;
    const heartSize = 10;
    const spacing = 3;

    for (let i = 0; i < maxLives; i++) {
      const x =
        boss.x +
        (boss.width - maxLives * (heartSize + spacing)) / 2 +
        i * (heartSize + spacing);
      const y = boss.y - heartSize - 8;

      if (i < lives) {
        // Full heart
        this.ctx.fillStyle = "#8B0000";
      } else {
        // Empty heart
        this.ctx.fillStyle = "#666666";
      }

      // Simple heart shape
      this.ctx.fillRect(x, y, heartSize, heartSize);
    }
  }

  private drawTorii(torii: Torii): void {
    // Draw torii gate
    this.ctx.fillStyle = "#8B4513";

    // Base pillars
    this.ctx.fillRect(torii.x, torii.y + torii.height - 20, 8, 20);
    this.ctx.fillRect(
      torii.x + torii.width - 8,
      torii.y + torii.height - 20,
      8,
      20
    );

    // Top beam
    this.ctx.fillRect(torii.x - 5, torii.y + 10, torii.width + 10, 8);

    // Decorative elements
    this.ctx.fillStyle = "#FFD700";
    this.ctx.fillRect(torii.x + 2, torii.y + 8, 4, 4);
    this.ctx.fillRect(torii.x + torii.width - 6, torii.y + 8, 4, 4);
  }

  private drawEnemyBullet(bullet: EnemyBullet): void {
    // Draw enemy bullet
    this.ctx.fillStyle = bullet.color;
    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    // Add glow effect
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.fillRect(
      bullet.x - 1,
      bullet.y - 1,
      bullet.width + 2,
      bullet.height + 2
    );
  }

  public render(
    samurais: Samurai[],
    ninjas: Ninja[],
    bosses: Boss[],
    sushis: Sushi[],
    toriis: Torii[],
    enemyBullets: EnemyBullet[]
  ): void {
    // Draw all enemies
    samurais.forEach((samurai) => this.drawSamurai(samurai));
    ninjas.forEach((ninja) => this.drawNinja(ninja));
    bosses.forEach((boss) => this.drawBoss(boss));

    // Draw collectibles
    sushis.forEach((sushi) => this.drawSushi(sushi));
    toriis.forEach((torii) => this.drawTorii(torii));

    // Draw enemy bullets
    enemyBullets.forEach((bullet) => this.drawEnemyBullet(bullet));
  }
}

import { BaseRenderer } from "./BaseRenderer";
import { Sushi, Samurai } from "@/types/game";
import { SUSHI_COLORS, SAMURAI_COLORS } from "@/constants/colors";

export class EnemyRenderer extends BaseRenderer {
  drawSushis(sushis: Sushi[]): void {
    sushis.forEach((sushi) => {
      this.drawSushi(sushi);
    });
  }

  drawSamurais(samurais: Samurai[]): void {
    samurais.forEach((samurai) => {
      this.drawSamurai(samurai);
    });
  }

  private drawSushi(sushi: Sushi): void {
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
  }

  private drawSamurai(samurai: Samurai): void {
    this.drawSamuraiBody(samurai);
    this.drawSamuraiHelmet(samurai);
    this.drawSamuraiArmor(samurai);
    this.drawSamuraiFace(samurai);
    this.drawSamuraiWeapon(samurai);
    this.drawSamuraiLives(samurai);
  }

  private drawSamuraiBody(samurai: Samurai): void {
    // Draw samurai body (armor base) - blue armor
    this.ctx.fillStyle = "#0066CC";
    this.ctx.fillRect(samurai.x, samurai.y, samurai.width, samurai.height);
  }

  private drawSamuraiHelmet(samurai: Samurai): void {
    // Draw samurai helmet (kabuto) - blue helmet with golden crests
    this.ctx.fillStyle = "#0066CC";
    this.ctx.fillRect(samurai.x + 6, samurai.y, samurai.width - 12, 15);

    // Draw helmet top (hachi) - rounded top
    this.ctx.fillStyle = "#004499";
    this.ctx.fillRect(samurai.x + 8, samurai.y - 2, samurai.width - 16, 4);

    // Draw golden horn-like crests (maedate)
    this.ctx.fillStyle = "#FFD700";
    this.ctx.fillRect(samurai.x + 12, samurai.y - 6, 4, 8);
    this.ctx.fillRect(samurai.x + 24, samurai.y - 6, 4, 8);
    this.ctx.fillRect(samurai.x + 18, samurai.y - 8, 4, 6);

    // Draw helmet side flaps (fukigaeshi)
    this.ctx.fillStyle = "#0066CC";
    this.ctx.fillRect(samurai.x - 2, samurai.y + 2, 6, 12);
    this.ctx.fillRect(samurai.x + samurai.width - 4, samurai.y + 2, 6, 12);
  }

  private drawSamuraiArmor(samurai: Samurai): void {
    // Draw samurai armor (yoroi) - blue segmented armor
    this.ctx.fillStyle = "#0066CC";
    this.ctx.fillRect(samurai.x + 4, samurai.y + 15, samurai.width - 8, 30);

    // Draw segmented armor plates (lamellae)
    this.ctx.fillStyle = "#000000";
    for (let i = 0; i < 5; i++) {
      this.ctx.fillRect(
        samurai.x + 4,
        samurai.y + 20 + i * 5,
        samurai.width - 8,
        2
      );
    }

    // Draw shoulder guards (sode)
    this.ctx.fillStyle = "#CC0000";
    this.ctx.fillRect(samurai.x - 2, samurai.y + 15, 6, 20);
    this.ctx.fillRect(samurai.x + samurai.width - 4, samurai.y + 15, 6, 20);

    // Draw armored sleeves (kote)
    this.ctx.fillStyle = "#0066CC";
    this.ctx.fillRect(samurai.x - 4, samurai.y + 25, 8, 15);
    this.ctx.fillRect(samurai.x + samurai.width - 4, samurai.y + 25, 8, 15);

    // Draw armored skirt (kusazuri)
    this.ctx.fillStyle = "#CC0000";
    for (let i = 0; i < 4; i++) {
      this.ctx.fillRect(samurai.x + 2 + i * 10, samurai.y + 45, 6, 15);
    }

    // Draw leg protection
    this.ctx.fillStyle = "#0066CC";
    this.ctx.fillRect(samurai.x + 8, samurai.y + 50, 8, 10);
    this.ctx.fillRect(samurai.x + 24, samurai.y + 50, 8, 10);
  }

  private drawSamuraiFace(samurai: Samurai): void {
    // Draw samurai face mask (menpo)
    this.ctx.fillStyle = "#CC0000";
    this.ctx.fillRect(samurai.x + 10, samurai.y + 8, samurai.width - 20, 8);

    // Draw mask details - brown skin showing through
    this.ctx.fillStyle = "#8B4513";
    this.ctx.fillRect(samurai.x + 12, samurai.y + 10, samurai.width - 24, 2);
    this.ctx.fillRect(samurai.x + 12, samurai.y + 14, samurai.width - 24, 2);
  }

  private drawSamuraiWeapon(samurai: Samurai): void {
    // Draw katana sword
    this.ctx.fillStyle = "#C0C0C0"; // Silver blade
    this.ctx.fillRect(samurai.x + 15, samurai.y + 20, 10, 2);
    this.ctx.fillStyle = "#FFD700"; // Gold hilt
    this.ctx.fillRect(samurai.x + 25, samurai.y + 19, 3, 4);
  }

  private drawSamuraiLives(samurai: Samurai): void {
    const heartSize = 8;
    const heartSpacing = 10;
    const startX = samurai.x;
    const startY = samurai.y - 20;

    for (let i = 0; i < samurai.maxLives; i++) {
      const heartX = startX + i * heartSpacing;
      const heartY = startY;

      if (i < samurai.lives) {
        this.ctx.fillStyle = SAMURAI_COLORS.LIFE_HEART;
      } else {
        this.ctx.fillStyle = SAMURAI_COLORS.LIFE_HEART_EMPTY;
      }

      // Draw pixelated heart
      this.ctx.fillRect(heartX + 2, heartY + 2, heartSize - 4, heartSize - 4);
      this.ctx.fillRect(heartX + 1, heartY + 1, 2, 2);
      this.ctx.fillRect(heartX + heartSize - 3, heartY + 1, 2, 2);
      this.ctx.fillRect(heartX + 3, heartY + heartSize - 3, 2, 2);

      // Heart outline for filled hearts
      if (i < samurai.lives) {
        this.ctx.fillStyle = "#8B0000";
        this.ctx.fillRect(heartX, heartY, heartSize, 1);
        this.ctx.fillRect(heartX, heartY + heartSize - 1, heartSize, 1);
        this.ctx.fillRect(heartX, heartY, 1, heartSize);
        this.ctx.fillRect(heartX + heartSize - 1, heartY, 1, heartSize);
      }
    }
  }
}

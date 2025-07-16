import {
  Player,
  RiceRocket,
  Sushi,
  Torii,
  Samurai,
  SamuraiBullet,
} from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import {
  ENVIRONMENT_COLORS,
  RICE_ROCKET_COLORS,
  SUSHI_COLORS,
  TORII_COLORS,
  SAMURAI_COLORS,
  SAMURAI_BULLET_COLORS,
  COMMON_COLORS,
} from "@/constants/colors";
import { GameLogic } from "@/utils/gameLogic";

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

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

  drawPlayer(player: Player): void {
    // Draw player shadow
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    this.ctx.fillRect(
      player.x + 2,
      player.y + player.height + 2,
      player.width - 4,
      4
    );

    // Draw player body (kimono-like shape)
    this.ctx.fillStyle = "#8B4513"; // Brown kimono color
    this.ctx.fillRect(
      player.x + 2,
      player.y + 8,
      player.width - 4,
      player.height - 8
    );

    // Draw kimono collar (white)
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(player.x + 4, player.y + 6, player.width - 8, 6);

    // Draw kimono belt (red)
    this.ctx.fillStyle = "#DC143C";
    this.ctx.fillRect(player.x + 3, player.y + 18, player.width - 6, 4);

    // Draw head (skin tone)
    this.ctx.fillStyle = "#FFE4B5";
    this.ctx.fillRect(player.x + 4, player.y, player.width - 8, 12);

    // Draw hair (black)
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(player.x + 2, player.y, player.width - 4, 6);

    // Draw eyes (white)
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(player.x + 7, player.y + 4, 4, 4);
    this.ctx.fillRect(player.x + 19, player.y + 4, 4, 4);

    // Draw pupils (black)
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(player.x + 8, player.y + 5, 2, 2);
    this.ctx.fillRect(player.x + 20, player.y + 5, 2, 2);

    // Draw mouth (simple line)
    this.ctx.strokeStyle = "#8B0000";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(player.x + 12, player.y + 10);
    this.ctx.lineTo(player.x + 18, player.y + 10);
    this.ctx.stroke();

    // Draw kimono sleeves
    this.ctx.fillStyle = "#8B4513";
    this.ctx.fillRect(player.x, player.y + 10, 4, 8);
    this.ctx.fillRect(player.x + player.width - 4, player.y + 10, 4, 8);

    // Draw hands
    this.ctx.fillStyle = "#FFE4B5";
    this.ctx.fillRect(player.x - 2, player.y + 12, 3, 4);
    this.ctx.fillRect(player.x + player.width - 1, player.y + 12, 3, 4);
  }

  drawRiceRockets(riceRockets: RiceRocket[]): void {
    riceRockets.forEach((rocket) => {
      this.ctx.fillStyle = rocket.color;
      this.ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);

      this.ctx.fillStyle = RICE_ROCKET_COLORS.HIGHLIGHT;
      this.ctx.fillRect(
        rocket.x,
        rocket.y,
        rocket.width / 2,
        rocket.height / 2
      );
    });
  }

  drawSushis(sushis: Sushi[]): void {
    sushis.forEach((sushi) => {
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
    });
  }

  drawToriis(toriis: Torii[]): void {
    toriis.forEach((torii) => {
      const baseY = torii.y + torii.height;

      // Save context for transformations
      this.ctx.save();

      // Draw shadow
      this.ctx.fillStyle = TORII_COLORS.SHADOW;
      this.ctx.fillRect(torii.x + 3, baseY + 2, torii.width, 8);

      // Draw main pillars with gradient effect
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
      leftGradient.addColorStop(0.5, TORII_COLORS.SECONDARY);
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
      rightGradient.addColorStop(0.5, TORII_COLORS.SECONDARY);
      rightGradient.addColorStop(1, TORII_COLORS.PRIMARY);
      this.ctx.fillStyle = rightGradient;
      this.ctx.fillRect(
        torii.x + torii.width - pillarWidth,
        torii.y,
        pillarWidth,
        pillarHeight
      );

      // Draw pillar details (wood grain effect)
      this.ctx.fillStyle = TORII_COLORS.WOOD_GRAIN;
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

      // Draw top horizontal beam (kasagi) with curve
      this.ctx.fillStyle = TORII_COLORS.PRIMARY;
      this.ctx.beginPath();
      this.ctx.moveTo(torii.x - 8, torii.y);
      this.ctx.lineTo(torii.x + torii.width + 8, torii.y);
      this.ctx.lineTo(
        torii.x + torii.width + 6,
        torii.y + GAME_CONSTANTS.TORII_TOP_BAR_HEIGHT
      );
      this.ctx.lineTo(
        torii.x - 6,
        torii.y + GAME_CONSTANTS.TORII_TOP_BAR_HEIGHT
      );
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

      // Add golden details
      this.ctx.fillStyle = TORII_COLORS.GOLD_DETAILS;
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
      this.ctx.fillStyle = TORII_COLORS.GOLD_DETAILS;
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
      this.ctx.strokeStyle = TORII_COLORS.OUTLINE;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(torii.x, torii.y, torii.width, torii.height);

      // Restore context
      this.ctx.restore();
    });
  }

  drawSamurais(samurais: Samurai[]): void {
    samurais.forEach((samurai) => {
      // Draw samurai body (armor base) - blue armor like in the image
      this.ctx.fillStyle = "#0066CC"; // Blue armor base
      this.ctx.fillRect(samurai.x, samurai.y, samurai.width, samurai.height);

      // Draw samurai helmet (kabuto) - blue helmet with golden crests
      this.ctx.fillStyle = "#0066CC"; // Blue helmet
      this.ctx.fillRect(samurai.x + 6, samurai.y, samurai.width - 12, 15);

      // Draw helmet top (hachi) - rounded top
      this.ctx.fillStyle = "#004499"; // Darker blue for helmet top
      this.ctx.fillRect(samurai.x + 8, samurai.y - 2, samurai.width - 16, 4);

      // Draw golden horn-like crests (maedate) - prominent golden ornaments
      this.ctx.fillStyle = "#FFD700"; // Bright gold for crests
      this.ctx.fillRect(samurai.x + 12, samurai.y - 6, 4, 8);
      this.ctx.fillRect(samurai.x + 24, samurai.y - 6, 4, 8);
      this.ctx.fillRect(samurai.x + 18, samurai.y - 8, 4, 6);

      // Draw helmet side flaps (fukigaeshi) - blue flaps
      this.ctx.fillStyle = "#0066CC"; // Blue for flaps
      this.ctx.fillRect(samurai.x - 2, samurai.y + 2, 6, 12);
      this.ctx.fillRect(samurai.x + samurai.width - 4, samurai.y + 2, 6, 12);

      // Draw samurai armor (yoroi) - blue segmented armor
      this.ctx.fillStyle = "#0066CC"; // Blue for main armor
      this.ctx.fillRect(samurai.x + 4, samurai.y + 15, samurai.width - 8, 30);

      // Draw segmented armor plates (lamellae) - black lines
      this.ctx.fillStyle = "#000000"; // Black for segment lines
      this.ctx.fillRect(samurai.x + 4, samurai.y + 20, samurai.width - 8, 2);
      this.ctx.fillRect(samurai.x + 4, samurai.y + 25, samurai.width - 8, 2);
      this.ctx.fillRect(samurai.x + 4, samurai.y + 30, samurai.width - 8, 2);
      this.ctx.fillRect(samurai.x + 4, samurai.y + 35, samurai.width - 8, 2);
      this.ctx.fillRect(samurai.x + 4, samurai.y + 40, samurai.width - 8, 2);

      // Draw shoulder guards (sode) - red accents like in the image
      this.ctx.fillStyle = "#CC0000"; // Red for shoulder guards
      this.ctx.fillRect(samurai.x - 2, samurai.y + 15, 6, 20);
      this.ctx.fillRect(samurai.x + samurai.width - 4, samurai.y + 15, 6, 20);

      // Draw armored sleeves (kote) - blue arm armor
      this.ctx.fillStyle = "#0066CC"; // Blue for arm armor
      this.ctx.fillRect(samurai.x - 4, samurai.y + 25, 8, 15);
      this.ctx.fillRect(samurai.x + samurai.width - 4, samurai.y + 25, 8, 15);

      // Draw armored skirt (kusazuri) - red skirt like in the image
      this.ctx.fillStyle = "#CC0000"; // Red for skirt
      this.ctx.fillRect(samurai.x + 2, samurai.y + 45, 6, 15);
      this.ctx.fillRect(samurai.x + 12, samurai.y + 45, 6, 15);
      this.ctx.fillRect(samurai.x + 22, samurai.y + 45, 6, 15);
      this.ctx.fillRect(samurai.x + 32, samurai.y + 45, 6, 15);

      // Draw leg protection - blue leg armor
      this.ctx.fillStyle = "#0066CC"; // Blue for leg armor
      this.ctx.fillRect(samurai.x + 8, samurai.y + 50, 8, 10);
      this.ctx.fillRect(samurai.x + 24, samurai.y + 50, 8, 10);

      // Draw samurai face mask (menpo) - red mask like in the image
      this.ctx.fillStyle = "#CC0000"; // Red for mask
      this.ctx.fillRect(samurai.x + 10, samurai.y + 8, samurai.width - 20, 8);

      // Draw mask details - brown skin showing through
      this.ctx.fillStyle = "#8B4513"; // Brown for skin
      this.ctx.fillRect(samurai.x + 12, samurai.y + 10, samurai.width - 24, 2);
      this.ctx.fillRect(samurai.x + 12, samurai.y + 14, samurai.width - 24, 2);

      // Draw katana sword - silver blade with golden hilt
      this.ctx.fillStyle = "#C0C0C0"; // Silver for blade
      this.ctx.fillRect(samurai.x + 15, samurai.y + 20, 10, 2);
      this.ctx.fillStyle = "#FFD700"; // Gold for hilt
      this.ctx.fillRect(samurai.x + 25, samurai.y + 19, 3, 4);

      // Draw samurai lives (hearts) - more detailed
      this.drawSamuraiLives(samurai);
    });
  }

  drawSamuraiLives(samurai: Samurai): void {
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

      // Draw more detailed pixelated heart
      // Main heart body
      this.ctx.fillRect(heartX + 2, heartY + 2, heartSize - 4, heartSize - 4);

      // Heart top curves
      this.ctx.fillRect(heartX + 1, heartY + 1, 2, 2);
      this.ctx.fillRect(heartX + heartSize - 3, heartY + 1, 2, 2);

      // Heart bottom point
      this.ctx.fillRect(heartX + 3, heartY + heartSize - 3, 2, 2);

      // Heart outline (for filled hearts)
      if (i < samurai.lives) {
        this.ctx.fillStyle = "#8B0000"; // Darker red for outline
        this.ctx.fillRect(heartX, heartY, heartSize, 1);
        this.ctx.fillRect(heartX, heartY + heartSize - 1, heartSize, 1);
        this.ctx.fillRect(heartX, heartY, 1, heartSize);
        this.ctx.fillRect(heartX + heartSize - 1, heartY, 1, heartSize);
      }
    }
  }

  drawSamuraiBullets(samuraiBullets: SamuraiBullet[]): void {
    samuraiBullets.forEach((bullet) => {
      // Draw shuriken trail
      this.ctx.fillStyle = SAMURAI_BULLET_COLORS.TRAIL;
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
    });
  }

  drawDistance(
    distance: number,
    distanceText?: string,
    metersText?: string
  ): void {
    this.ctx.fillStyle = COMMON_COLORS.WHITE;
    this.ctx.font = "bold 20px Arial";
    const text = distanceText
      ? `${distanceText}: ${GameLogic.formatDistance(distance)}${
          metersText ? ` ${metersText}` : "m"
        }`
      : `Distance: ${GameLogic.formatDistance(distance)}m`;
    this.ctx.fillText(text, 20, 40);
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

  render(
    player: Player,
    riceRockets: RiceRocket[],
    sushis: Sushi[],
    toriis: Torii[],
    samurais: Samurai[],
    samuraiBullets: SamuraiBullet[],
    distance: number,
    isGameRunning: boolean,
    isGameOver: boolean,
    translations?: {
      title?: string;
      distance?: string;
      meters?: string;
      startMessage?: string;
      jumpMessage?: string;
      enemyMessage?: string;
      gameOver?: string;
      finalScore?: string;
      restartMessage?: string;
    }
  ): void {
    this.clearCanvas();
    this.drawGround();
    this.drawPlayer(player);
    this.drawRiceRockets(riceRockets);
    this.drawSushis(sushis);
    this.drawToriis(toriis);
    this.drawSamurais(samurais);
    this.drawSamuraiBullets(samuraiBullets);
    this.drawDistance(distance, translations?.distance, translations?.meters);

    if (!isGameRunning && !isGameOver) {
      this.drawStartScreen(
        translations?.startMessage,
        translations?.jumpMessage,
        translations?.enemyMessage
      );
    }
  }
}

import {
  Player,
  RiceRocket,
  Sushi,
  Torii,
  Samurai,
  SamuraiBullet,
  PowerUp,
} from "@/types/game";
import { EnvironmentRenderer } from "./EnvironmentRenderer";
import { PlayerRenderer } from "./PlayerRenderer";
import { ProjectileRenderer } from "./ProjectileRenderer";
import { EnemyRenderer } from "./EnemyRenderer";
import { DecorationRenderer } from "./DecorationRenderer";
import { UIRenderer } from "./UIRenderer";
import { PowerUpRenderer } from "./PowerUpRenderer";

export class GameRenderer {
  private environmentRenderer: EnvironmentRenderer;
  private playerRenderer: PlayerRenderer;
  private projectileRenderer: ProjectileRenderer;
  private enemyRenderer: EnemyRenderer;
  private decorationRenderer: DecorationRenderer;
  private uiRenderer: UIRenderer;
  private powerUpRenderer: PowerUpRenderer;
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.environmentRenderer = new EnvironmentRenderer(ctx);
    this.playerRenderer = new PlayerRenderer(ctx);
    this.projectileRenderer = new ProjectileRenderer(ctx);
    this.enemyRenderer = new EnemyRenderer(ctx);
    this.decorationRenderer = new DecorationRenderer(ctx);
    this.uiRenderer = new UIRenderer(ctx);
    this.powerUpRenderer = new PowerUpRenderer(ctx);

    // Optimize canvas context for better performance
    this.optimizeContext();
  }

  private optimizeContext(): void {
    // Enable hardware acceleration
    this.ctx.imageSmoothingEnabled = false;

    // Set composite operation for better blending
    this.ctx.globalCompositeOperation = "source-over";

    // Optimize text rendering
    this.ctx.textBaseline = "top";
    this.ctx.font = "16px Arial";
  }

  render(
    player: Player,
    riceRockets: RiceRocket[],
    sushis: Sushi[],
    toriis: Torii[],
    samurais: Samurai[],
    samuraiBullets: SamuraiBullet[],
    powerUps: PowerUp[],
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
      riceRockets?: string;
      ammoCount?: string;
    }
  ): void {
    // Render environment
    this.environmentRenderer.clearCanvas();
    this.environmentRenderer.drawGround();

    // Render game entities
    this.playerRenderer.drawPlayer(player);
    this.projectileRenderer.drawRiceRockets(riceRockets);
    this.projectileRenderer.drawSamuraiBullets(samuraiBullets);
    this.enemyRenderer.drawSushis(sushis);
    this.enemyRenderer.drawSamurais(samurais);
    this.decorationRenderer.drawToriis(toriis);
    this.powerUpRenderer.drawPowerUps(powerUps);

    // Render UI
    this.uiRenderer.drawDistance(
      distance,
      translations?.distance,
      translations?.meters
    );

    // Render start screen if needed
    if (!isGameRunning && !isGameOver) {
      this.uiRenderer.drawStartScreen(
        translations?.startMessage,
        translations?.jumpMessage,
        translations?.enemyMessage
      );
    }
  }
}

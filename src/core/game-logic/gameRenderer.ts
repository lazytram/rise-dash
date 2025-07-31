import {
  Player,
  RiceRocket,
  Sushi,
  Torii,
  Samurai,
  SamuraiBullet,
  PowerUp,
} from "@/shared/types/game";
import { EnvironmentRenderer } from "./EnvironmentRenderer";
import { PlayerRenderer } from "./PlayerRenderer";
import { ProjectileRenderer } from "./ProjectileRenderer";
import { EnemyRenderer } from "./EnemyRenderer";
import { DecorationRenderer } from "./DecorationRenderer";
import { UIRenderer } from "./UIRenderer";
import { PowerUpRenderer } from "./PowerUpRenderer";
import { CullingSystem } from "@/shared/utils/cullingSystem";

export class GameRenderer {
  private environmentRenderer: EnvironmentRenderer;
  private playerRenderer: PlayerRenderer;
  private projectileRenderer: ProjectileRenderer;
  private enemyRenderer: EnemyRenderer;
  private decorationRenderer: DecorationRenderer;
  private uiRenderer: UIRenderer;
  private powerUpRenderer: PowerUpRenderer;
  private ctx: CanvasRenderingContext2D;

  // Optimization systems
  private cullingSystem: CullingSystem;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;

    // Initialize optimization systems
    this.cullingSystem = new CullingSystem(ctx.canvas.width, ctx.canvas.height);

    // Initialize renderers
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

    // Disable image smoothing for pixel art style
    this.ctx.imageSmoothingEnabled = false;
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
    // Render environment (always rendered)
    this.environmentRenderer.clearCanvas();
    this.environmentRenderer.drawGround();

    // Use culling for better performance
    const playerX = player.x;

    // Filter visible entities
    const visibleRiceRockets = this.cullingSystem.filterVisibleEntities(
      riceRockets,
      playerX
    );
    const visibleSamuraiBullets = this.cullingSystem.filterVisibleEntities(
      samuraiBullets,
      playerX
    );
    const visibleSushis = this.cullingSystem.filterVisibleEntities(
      sushis,
      playerX
    );
    const visibleSamurais = this.cullingSystem.filterVisibleEntities(
      samurais,
      playerX
    );
    const visibleToriis = this.cullingSystem.filterVisibleEntities(
      toriis,
      playerX
    );
    const visiblePowerUps = this.cullingSystem.filterVisibleEntities(
      powerUps,
      playerX
    );

    // Render visible entities
    this.projectileRenderer.drawRiceRockets(visibleRiceRockets);
    this.projectileRenderer.drawSamuraiBullets(visibleSamuraiBullets);
    this.enemyRenderer.drawSushis(visibleSushis);
    this.enemyRenderer.drawSamurais(visibleSamurais);
    this.decorationRenderer.drawToriis(visibleToriis);
    this.powerUpRenderer.drawPowerUps(visiblePowerUps);

    // Render player (always rendered, no culling)
    this.playerRenderer.drawPlayer(player);

    // Render UI (always rendered, no culling)
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

  // Get optimization statistics
  getOptimizationStats(): {
    culling: {
      viewportWidth: number;
      viewportHeight: number;
      cullingMargin: number;
      renderDistance: number;
    };
  } {
    return {
      culling: this.cullingSystem.getStats(),
    };
  }
}

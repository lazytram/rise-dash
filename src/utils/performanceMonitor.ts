export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 0;
  private frameTime: number = 0;
  private isEnabled: boolean = false;

  constructor(enabled: boolean = false) {
    this.isEnabled = enabled;
  }

  start(): void {
    this.isEnabled = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
  }

  stop(): void {
    this.isEnabled = false;
  }

  update(): void {
    if (!this.isEnabled) return;

    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 1000) {
      // Update every second
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameTime = deltaTime / this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Log performance metrics
      console.log(
        `FPS: ${this.fps}, Frame Time: ${this.frameTime.toFixed(2)}ms`
      );
    }
  }

  getFPS(): number {
    return this.fps;
  }

  getFrameTime(): number {
    return this.frameTime;
  }

  isPerformanceGood(): boolean {
    return this.fps >= 55; // Consider good if above 55 FPS
  }

  getPerformanceReport(): {
    fps: number;
    frameTime: number;
    isGood: boolean;
    recommendations: string[];
  } {
    const recommendations: string[] = [];

    if (this.fps < 30) {
      recommendations.push(
        "FPS très bas - Vérifiez les performances du système"
      );
    } else if (this.fps < 50) {
      recommendations.push("FPS bas - Considérez réduire la qualité graphique");
    } else if (this.fps < 55) {
      recommendations.push("FPS acceptable mais peut être amélioré");
    }

    if (this.frameTime > 20) {
      recommendations.push("Temps de frame élevé - Optimisations nécessaires");
    }

    return {
      fps: this.fps,
      frameTime: this.frameTime,
      isGood: this.isPerformanceGood(),
      recommendations,
    };
  }
}

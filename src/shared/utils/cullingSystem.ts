/**
 * Culling System for performance optimization
 * Determines which entities should be rendered based on visibility and distance
 */
export class CullingSystem {
  private viewportWidth: number;
  private viewportHeight: number;
  private cullingMargin: number = 100; // Extra margin for smooth transitions
  private renderDistance: number = 900; // Maximum render distance

  constructor(viewportWidth: number, viewportHeight: number) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
  }

  /**
   * Check if an entity is visible in the viewport
   */
  isEntityVisible(
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean {
    return (
      x + width + this.cullingMargin >= 0 &&
      x - this.cullingMargin <= this.viewportWidth &&
      y + height + this.cullingMargin >= 0 &&
      y - this.cullingMargin <= this.viewportHeight
    );
  }

  /**
   * Check if an entity is within render distance
   */
  isEntityInRenderDistance(entityX: number, playerX: number): boolean {
    return Math.abs(entityX - playerX) <= this.renderDistance;
  }

  /**
   * Filter entities based on visibility and distance
   */
  filterVisibleEntities<
    T extends { x: number; y: number; width: number; height: number }
  >(entities: T[], playerX: number): T[] {
    return entities.filter(
      (entity) =>
        this.isEntityVisible(entity.x, entity.y, entity.width, entity.height) &&
        this.isEntityInRenderDistance(entity.x, playerX)
    );
  }

  /**
   * Get entities by distance (for LOD)
   */
  getEntitiesByDistance<
    T extends { x: number; y: number; width: number; height: number }
  >(
    entities: T[],
    playerX: number
  ): {
    near: T[];
    medium: T[];
    far: T[];
  } {
    const visible = this.filterVisibleEntities(entities, playerX);

    return {
      near: visible.filter((e) => Math.abs(e.x - playerX) < 300),
      medium: visible.filter(
        (e) => Math.abs(e.x - playerX) >= 300 && Math.abs(e.x - playerX) < 600
      ),
      far: visible.filter((e) => Math.abs(e.x - playerX) >= 600),
    };
  }

  /**
   * Update viewport dimensions
   */
  updateViewport(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  /**
   * Set culling parameters
   */
  setCullingParameters(margin: number, distance: number): void {
    this.cullingMargin = margin;
    this.renderDistance = distance;
  }

  /**
   * Get culling statistics
   */
  getStats(): {
    viewportWidth: number;
    viewportHeight: number;
    cullingMargin: number;
    renderDistance: number;
  } {
    return {
      viewportWidth: this.viewportWidth,
      viewportHeight: this.viewportHeight,
      cullingMargin: this.cullingMargin,
      renderDistance: this.renderDistance,
    };
  }
}

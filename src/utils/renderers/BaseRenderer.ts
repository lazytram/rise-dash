// CanvasRenderingContext2D is available globally in browser environment

export abstract class BaseRenderer {
  protected ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  protected drawShadow(
    x: number,
    y: number,
    width: number,
    height: number,
    offset: number = 2
  ): void {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    this.ctx.fillRect(x + offset, y + offset, width, height);
  }

  protected drawGradientRect(
    x: number,
    y: number,
    width: number,
    height: number,
    colors: string[],
    direction: "horizontal" | "vertical" = "horizontal"
  ): void {
    const gradient =
      direction === "horizontal"
        ? this.ctx.createLinearGradient(x, y, x + width, y)
        : this.ctx.createLinearGradient(x, y, x, y + height);

    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, width, height);
  }

  protected setShadow(
    color: string = "rgba(0, 0, 0, 0.5)",
    blur: number = 5,
    offsetX: number = 0,
    offsetY: number = 2
  ): void {
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = blur;
    this.ctx.shadowOffsetX = offsetX;
    this.ctx.shadowOffsetY = offsetY;
  }

  protected clearShadow(): void {
    this.ctx.shadowColor = "transparent";
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }

  protected drawBorderedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor: string,
    borderColor: string,
    borderWidth: number = 1
  ): void {
    // Fill
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(x, y, width, height);

    // Border
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = borderWidth;
    this.ctx.strokeRect(x, y, width, height);
  }
}

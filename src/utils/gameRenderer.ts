// This file provides backward compatibility with the old GameRenderer interface.
// The new modular renderer structure is available in: src/utils/renderers/

import { GameRenderer as NewGameRenderer } from "./renderers/GameRenderer";

export class GameRenderer extends NewGameRenderer {
  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }
}

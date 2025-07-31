import { GAME_CONSTANTS } from "@/shared/constants/game";

interface GameCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const GameCanvas = ({ canvasRef }: GameCanvasProps) => {
  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-2xl p-6 rounded-lg flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="border-2 border-white/20 rounded-lg"
        style={{
          display: "block",
          imageRendering: "pixelated", // Better for pixel art
          // Performance optimizations
          willChange: "transform", // Hint to browser for GPU acceleration
          transform: "translateZ(0)", // Force hardware acceleration
          backfaceVisibility: "hidden", // Optimize for 2D rendering
        }}
        width={GAME_CONSTANTS.CANVAS_WIDTH}
        height={GAME_CONSTANTS.CANVAS_HEIGHT}
        // Performance attributes
        data-performance="optimized"
        // Additional performance hints
        data-render-mode="optimized"
        data-hardware-accelerated="true"
      />
    </div>
  );
};

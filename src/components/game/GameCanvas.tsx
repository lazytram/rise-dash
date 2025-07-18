import { GAME_CONSTANTS } from "@/constants/game";

interface GameCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const GameCanvas = ({ canvasRef }: GameCanvasProps) => {
  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-2xl p-6 rounded-lg">
      <canvas
        ref={canvasRef}
        className="border-2 border-white/20 rounded-lg"
        style={{
          display: "block",
        }}
        width={GAME_CONSTANTS.CANVAS_WIDTH}
        height={GAME_CONSTANTS.CANVAS_HEIGHT}
      />
    </div>
  );
};

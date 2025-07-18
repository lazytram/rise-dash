import { GAME_CONSTANTS } from "@/constants/game";

interface GameCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const GameCanvas = ({ canvasRef }: GameCanvasProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-300 rounded"
        style={{
          display: "block",
        }}
        width={GAME_CONSTANTS.CANVAS_WIDTH}
        height={GAME_CONSTANTS.CANVAS_HEIGHT}
      />
    </div>
  );
};

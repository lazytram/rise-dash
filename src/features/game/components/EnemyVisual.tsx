import React, { useRef, useEffect, useState } from "react";
import { EnemyType } from "./hooks/useEnemyData";
import { drawEnemy, getCenteredPosition } from "@/shared/utils/enemyDrawing";

interface EnemyVisualProps {
  type: EnemyType;
  size?: number;
  animated?: boolean;
}

export const EnemyVisual: React.FC<EnemyVisualProps> = ({
  type,
  size = 80,
  animated = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [animationFrame, setAnimationFrame] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Scale for better visibility
    const scale = size / 100;
    ctx.scale(scale, scale);

    // Get centered position for this enemy type
    const position = getCenteredPosition(type);

    // Draw enemy using the generic function
    drawEnemy(ctx, type, position.x, position.y, animationFrame, {
      detailed: true,
      animated: animated,
      showShadow: true,
    });

    // Animation loop
    if (animated) {
      animationRef.current = requestAnimationFrame(() => {
        setAnimationFrame((prev) => prev + 1);
      });
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, size, animated, animationFrame]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg"
      />
      {animated && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        </div>
      )}
    </div>
  );
};

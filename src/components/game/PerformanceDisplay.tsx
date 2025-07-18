import React, { useState, useEffect } from "react";
import { PerformanceMonitor } from "@/utils/performanceMonitor";

interface PerformanceDisplayProps {
  performanceMonitor: PerformanceMonitor;
  isVisible?: boolean;
}

export const PerformanceDisplay: React.FC<PerformanceDisplayProps> = ({
  performanceMonitor,
  isVisible = false,
}) => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    isGood: false,
  });

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      const report = performanceMonitor.getPerformanceReport();
      setMetrics({
        fps: report.fps,
        frameTime: report.frameTime,
        isGood: report.isGood,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [performanceMonitor, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg font-mono text-sm z-50">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span>FPS:</span>
          <span
            className={`font-bold ${
              metrics.fps >= 55
                ? "text-green-400"
                : metrics.fps >= 30
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {metrics.fps}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Frame:</span>
          <span
            className={`font-bold ${
              metrics.frameTime <= 16.67
                ? "text-green-400"
                : metrics.frameTime <= 33.33
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {metrics.frameTime.toFixed(1)}ms
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Status:</span>
          <span
            className={`font-bold ${
              metrics.isGood ? "text-green-400" : "text-red-400"
            }`}
          >
            {metrics.isGood ? "✓ Good" : "⚠ Poor"}
          </span>
        </div>
      </div>
    </div>
  );
};

"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface CircularButtonProps {
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
  tooltip: string;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

export function CircularButton({
  href,
  onClick,
  icon,
  tooltip,
  gradientFrom,
  gradientTo,
  className = "",
}: CircularButtonProps) {
  const buttonContent = (
    <div className="relative group">
      {/* Enhanced circular button with glassmorphism */}
      <div
        className={`w-16 h-16 rounded-full overflow-hidden backdrop-blur-sm bg-white/25 border border-white/40 hover:bg-white/35 hover:border-white/60 transition-all duration-400 shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer transform hover:scale-110 hover:-translate-y-1 ${className}`}
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}30, ${gradientTo}30), linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        <div className="relative z-10 text-2xl">{icon}</div>

        {/* Enhanced inner glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{
            background: `radial-gradient(circle, ${gradientFrom}50 0%, transparent 70%)`,
          }}
        />

        {/* Outer ring effect */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/30 transition-all duration-400"></div>
      </div>

      {/* Enhanced tooltip with better positioning */}
      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 px-4 py-2 backdrop-blur-xl bg-black/90 text-white text-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-400 whitespace-nowrap z-30 shadow-2xl border border-white/20">
        {tooltip}
        {/* Enhanced arrow */}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black/90"></div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="pointer-events-auto">
        {buttonContent}
      </button>
    );
  }

  return (
    <Link href={href!} className="pointer-events-auto">
      {buttonContent}
    </Link>
  );
}

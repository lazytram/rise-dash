"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface CircularButtonProps {
  href: string;
  icon: ReactNode;
  tooltip: string;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

export function CircularButton({
  href,
  icon,
  tooltip,
  gradientFrom,
  gradientTo,
  className = "",
}: CircularButtonProps) {
  return (
    <Link href={href} className="group">
      <div className="relative">
        {/* Circular button */}
        <div
          className={`w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105 flex items-center justify-center ${className}`}
          style={{
            background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
          }}
        >
          {icon}
        </div>

        {/* Hover tooltip */}
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
          {tooltip}
          {/* Arrow pointing left */}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black/80"></div>
        </div>
      </div>
    </Link>
  );
}

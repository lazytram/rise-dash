"use client";

import React from "react";

export const ShimmerBox: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900/20 to-slate-800/30 backdrop-blur-sm border border-slate-400/30 rounded-lg p-3 w-32 sm:w-36 md:w-40 lg:w-44 h-20 sm:h-22 md:h-24 lg:h-26 flex flex-col shadow-lg animate-pulse">
      <div className="h-3 bg-slate-200/30 rounded mb-2 flex-shrink-0"></div>
      <div className="flex-1 flex items-center justify-center">
        <div className="h-2 bg-slate-200/30 rounded w-3/4"></div>
      </div>
    </div>
  );
};

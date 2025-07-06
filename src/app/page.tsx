"use client";

import Game from "@/components/Game";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] max-xs:p-5 p-14 flex justify-center rounded-[20px] min-h-[calc(100vh_-_48px)] relative z-10">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Rise Dash
        </h1>
        <Game />
      </div>
    </main>
  );
}

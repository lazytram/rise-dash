"use client";

import { SceneManager } from "@/components/scenes/SceneManager";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] min-h-screen">
      <SceneManager />
    </main>
  );
}

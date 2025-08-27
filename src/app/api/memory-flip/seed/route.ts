import { NextResponse } from "next/server";

export async function POST() {
  // Simple seed endpoint; could be replaced with signed seeds
  const seed = Math.floor(Math.random() * 1_000_000_000);
  return NextResponse.json({ seed });
}

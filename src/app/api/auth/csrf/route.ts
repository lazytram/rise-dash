import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET() {
  try {
    // Generate a random nonce for SIWE
    const nonce = randomBytes(32).toString("hex");

    return NextResponse.json({ csrfToken: nonce });
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

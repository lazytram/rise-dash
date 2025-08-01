import { NextRequest, NextResponse } from "next/server";
import { keccak256, encodePacked } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Types for the request and response
interface SignScoreWithRiceRequest {
  score: number;
  playerName: string;
  riceReward: number;
  playerAddress: string;
  gameHash: string;
}

interface SignScoreWithRiceResponse {
  signature: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      score,
      playerName,
      riceReward,
      playerAddress,
      gameHash,
    }: SignScoreWithRiceRequest = await request.json();

    // Validate required fields
    if (
      !score ||
      !playerName ||
      riceReward === undefined ||
      !playerAddress ||
      !gameHash
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the private key from environment
    const privateKey = process.env.GAME_AUTH_PRIVATE_KEY;
    if (!privateKey) {
      console.error("GAME_AUTH_PRIVATE_KEY not found in environment");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create account from private key
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    // Create the message hash exactly as in the ScoreBoard contract
    const messageHash = keccak256(
      encodePacked(
        ["uint256", "string", "uint256", "address", "bytes32"],
        [
          BigInt(score),
          playerName,
          BigInt(riceReward),
          playerAddress as `0x${string}`, // This will be msg.sender when called
          gameHash as `0x${string}`,
        ]
      )
    );

    // Sign the message hash with the game owner's private key
    const signature = await account.signMessage({
      message: { raw: messageHash },
    });

    return NextResponse.json<SignScoreWithRiceResponse>({ signature });
  } catch (error) {
    console.error("Error signing score with RICE:", error);
    return NextResponse.json(
      { error: "Failed to sign score with RICE" },
      { status: 500 }
    );
  }
}

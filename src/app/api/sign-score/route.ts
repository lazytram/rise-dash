import { NextRequest, NextResponse } from "next/server";
import { privateKeyToAccount } from "viem/accounts";

const GAME_AUTH_PRIVATE_KEY = process.env
  .GAME_AUTH_PRIVATE_KEY as `0x${string}`;

export async function POST(request: NextRequest) {
  try {
    const { score, playerName, playerAddress, gameHash } = await request.json();

    if (!score || !playerName || !playerAddress || !gameHash) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    if (!GAME_AUTH_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured: missing GAME_AUTH_PRIVATE_KEY" },
        { status: 500 }
      );
    }

    const account = privateKeyToAccount(GAME_AUTH_PRIVATE_KEY);

    // Créer le message hash exactement comme dans le smart contract
    const { keccak256, encodePacked } = await import("viem");
    const messageHash = keccak256(
      encodePacked(
        ["uint256", "string", "address", "bytes32"],
        [
          BigInt(score),
          playerName,
          playerAddress as `0x${string}`,
          gameHash as `0x${string}`,
        ]
      )
    );

    // Signer le message hash
    const signature = await account.signMessage({
      message: { raw: messageHash },
    });

    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Error signing score:", error);
    return NextResponse.json({ error: "Failed to sign" }, { status: 500 });
  }
}

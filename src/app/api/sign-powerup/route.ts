import { NextRequest, NextResponse } from "next/server";
import { privateKeyToAccount } from "viem/accounts";

const GAME_AUTH_PRIVATE_KEY = process.env
  .GAME_AUTH_PRIVATE_KEY as `0x${string}`;

// Type definitions for request parameters
interface SignPowerUpRequest {
  playerAddress: `0x${string}`;
  powerUpId: number;
  upgradeHash: string;
}

// Type definitions for response
interface SignPowerUpResponse {
  signature: `0x${string}`;
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: NextRequest) {
  try {
    const { playerAddress, powerUpId, upgradeHash }: SignPowerUpRequest =
      await request.json();

    if (!playerAddress || powerUpId === undefined || !upgradeHash) {
      return NextResponse.json<ErrorResponse>(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (!GAME_AUTH_PRIVATE_KEY) {
      return NextResponse.json<ErrorResponse>(
        { error: "Server misconfigured: missing GAME_AUTH_PRIVATE_KEY" },
        { status: 500 }
      );
    }

    const account = privateKeyToAccount(GAME_AUTH_PRIVATE_KEY);

    // Get the upgrade cost from blockchain
    const { blockchainService } = await import(
      "@/infrastructure/blockchain/blockchainService"
    );
    const cost = await blockchainService.getPowerUpUpgradeCost(
      playerAddress,
      powerUpId
    );

    // Create message hash exactly as in the PowerUpManager smart contract
    const { keccak256, encodePacked } = await import("viem");
    const messageHash = keccak256(
      encodePacked(
        ["string", "address", "uint256", "uint256", "bytes32"],
        [
          "UPGRADE_POWERUP",
          playerAddress,
          BigInt(powerUpId),
          BigInt(cost),
          upgradeHash as `0x${string}`,
        ]
      )
    );

    // Sign the message hash
    const signature = await account.signMessage({
      message: { raw: messageHash },
    });

    return NextResponse.json<SignPowerUpResponse>({ signature });
  } catch (error) {
    console.error("Error signing power-up operation:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to sign operation" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { privateKeyToAccount } from "viem/accounts";

const GAME_AUTH_PRIVATE_KEY = process.env
  .GAME_AUTH_PRIVATE_KEY as `0x${string}`;

// Type definitions for request parameters
interface SignRiceRequest {
  operation: "ADD_RICE" | "SPEND_RICE";
  playerAddress: `0x${string}`;
  amount: number | string;
  operationHash: `0x${string}`;
}

// Type definitions for response
interface SignRiceResponse {
  signature: `0x${string}`;
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: NextRequest) {
  try {
    const { operation, playerAddress, amount, operationHash }: SignRiceRequest =
      await request.json();

    if (!operation || !playerAddress || !amount || !operationHash) {
      return NextResponse.json<ErrorResponse>(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate operation type
    if (operation !== "ADD_RICE" && operation !== "SPEND_RICE") {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid operation type. Must be 'ADD_RICE' or 'SPEND_RICE'" },
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

    // Create message hash exactly as in the RICEManager smart contract
    const { keccak256, encodePacked } = await import("viem");
    const messageHash = keccak256(
      encodePacked(
        ["string", "address", "uint256", "bytes32"],
        [operation, playerAddress, BigInt(amount), operationHash]
      )
    );

    // Sign the message hash
    const signature = await account.signMessage({
      message: { raw: messageHash },
    });

    return NextResponse.json<SignRiceResponse>({ signature });
  } catch (error) {
    console.error("Error signing RICE operation:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to sign operation" },
      { status: 500 }
    );
  }
}

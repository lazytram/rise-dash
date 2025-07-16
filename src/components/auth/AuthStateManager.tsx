"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useSession, signOut } from "next-auth/react";

export function AuthStateManager() {
  const { isConnected } = useAccount();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only handle disconnection when wallet is disconnected but session exists
    if (!isConnected && session && status === "authenticated") {
      console.log("Wallet disconnected, signing out session");
      signOut({ redirect: false });
    }
  }, [isConnected, session, status]);

  // This component doesn't render anything
  return null;
}

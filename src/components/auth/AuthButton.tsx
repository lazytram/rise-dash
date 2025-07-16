"use client";

import { useAccount, useSignMessage } from "wagmi";
import { useSession, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAuthSync } from "@/hooks/useAuthSync";
import { useEffect, useState } from "react";

export function AuthButton() {
  const { data: session, status } = useSession();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);

  useAuthSync();

  // Trigger SIWE signature only when wallet is connected but not authenticated
  useEffect(() => {
    const signSiwe = async () => {
      // Avoid double signatures - wait for session to load
      if (
        !isConnected ||
        !address ||
        session ||
        isSigning ||
        status === "loading"
      )
        return;

      setIsSigning(true);
      try {
        // Get nonce
        const nonceResponse = await fetch("/api/auth/csrf");
        const { csrfToken } = await nonceResponse.json();

        // Create SIWE message
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: "Sign in to Rise Dash to prove you own this wallet.",
          uri: window.location.origin,
          version: "1",
          chainId: 1,
          nonce: csrfToken,
        });

        // Request signature
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        // Authenticate with NextAuth
        await signIn("credentials", {
          message: JSON.stringify(message),
          redirect: false,
          signature,
        });
      } catch (error) {
        console.error("SIWE signing error:", error);
      } finally {
        setIsSigning(false);
      }
    };

    // Delay to avoid conflicts with RainbowKit
    const timeoutId = setTimeout(signSiwe, 100);
    return () => clearTimeout(timeoutId);
  }, [isConnected, address, session, signMessageAsync, isSigning, status]);

  return <ConnectButton />;
}

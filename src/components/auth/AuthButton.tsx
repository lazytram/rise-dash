"use client";

import { useAccount, useSignMessage } from "wagmi";
import { useSession, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { riseTestnet } from "wagmi/chains";
import { useAuthSync } from "@/hooks/useAuthSync";
import { useState, useEffect, useRef, memo } from "react";

export const AuthButton = memo(function AuthButton() {
  const { data: session, status } = useSession();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);
  const [shouldSignIn, setShouldSignIn] = useState(false);
  const hasAttemptedSignIn = useRef(false);

  useAuthSync();

  // Trigger SIWE signature only when explicitly requested
  useEffect(() => {
    const signSiwe = async () => {
      if (
        !shouldSignIn ||
        !isConnected ||
        !address ||
        session ||
        isSigning ||
        status === "loading" ||
        hasAttemptedSignIn.current
      )
        return;

      hasAttemptedSignIn.current = true;
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
          chainId: riseTestnet.id,
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
        // Reset on error to allow retry
        hasAttemptedSignIn.current = false;
      } finally {
        setIsSigning(false);
        setShouldSignIn(false);
      }
    };

    if (shouldSignIn) {
      signSiwe();
    }
  }, [shouldSignIn, isConnected, address, session, signMessageAsync, isSigning, status]);

  // Reset when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setShouldSignIn(false);
      hasAttemptedSignIn.current = false;
    }
  }, [isConnected]);

  // Listen for wallet connection and trigger sign in if needed
  useEffect(() => {
    if (isConnected && address && !session && !hasAttemptedSignIn.current) {
      // Only trigger if this is a fresh connection (not auto-reconnect)
      const timeoutId = setTimeout(() => {
        if (isConnected && address && !session && !hasAttemptedSignIn.current) {
          setShouldSignIn(true);
        }
      }, 500); // Longer delay to avoid auto-reconnect issues

      return () => clearTimeout(timeoutId);
    }
  }, [isConnected, address, session]);

  return (
    <div className="rainbow-kit-wrapper">
      <ConnectButton />
    </div>
  );
});

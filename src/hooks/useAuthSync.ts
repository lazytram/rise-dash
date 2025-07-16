import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useSession, signOut } from "next-auth/react";

export function useAuthSync() {
  const { isConnected, address } = useAccount();
  const { data: session, status } = useSession();
  const hasSignedOut = useRef(false);
  const lastAddress = useRef<string | null>(null);

  useEffect(() => {
    // Prevent multiple signOut calls
    if (hasSignedOut.current) return;

    // Only act if status is not loading
    if (status === "loading") return;

    // Si le wallet se déconnecte mais qu'il y a encore une session NextAuth
    if (!isConnected && session && status === "authenticated") {
      console.log("Wallet disconnected, signing out");
      hasSignedOut.current = true;
      signOut({ redirect: false });
      return;
    }

    // Si le wallet est connecté mais avec une adresse différente de celle de la session
    if (
      isConnected &&
      address &&
      session?.address &&
      status === "authenticated" &&
      address.toLowerCase() !== session.address.toLowerCase()
    ) {
      console.log("Address changed, signing out");
      hasSignedOut.current = true;
      signOut({ redirect: false });
      return;
    }

    // Update last known address
    if (address) {
      lastAddress.current = address;
    }
  }, [isConnected, address, session, status]);

  // Reset flag when wallet connects/disconnects
  useEffect(() => {
    if (!isConnected) {
      hasSignedOut.current = false;
      lastAddress.current = null;
    }
  }, [isConnected]);
}

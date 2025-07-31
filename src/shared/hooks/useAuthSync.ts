import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useSession, signOut } from "next-auth/react";

export function useAuthSync() {
  const { isConnected, address } = useAccount();
  const { data: session, status } = useSession();

  useEffect(() => {
    // If wallet disconnects but there's still a NextAuth session
    if (!isConnected && session) {
      signOut();
    }

    // If wallet is connected but with a different address than the session
    if (
      isConnected &&
      address &&
      session?.address &&
      address.toLowerCase() !== session.address.toLowerCase()
    ) {
      signOut();
    }
  }, [isConnected, address, session, status]);
}

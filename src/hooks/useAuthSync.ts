import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useSession, signOut } from "next-auth/react";

export function useAuthSync() {
  const { isConnected } = useAccount();
  const { data: session } = useSession();

  useEffect(() => {
    // Si le wallet se déconnecte mais qu'il y a encore une session NextAuth
    if (!isConnected && session) {
      signOut();
    }
  }, [isConnected, session]);
}

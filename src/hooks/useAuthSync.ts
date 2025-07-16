import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useSession, signOut } from "next-auth/react";

export function useAuthSync() {
  const { isConnected, address } = useAccount();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Si le wallet se déconnecte mais qu'il y a encore une session NextAuth
    if (!isConnected && session) {
      signOut();
    }

    // Si le wallet est connecté mais avec une adresse différente de celle de la session
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

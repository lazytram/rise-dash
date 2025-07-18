"use client";

import { ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useSceneStore } from "@/store/sceneStore";
import { SceneType } from "@/types/scenes";

interface AuthGuardProps {
  children: ReactNode;
  title: string;
  fallbackMessage?: string;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isConnected } = useAccount();
  const { data: session, status } = useSession();
  const { setScene } = useSceneStore();

  const isAuthenticated = isConnected && session && status === "authenticated";

  useEffect(() => {
    if (!isAuthenticated) {
      setScene(SceneType.WELCOME);
    }
  }, [isAuthenticated, setScene]);

  return <>{children}</>;
};

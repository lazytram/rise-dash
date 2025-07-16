"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProfileContent } from "@/components/game/ProfileContent";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProfilePage() {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnecting) return; // Still connecting

    if (!isConnected) {
      // Redirect to home if wallet not connected
      router.push("/");
    }
  }, [isConnected, isConnecting, router]);

  if (isConnecting) {
    return (
      <PageLayout className="flex items-center justify-center">
        <LoadingSpinner color="white" />
      </PageLayout>
    );
  }

  if (!isConnected) {
    return null; // Will redirect
  }

  return (
    <PageLayout>
      <ProfileContent />
    </PageLayout>
  );
}

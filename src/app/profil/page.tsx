"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProfileContent } from "@/components/game/ProfileContent";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      // Redirect to home if not authenticated
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <PageLayout className="flex items-center justify-center">
        <LoadingSpinner color="white" />
      </PageLayout>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <PageLayout>
      <ProfileContent />
    </PageLayout>
  );
}

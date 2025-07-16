"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
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
      <main className="bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] min-h-screen flex items-center justify-center">
        <LoadingSpinner color="white" />
      </main>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <main className="bg-gradient-to-b from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] min-h-screen">
      <Header />
      <div className="pt-20 px-4">
        <ProfileContent />
      </div>
    </main>
  );
}

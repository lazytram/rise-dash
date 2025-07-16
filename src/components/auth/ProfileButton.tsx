"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/hooks/useTranslations";
import { CircularButton } from "@/components/ui/CircularButton";
import { memo } from "react";

export const ProfileButton = memo(function ProfileButton() {
  const { data: session } = useSession();
  const { t } = useTranslations();

  // Get user image from session or use default
  const userImage = session?.user?.image || "/armchair.png";

  return (
    <CircularButton
      href="/profil"
      icon={
        <Image
          src={userImage}
          alt={t("profile.title")}
          width={48}
          height={48}
          className="w-full h-full object-contain"
          priority
        />
      }
      tooltip={t("profile.title")}
      gradientFrom="#3b82f6"
      gradientTo="#1d4ed8"
    />
  );
});

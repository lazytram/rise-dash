"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/hooks/useTranslations";
import { CircularButton } from "@/components/ui/CircularButton";
import { useSceneStore } from "@/store/sceneStore";
import { memo } from "react";
import { SceneType } from "@/types/scenes";

export const ProfileButton = memo(function ProfileButton() {
  const { data: session } = useSession();
  const { t } = useTranslations();
  const { setScene } = useSceneStore();

  // Get user image from session or use default
  const userImage = session?.user?.image || "/armchair.png";

  const handleClick = () => {
    setScene(SceneType.PROFILE);
  };

  return (
    <CircularButton
      onClick={handleClick}
      icon={
        <Image
          src={userImage}
          alt={t("scenes.profile.title")}
          width={48}
          height={48}
          className="w-full h-full object-contain rounded-full"
          priority
        />
      }
      tooltip={t("scenes.profile.title")}
      gradientFrom="#3b82f6"
      gradientTo="#1d4ed8"
    />
  );
});

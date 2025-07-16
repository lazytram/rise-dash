"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/hooks/useTranslations";

export function ProfileButton() {
  const { data: session } = useSession();
  const { t } = useTranslations();

  // Get user image from session or use default
  const userImage = session?.user?.image || "/armchair.png";
  const userName = session?.user?.name || t("profile.title");

  return (
    <Link href="/profil" className="group">
      <div className="relative">
        {/* Circular profile button */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105">
          <Image
            src={userImage}
            alt={userName}
            width={48}
            height={48}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Hover tooltip */}
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
          {t("profile.title")}
          {/* Arrow pointing left */}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black/80"></div>
        </div>
      </div>
    </Link>
  );
}

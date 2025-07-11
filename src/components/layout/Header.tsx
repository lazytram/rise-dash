"use client";

import { AuthButton } from "@/components/auth/AuthButton";
import { LanguageSelector } from "@/components/LanguageSelector";

export function Header() {
  return (
    <div className="flex flex-col items-end gap-y-4 absolute top-4 right-4">
      <AuthButton />
      <LanguageSelector />
    </div>
  );
}

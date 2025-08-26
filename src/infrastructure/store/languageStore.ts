import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKeys } from "./storeKeys";

export type Locale = "en" | "fr" | "es";

interface LanguageStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: "en", // Default language changed to English
      setLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: StoreKeys.LanguageStore, // localStorage key
    }
  )
);

export const availableLocales: { code: Locale; name: string; flag: string }[] =
  [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

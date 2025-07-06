import { useLanguageStore } from "@/store/languageStore";
import en from "@/languages/en.json";
import fr from "@/languages/fr.json";
import es from "@/languages/es.json";

type TranslationValue =
  | string
  | Record<string, string | Record<string, string>>;

const languages = {
  en,
  fr,
  es,
} as const;

export const useTranslations = () => {
  const locale = useLanguageStore((state) => state.locale);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: TranslationValue = languages[locale];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = languages.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found in fallback
          }
        }
        break;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return { t, locale };
};

"use client";

import { useLanguageStore, availableLocales } from "@/store/languageStore";
import { useTranslations } from "@/hooks/useTranslations";
import { useState } from "react";

export const LanguageSelector = () => {
  const { locale, setLocale } = useLanguageStore();
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = availableLocales.find((l) => l.code === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
        aria-label={t("ui.selectLanguage")}
      >
        <span className="text-lg">{currentLocale?.flag}</span>
        <span className="text-sm font-medium">
          {currentLocale?.code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border overflow-hidden z-50 min-w-[150px]">
          {availableLocales.map((localeOption) => (
            <button
              key={localeOption.code}
              onClick={() => {
                setLocale(localeOption.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                locale === localeOption.code
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700"
              }`}
            >
              <span className="text-lg">{localeOption.flag}</span>
              <span className="font-medium">{localeOption.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

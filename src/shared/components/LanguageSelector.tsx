"use client";

import {
  useLanguageStore,
  availableLocales,
} from "@/infrastructure/store/languageStore";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { useState, memo, useCallback } from "react";
import { Button } from "@/shared/components/Button";

export const LanguageSelector = memo(function LanguageSelector() {
  const { locale, setLocale } = useLanguageStore();
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = availableLocales.find((l) => l.code === locale);

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      setLocale(newLocale as "en" | "fr" | "es");
      setIsOpen(false);
    },
    [setLocale]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="relative pointer-events-auto">
      <Button
        onClick={handleToggle}
        variant="ghost"
        size="sm"
        className="flex items-center gap-3 px-4 py-2.5 backdrop-blur-sm bg-white/20 border border-white/30 hover:bg-white/30 hover:border-white/50 rounded-xl transition-all duration-300 hover:scale-105"
        aria-label={t("ui.selectLanguage")}
      >
        <span className="text-xl filter drop-shadow-sm">
          {currentLocale?.flag}
        </span>
        <span className="text-sm font-semibold text-white">
          {currentLocale?.code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 text-white ${
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
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 bg-gradient-to-b from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[200px] animate-fade-in">
          {availableLocales.map((localeOption, index) => (
            <button
              key={localeOption.code}
              onClick={() => handleLocaleChange(localeOption.code)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-white/20 transition-all duration-200 cursor-pointer transform hover:scale-105 ${
                locale === localeOption.code
                  ? "bg-white/30 text-white font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <span className="text-xl filter drop-shadow-sm">
                {localeOption.flag}
              </span>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">
                  {localeOption.name}
                </span>
                <span className="text-xs opacity-70">
                  {localeOption.code.toUpperCase()}
                </span>
              </div>
              {locale === localeOption.code && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClose}
          style={{ animation: "fadeIn 0.2s ease-out" }}
        />
      )}
    </div>
  );
});

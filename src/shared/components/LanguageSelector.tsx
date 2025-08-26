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
        className="flex items-center gap-3 px-4 py-2.5 backdrop-blur-sm glass-light border border-primary/20 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300 hover:scale-105"
        aria-label={t("ui.selectLanguage")}
      >
        <span className="text-xl filter drop-shadow-sm">
          {currentLocale?.flag}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {currentLocale?.code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 text-foreground ${
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
        <div className="absolute top-full right-0 mt-3 glass-light backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[200px] animate-fade-in">
          {availableLocales.map((localeOption, index) => (
            <button
              key={localeOption.code}
              onClick={() => handleLocaleChange(localeOption.code)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-primary/10 transition-all duration-200 cursor-pointer transform hover:scale-105 ${
                locale === localeOption.code
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-foreground hover:text-primary"
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
                <span className="text-xs text-muted-foreground">
                  {localeOption.code.toUpperCase()}
                </span>
              </div>
              {locale === localeOption.code && (
                <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>
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

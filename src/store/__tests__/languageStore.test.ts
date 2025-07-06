import {
  useLanguageStore,
  availableLocales,
  type Locale,
} from "../languageStore";
import { act, renderHook } from "@testing-library/react";

// Mock localStorage for Zustand persist
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("languageStore", () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    localStorageMock.clear();
    jest.clearAllMocks();
    // Reset Zustand store
    useLanguageStore.getState().setLocale("en");
  });

  describe("initial state", () => {
    it("should initialize with English as default locale", () => {
      const { result } = renderHook(() => useLanguageStore());

      expect(result.current.locale).toBe("en");
    });
  });

  describe("setLocale functionality", () => {
    it("should update locale to French", () => {
      const { result } = renderHook(() => useLanguageStore());

      act(() => {
        result.current.setLocale("fr");
      });

      expect(result.current.locale).toBe("fr");
    });

    it("should update locale to Spanish", () => {
      const { result } = renderHook(() => useLanguageStore());

      act(() => {
        result.current.setLocale("es");
      });

      expect(result.current.locale).toBe("es");
    });

    it("should update locale to English", () => {
      const { result } = renderHook(() => useLanguageStore());

      // First set to another language
      act(() => {
        result.current.setLocale("fr");
      });

      // Then set back to English
      act(() => {
        result.current.setLocale("en");
      });

      expect(result.current.locale).toBe("en");
    });
  });

  describe("availableLocales", () => {
    it("should contain all supported locales with correct structure", () => {
      expect(availableLocales).toHaveLength(3);

      const expectedLocales = [
        { code: "en", name: "English", flag: "🇬🇧" },
        { code: "fr", name: "Français", flag: "🇫🇷" },
        { code: "es", name: "Español", flag: "🇪🇸" },
      ];

      expectedLocales.forEach((expected, index) => {
        expect(availableLocales[index]).toEqual(expected);
      });
    });

    it("should have valid locale codes", () => {
      const validCodes: Locale[] = ["en", "fr", "es"];

      availableLocales.forEach((locale) => {
        expect(validCodes).toContain(locale.code);
      });
    });

    it("should have non-empty names and flags", () => {
      availableLocales.forEach((locale) => {
        expect(locale.name).toBeTruthy();
        expect(locale.name.length).toBeGreaterThan(0);
        expect(locale.flag).toBeTruthy();
        expect(locale.flag.length).toBeGreaterThan(0);
      });
    });
  });

  describe("state persistence", () => {
    it("should maintain state across multiple hook instances", () => {
      const { result: result1 } = renderHook(() => useLanguageStore());

      act(() => {
        result1.current.setLocale("es");
      });

      // Create a second hook instance
      const { result: result2 } = renderHook(() => useLanguageStore());

      expect(result2.current.locale).toBe("es");
    });
  });

  describe("supported locales validation", () => {
    it("should accept all supported locales", () => {
      const { result } = renderHook(() => useLanguageStore());
      const supportedLocales: Locale[] = ["en", "fr", "es"];

      supportedLocales.forEach((locale) => {
        act(() => {
          result.current.setLocale(locale);
        });

        expect(result.current.locale).toBe(locale);
      });
    });
  });
});

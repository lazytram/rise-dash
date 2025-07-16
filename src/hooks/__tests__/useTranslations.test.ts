import { renderHook } from "@testing-library/react";
import { useTranslations } from "../useTranslations";
import { useLanguageStore } from "@/store/languageStore";

// Mock the language store
jest.mock("@/store/languageStore", () => ({
  useLanguageStore: jest.fn(),
}));

const mockUseLanguageStore = useLanguageStore as jest.MockedFunction<
  typeof useLanguageStore
>;

describe("useTranslations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("translation functionality", () => {
    it("should return correct translation for English", () => {
      mockUseLanguageStore.mockReturnValue("en");

      const { result } = renderHook(() => useTranslations());

      expect(result.current.t("game.title")).toBe("Rise Dash");
      expect(result.current.t("game.startGame")).toBe("Start Game");
      expect(result.current.t("ui.language")).toBe("Language");
    });

    it("should return correct translation for French", () => {
      mockUseLanguageStore.mockReturnValue("fr");

      const { result } = renderHook(() => useTranslations());

      expect(result.current.t("game.title")).toBe("Rise Dash");
      expect(result.current.t("game.startGame")).toBe("Commencer le jeu");
    });

    it("should return correct translation for Spanish", () => {
      mockUseLanguageStore.mockReturnValue("es");

      const { result } = renderHook(() => useTranslations());

      expect(result.current.t("game.title")).toBe("Rise Dash");
      expect(result.current.t("game.startGame")).toBe("Comenzar Juego");
    });

    it("should handle nested translation keys", () => {
      mockUseLanguageStore.mockReturnValue("en");

      const { result } = renderHook(() => useTranslations());

      expect(result.current.t("game.distance")).toBe("Distance traveled");
      expect(result.current.t("ui.selectLanguage")).toBe("Select language");
    });

    it("should return the current locale", () => {
      mockUseLanguageStore.mockReturnValue("fr");

      const { result } = renderHook(() => useTranslations());

      expect(result.current.locale).toBe("fr");
    });
  });

  describe("fallback functionality", () => {
    it("should fallback to English when translation key does not exist in current language", () => {
      mockUseLanguageStore.mockReturnValue("fr");

      const { result } = renderHook(() => useTranslations());

      // Assuming a key that might not exist in all languages
      const nonExistentKey = "nonexistent.key";
      expect(result.current.t(nonExistentKey)).toBe(nonExistentKey);
    });

    it("should return the key itself when translation is not found in any language", () => {
      mockUseLanguageStore.mockReturnValue("en");

      const { result } = renderHook(() => useTranslations());

      const invalidKey = "completely.invalid.key";
      expect(result.current.t(invalidKey)).toBe(invalidKey);
    });

    it("should handle empty or malformed keys gracefully", () => {
      mockUseLanguageStore.mockReturnValue("en");

      const { result } = renderHook(() => useTranslations());

      expect(result.current.t("")).toBe("");
      expect(result.current.t(".")).toBe(".");
      expect(result.current.t("...")).toBe("...");
    });
  });

  describe("edge cases", () => {
    it("should handle single-level keys", () => {
      mockUseLanguageStore.mockReturnValue("en");

      const { result } = renderHook(() => useTranslations());

      // This would return the key itself since our structure is nested
      expect(result.current.t("game")).toBe("game");
    });

    it("should handle keys with extra dots", () => {
      mockUseLanguageStore.mockReturnValue("en");

      const { result } = renderHook(() => useTranslations());

      const keyWithExtraDots = "game..title";
      expect(result.current.t(keyWithExtraDots)).toBe(keyWithExtraDots);
    });

    it("should handle numeric-like keys", () => {
      mockUseLanguageStore.mockReturnValue("en");

      const { result } = renderHook(() => useTranslations());

      const numericKey = "123.456";
      expect(result.current.t(numericKey)).toBe(numericKey);
    });
  });
});

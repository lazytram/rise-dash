import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LanguageSelector } from "../LanguageSelector";

// Mock the hooks and store
jest.mock("@/store/languageStore", () => ({
  useLanguageStore: () => ({
    locale: "en",
    setLocale: jest.fn(),
  }),
  availableLocales: [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ],
}));

jest.mock("@/hooks/useTranslations", () => ({
  useTranslations: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "ui.selectLanguage": "Select Language",
      };
      return translations[key] || key;
    },
  }),
}));

describe("LanguageSelector", () => {
  it("should render the current language selector", () => {
    render(<LanguageSelector />);

    // Should show the current language code in uppercase
    expect(screen.getByText("EN")).toBeInTheDocument();

    // Should have a button with proper aria-label
    expect(screen.getByLabelText("Select Language")).toBeInTheDocument();
  });

  it("should toggle dropdown when clicked", () => {
    render(<LanguageSelector />);

    const button = screen.getByLabelText("Select Language");

    // Initially, dropdown options should not be visible
    expect(screen.queryByText("English")).not.toBeInTheDocument();
    expect(screen.queryByText("Français")).not.toBeInTheDocument();

    // Click to open dropdown
    fireEvent.click(button);

    // Now options should be visible
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Français")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
  });

  it("should close dropdown when overlay is clicked", () => {
    render(<LanguageSelector />);

    const button = screen.getByLabelText("Select Language");

    // Open dropdown
    fireEvent.click(button);
    expect(screen.getByText("English")).toBeInTheDocument();

    // Click on overlay (fixed inset-0 div)
    const overlay = document.querySelector(".fixed.inset-0");
    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay!);

    // Dropdown should be closed
    expect(screen.queryByText("English")).not.toBeInTheDocument();
  });

  it("should show all available languages in dropdown", () => {
    render(<LanguageSelector />);

    const button = screen.getByLabelText("Select Language");
    fireEvent.click(button);

    // All languages should be visible
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Français")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
  });

  it("should show arrow icon that rotates when dropdown is open", () => {
    render(<LanguageSelector />);

    const button = screen.getByLabelText("Select Language");
    const svg = button.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveClass("rotate-180");

    // Open dropdown
    fireEvent.click(button);

    // Arrow should be rotated
    expect(svg).toHaveClass("rotate-180");
  });
});

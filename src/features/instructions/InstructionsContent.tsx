"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { Text } from "@/shared/components/Text";
import {
  InstructionsControls,
  InstructionsGameplay,
  InstructionsTips,
  InstructionsActions,
} from "../game/instructions";

export const InstructionsContent: React.FC = () => {
  const { t } = useTranslations();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: "controls",
      title: t("scenes.instructions.controls.title"),
      icon: "🎮",
      component: <InstructionsControls />,
    },
    {
      id: "gameplay",
      title: t("scenes.instructions.gameplay.title"),
      icon: "🎯",
      component: <InstructionsGameplay />,
    },
    {
      id: "tips",
      title: t("scenes.instructions.tips.title"),
      icon: "💡",
      component: <InstructionsTips />,
    },
    {
      id: "actions",
      title: t("scenes.instructions.actions.title"),
      icon: "🚀",
      component: <InstructionsActions />,
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        nextSlide();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nextSlide, prevSlide]);

  return (
    <div className="w-full">
      {/* Slider Container */}
      <div className="relative overflow-hidden">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="w-full flex-shrink-0 items-center flex justify-center"
            >
              <div className="max-w-xl mx-auto w-full">{slide.component}</div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-200/80 hover:bg-gray-300/80 rounded-full flex items-center justify-center text-gray-700 transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg"
          aria-label="Previous slide"
        >
          <span className="text-xl">‹</span>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-200/80 hover:bg-gray-300/80 rounded-full flex items-center justify-center text-gray-700 transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg"
          aria-label="Next slide"
        >
          <span className="text-xl">›</span>
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center space-x-2 mt-6">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-gradient-to-r from-[#7967e5] to-[#99eafc] scale-125"
                : "bg-gray-300/50 hover:bg-gray-400/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-1">
        <Text variant="body" className="text-gray-600 text-sm">
          {currentSlide + 1} / {slides.length}
        </Text>
      </div>
    </div>
  );
};

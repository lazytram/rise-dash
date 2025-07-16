"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import {
  InstructionsControls,
  InstructionsGameplay,
  InstructionsTips,
  InstructionsActions,
} from "./instructions";

export const InstructionsContent: React.FC = () => {
  const { t } = useTranslations();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: "controls",
      title: t("instructions.controls.title"),
      icon: "🎮",
      component: <InstructionsControls />,
    },
    {
      id: "gameplay",
      title: t("instructions.gameplay.title"),
      icon: "🎯",
      component: <InstructionsGameplay />,
    },
    {
      id: "tips",
      title: t("instructions.tips.title"),
      icon: "💡",
      component: <InstructionsTips />,
    },
    {
      id: "actions",
      title: "Ready to Play?",
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
    <Container className="py-8">
      <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-2xl p-6">
        {/* Enhanced Header */}
        <div className="text-center space-y-2 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-xl opacity-30 animate-pulse"></div>
            <h1 className="relative text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              {t("instructions.title")}
            </h1>
          </div>
          <div className="relative">
            <Text
              variant="subtitle"
              className="text-xl text-white/90 font-medium"
            >
              {t("instructions.subtitle")}
            </Text>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative overflow-hidden">
          {/* Slides */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="w-full flex-shrink-0">
                <div className="max-w-2xl mx-auto">{slide.component}</div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <span className="text-2xl">‹</span>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <span className="text-2xl">›</span>
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-3 mt-8">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-center mt-1">
          <Text variant="body" className="text-white/70">
            {currentSlide + 1} / {slides.length}
          </Text>
        </div>
      </Card>
    </Container>
  );
};

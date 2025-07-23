"use client";

import React, { memo } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { CardReward } from "@/types/dailyReveal";
import { getRarityStyles } from "./utils";

interface CardProps {
  card?: CardReward | null;
  isSpinning?: boolean;
  isRevealed?: boolean;
  size?: number;
  onClick?: () => void;
}

export const Card = memo<CardProps>(
  ({ card, isSpinning = false, isRevealed = false, size = 280, onClick }) => {
    const { t } = useTranslations();

    // Card back (verso) - when not revealed
    if (!isRevealed) {
      return (
        <div
          className={`
          relative cursor-pointer transition-all duration-300 ease-out
          transform hover:scale-105 active:scale-95
          ${isSpinning ? "animate-pulse" : ""}
        `}
          style={{ width: size, height: size * 1.4 }}
          onClick={onClick}
        >
          {/* Card background with enhanced design */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-amber-200 to-orange-200 rounded-2xl border-4 border-amber-400 shadow-2xl">
            {/* Enhanced decorative pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />

            {/* Enhanced card header */}
            <div className="relative z-10 text-center p-6">
              <div className="text-3xl font-bold text-amber-900 mb-3 drop-shadow-sm tracking-wide">
                {t("scenes.dailyReveal.riceCard")}
              </div>
              <div className="text-xl text-amber-800 font-semibold">
                {t("scenes.dailyReveal.tapToReveal")}
              </div>
            </div>

            {/* Enhanced floating elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-amber-600 opacity-70 animate-pulse"
                  style={{
                    left: `${10 + ((i * 10) % 80)}%`,
                    top: `${20 + ((i * 15) % 60)}%`,
                    fontSize: `${12 + (i % 3) * 3}px`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${2 + (i % 2)}s`,
                  }}
                >
                  🌾
                </div>
              ))}
            </div>

            {/* Enhanced glow effect */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-300/30 to-transparent opacity-50 animate-pulse"
              style={{ animationDuration: "3s" }}
            />

            {/* Mystery sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-yellow-400 opacity-80 animate-bounce"
                  style={{
                    left: `${20 + ((i * 20) % 60)}%`,
                    top: `${30 + ((i * 25) % 40)}%`,
                    fontSize: `${14 + (i % 2) * 2}px`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${1.5 + (i % 2) * 0.5}s`,
                  }}
                >
                  ✨
                </div>
              ))}
            </div>

            {/* Card corners decoration */}
            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-amber-500/40" />
            <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-amber-500/30" />
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-amber-500/50" />
            <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-amber-500/40" />
          </div>
        </div>
      );
    }

    // Card front (recto) - when revealed
    if (card) {
      const styles = getRarityStyles(card.rarity);

      return (
        <div
          className={`
          relative cursor-pointer transition-all duration-500 ease-out
          transform hover:scale-105 active:scale-95
          rounded-2xl shadow-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border-2
          ${isSpinning ? "animate-pulse" : ""}
        `}
          style={{
            width: size,
            height: size * 1.4,
            borderColor: styles.borderColor,
            boxShadow: styles.boxShadow,
            borderWidth: styles.borderWidth,
          }}
          onClick={onClick}
        >
          {/* Enhanced rarity glow effect */}
          <div
            className="absolute inset-0 rounded-2xl opacity-25"
            style={{
              background: `radial-gradient(circle at center, ${styles.glowColor} 0%, transparent 70%)`,
              boxShadow: `inset 0 0 30px ${styles.glowColor}30`,
            }}
          />

          {/* Card content with improved layout and readability */}
          <div className="relative z-10 p-6 text-center flex flex-col h-full">
            {/* Enhanced rarity badge */}
            <div
              className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 border-2 shadow-lg"
              style={{
                backgroundColor: `${styles.borderColor}25`,
                borderColor: styles.borderColor,
                color: styles.borderColor,
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {t(
                `scenes.dailyReveal.rarity.${card.rarity.toLowerCase()}`
              ).toUpperCase()}
            </div>

            {/* Enhanced emoji with better sizing and effects */}
            <div className="text-7xl mb-4 drop-shadow-lg flex-1 flex items-center justify-center">
              {card.emoji}
            </div>

            {/* Enhanced card name with better typography */}
            <div className="text-2xl font-bold text-gray-800 mb-3 tracking-wide drop-shadow-sm">
              {t(`scenes.dailyReveal.cards.${card.label}`)}
            </div>

            {/* Enhanced value with better visibility */}
            <div
              className="text-3xl font-bold text-green-600 mb-4 drop-shadow-md"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
            >
              +{card.value} RICE
            </div>

            {/* Enhanced daily reward label */}
            <div className="text-sm font-semibold text-gray-700 bg-gray-200 px-3 py-2 rounded-lg inline-block border border-gray-300 shadow-sm">
              {t("scenes.dailyReveal.dailyReward")}
            </div>
          </div>

          {/* Enhanced particles with better visibility */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute text-yellow-400 opacity-80 animate-bounce"
                style={{
                  left: `${15 + ((i * 18) % 70)}%`,
                  top: `${25 + ((i * 20) % 50)}%`,
                  fontSize: `${16 + (i % 2) * 3}px`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + (i % 2) * 0.5}s`,
                }}
              >
                ✨
              </div>
            ))}
          </div>

          {/* Enhanced corner accents */}
          <div
            className="absolute top-3 right-3 w-5 h-5 rounded-full opacity-40 shadow-lg"
            style={{ backgroundColor: styles.borderColor }}
          />
          <div
            className="absolute bottom-3 left-3 w-4 h-4 rounded-full opacity-30 shadow-md"
            style={{ backgroundColor: styles.borderColor }}
          />
          <div
            className="absolute top-3 left-3 w-3 h-3 rounded-full opacity-50 shadow-sm"
            style={{ backgroundColor: styles.borderColor }}
          />
          <div
            className="absolute bottom-3 right-3 w-3 h-3 rounded-full opacity-35 shadow-sm"
            style={{ backgroundColor: styles.borderColor }}
          />

          {/* Additional glow rings for extra effect */}
          <div
            className="absolute inset-0 rounded-2xl opacity-20"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${styles.glowColor}40, transparent)`,
              animation: "spin 4s linear infinite",
            }}
          />
        </div>
      );
    }

    // Empty state
    return (
      <div
        className="relative cursor-pointer transition-all duration-300 ease-out transform hover:scale-105"
        style={{ width: size, height: size * 1.4 }}
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300 shadow-md">
          <div className="relative z-10 text-center p-6">
            <div className="text-xl font-bold text-gray-600 mb-2">
              {t("scenes.dailyReveal.riceCard")}
            </div>
            <div className="text-base text-gray-500">
              {t("scenes.dailyReveal.tapToReveal")}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

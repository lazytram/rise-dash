import React, { useState, useEffect } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";
import { EnemyType, useEnemyData } from "./hooks/useEnemyData";
import { EnemyVisual } from "./EnemyVisual";

interface EnemyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnemyInfoModal: React.FC<EnemyInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [activeEnemy, setActiveEnemy] = useState<EnemyType>("samurai");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { enemies, getColorClasses } = useEnemyData();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleEnemyChange = (enemyType: "samurai" | "ninja" | "boss") => {
    if (enemyType === activeEnemy || isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveEnemy(enemyType);
      setIsTransitioning(false);
    }, 150);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const activeEnemyData = enemies.find((enemy) => enemy.type === activeEnemy);
  const colors = activeEnemyData
    ? getColorClasses(activeEnemyData.color)
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col
          transform transition-all duration-300 border border-gray-200/50
          ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 flex-shrink-0 bg-gradient-to-r from-[#7967e5]/10 to-[#99eafc]/10 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {t("scenes.game.enemyInfo.title")}
            </h2>
            <p className="text-gray-600 text-xs mt-1">
              {t("scenes.game.enemyInfo.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200/50 hover:bg-gray-300/50 flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center p-4 border-b border-gray-200/50 flex-shrink-0 bg-gray-50/50">
          <div className="flex space-x-2">
            {enemies.map((enemy) => {
              const isActive = activeEnemy === enemy.type;
              const enemyColors = getColorClasses(enemy.color);

              return (
                <button
                  key={enemy.type}
                  onClick={() => handleEnemyChange(enemy.type)}
                  disabled={isTransitioning}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
                    transition-all duration-200 relative overflow-hidden cursor-pointer
                    ${
                      isActive
                        ? "bg-[#7967e5]/20 text-gray-900 border-2 border-[#7967e5]/40 shadow-md"
                        : "text-gray-700 hover:bg-[#7967e5]/10 border-2 border-gray-200/50 hover:border-[#7967e5]/30 bg-white/50"
                    }
                    ${isTransitioning ? "opacity-50" : "opacity-100"}
                    hover:scale-105 active:scale-95
                  `}
                >
                  {/* Background effect for active state */}
                  {isActive && (
                    <div
                      className={`absolute inset-0 ${enemyColors.bg} opacity-10 rounded-lg`}
                    />
                  )}

                  <div className="relative flex items-center space-x-2">
                    <span className="text-lg">{enemy.icon}</span>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-sm">
                        {t(`scenes.game.enemyInfo.enemies.${enemy.type}.name`)}
                      </span>
                      <span className="text-xs opacity-75">
                        {t(
                          `scenes.game.enemyInfo.enemies.${enemy.type}.difficulty`
                        )}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 bg-gradient-to-br from-gray-50/50 to-white/50 rounded-b-xl">
          {activeEnemyData && colors && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Visual Section */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  <div className="transition-all duration-300">
                    <EnemyVisual
                      type={activeEnemyData.type}
                      size={80}
                      animated={true}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className={`inline-flex items-center px-3 py-2 rounded-full bg-[#7967e5]/20 border border-[#7967e5]/30 text-[#7967e5] text-xs font-semibold mb-2 shadow-sm`}
                  >
                    {t(
                      `scenes.game.enemyInfo.enemies.${activeEnemyData.type}.difficulty`
                    )}{" "}
                    {t("scenes.game.enemyInfo.difficulty")}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {t(
                      `scenes.game.enemyInfo.enemies.${activeEnemyData.type}.name`
                    )}
                  </h3>
                  <p className="text-gray-700 text-xs">
                    {t(
                      `scenes.game.enemyInfo.enemies.${activeEnemyData.type}.strategy`
                    )}
                  </p>
                </div>
              </div>

              {/* Info Section */}
              <div className="space-y-4">
                {/* Description */}
                <div className="bg-white/80 rounded-lg p-4 border border-gray-200/50 shadow-sm backdrop-blur-sm">
                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                    {t("scenes.game.enemyInfo.description")}
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {t(
                      `scenes.game.enemyInfo.enemies.${activeEnemyData.type}.description`
                    )}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`bg-white/80 rounded-lg p-3 border border-gray-200/50 shadow-sm backdrop-blur-sm`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="text-base mr-2">⚔️</span>
                      <div className="font-semibold text-gray-900 text-sm">
                        {t("scenes.game.enemyInfo.attack")}
                      </div>
                    </div>
                    <div className="text-gray-700 text-xs">
                      {t(
                        `scenes.game.enemyInfo.enemies.${activeEnemyData.type}.attack`
                      )}
                    </div>
                  </div>

                  <div
                    className={`bg-white/80 rounded-lg p-3 border border-gray-200/50 shadow-sm backdrop-blur-sm`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="text-base mr-2">⏱️</span>
                      <div className="font-semibold text-gray-900 text-sm">
                        {t("scenes.game.enemyInfo.frequency")}
                      </div>
                    </div>
                    <div className="text-gray-700 text-xs">
                      {t(
                        `scenes.game.enemyInfo.enemies.${activeEnemyData.type}.frequency`
                      )}
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div
                  className={`bg-[#7967e5]/10 border border-[#7967e5]/20 rounded-lg p-3 shadow-sm backdrop-blur-sm`}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-base mr-2">💡</span>
                    <div className="font-semibold text-gray-900 text-sm">
                      {t("scenes.game.enemyInfo.proTips")}
                    </div>
                  </div>
                  <div className="text-gray-700 text-xs leading-relaxed">
                    {t(
                      `scenes.game.enemyInfo.enemies.${activeEnemyData.type}.tip`
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Modal } from "../../../shared/components/Modal";
import { Text } from "../../../shared/components/Text";
import { Button } from "../../../shared/components/Button";
import { Achievement } from "./types";
import { cn } from "@/shared/utils/cn";

interface AchievementModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  isOpen,
  onClose,
}) => {
  if (!achievement || !isOpen) return null;

  const rarityColors = {
    common: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-400",
    },
    rare: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-400",
    },
    epic: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-400",
    },
    legendary: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-400",
    },
  };

  const colors = rarityColors[achievement.rarity];
  const progressPercentage =
    (achievement.progress / achievement.maxProgress) * 100;

  return (
    <Modal>
      <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
        {/* Header avec icône et titre */}
        <div className={cn("p-6 text-center", colors.bg)}>
          <div className="text-6xl mb-4">{achievement.icon}</div>
          <Text variant="title" size="xl" className="mb-2">
            {achievement.title}
          </Text>
          <Text variant="subtitle" className={colors.text}>
            {achievement.description}
          </Text>
        </div>

        {/* Contenu détaillé */}
        <div className="p-6 space-y-4">
          {/* Rareté */}
          <div className="flex items-center justify-between">
            <Text variant="subtitle" className="text-gray-600">
              Rarity
            </Text>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                colors.text,
                colors.bg
              )}
            >
              {achievement.rarity.charAt(0).toUpperCase() +
                achievement.rarity.slice(1)}
            </span>
          </div>

          {/* Progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Text variant="caption" className="text-gray-600">
                Progress
              </Text>
              <Text variant="caption" className="text-gray-600">
                {achievement.progress} / {achievement.maxProgress}
              </Text>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={cn(
                  "h-3 rounded-full transition-all duration-300",
                  colors.border.replace("border-", "bg-")
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Statut */}
          <div className="flex items-center justify-between">
            <Text variant="subtitle" className="text-gray-600">
              Status
            </Text>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                achievement.isCompleted
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              )}
            >
              {achievement.isCompleted ? "Completed" : "In Progress"}
            </span>
          </div>

          {/* Récompense */}
          {achievement.reward && (
            <div className="space-y-2">
              <Text variant="subtitle" className="text-gray-600">
                Reward
              </Text>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {achievement.reward.type === "rice" && (
                  <>
                    <span className="text-2xl">🍚</span>
                    <div>
                      <Text variant="subtitle" className="font-semibold">
                        {achievement.reward.amount} RICE
                      </Text>
                      <Text variant="caption" className="text-gray-600">
                        Tokens earned
                      </Text>
                    </div>
                  </>
                )}
                {achievement.reward.type === "powerup" && (
                  <>
                    <span className="text-2xl">⚡</span>
                    <div>
                      <Text variant="subtitle" className="font-semibold">
                        {achievement.reward.name}
                      </Text>
                      <Text variant="caption" className="text-gray-600">
                        Power-up unlocked
                      </Text>
                    </div>
                  </>
                )}
                {achievement.reward.type === "title" && (
                  <>
                    <span className="text-2xl">👑</span>
                    <div>
                      <Text variant="subtitle" className="font-semibold">
                        {achievement.reward.name}
                      </Text>
                      <Text variant="caption" className="text-gray-600">
                        Title unlocked
                      </Text>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Message de motivation */}
          {!achievement.isCompleted && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <Text variant="caption" className="text-blue-700 text-center">
                Keep playing to unlock this achievement!
              </Text>
            </div>
          )}
        </div>

        {/* Bouton de fermeture */}
        <div className="p-6 pt-0">
          <Button onClick={onClose} variant="primary" className="w-full">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

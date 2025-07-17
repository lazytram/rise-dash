"use client";

import React from "react";
import { Player, DifficultyLevel } from "@/types/game";

interface GameIndicatorsProps {
  player: Player;
  difficultyLevel: DifficultyLevel;
}

interface PowerUpStatus {
  type: string;
  name: string;
  icon: string;
  remainingTime: number;
  isActive: boolean;
}

export class GameIndicators extends React.Component<GameIndicatorsProps> {
  private intervalId: NodeJS.Timeout | null = null;

  state = {
    currentTime: Date.now(),
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState({ currentTime: Date.now() });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getPowerUpStatus = (): PowerUpStatus[] => {
    const { player } = this.props;
    const { currentTime } = this.state;

    const powerUps: PowerUpStatus[] = [
      {
        type: "shield",
        name: "Shield",
        icon: "🛡️",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.shield - currentTime) / 1000)
        ),
        isActive: player.hasShield,
      },
      {
        type: "infinite_ammo",
        name: "Infinite Ammo",
        icon: "∞",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.infiniteAmmo - currentTime) / 1000)
        ),
        isActive: player.hasInfiniteAmmo,
      },
      {
        type: "speed_boost",
        name: "Speed Boost",
        icon: "⚡",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.speedBoost - currentTime) / 1000)
        ),
        isActive: player.hasSpeedBoost,
      },
      {
        type: "multi_shot",
        name: "Multi Shot",
        icon: "3",
        remainingTime: Math.max(
          0,
          Math.ceil((player.powerUpEndTimes.multiShot - currentTime) / 1000)
        ),
        isActive: player.hasMultiShot,
      },
    ];

    return powerUps.filter((powerUp) => powerUp.isActive);
  };

  getPowerUpStyle = (powerUp: PowerUpStatus) => {
    const isExpiringSoon = powerUp.remainingTime <= 3;
    return {
      borderColor: isExpiringSoon
        ? "rgb(239, 68, 68)"
        : "rgba(255, 255, 255, 0.2)",
      animation: isExpiringSoon ? "pulse 1s infinite" : "none",
    };
  };

  render() {
    const { player, difficultyLevel } = this.props;
    const activePowerUps = this.getPowerUpStatus();

    return (
      <div className="ml-4 flex flex-col gap-3">
        {/* Difficulty Level */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 text-white shadow-lg">
          <div className="text-center">
            <div className="text-xl font-bold">
              Level {difficultyLevel.level}
            </div>
            <div className="text-xs text-white/80 font-medium">
              {this.getDifficultyName(difficultyLevel.level)}
            </div>
          </div>
        </div>

        {/* Ammo Indicator */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white shadow-lg">
          <div className="text-center">
            <div className="text-xl font-bold">
              {player.hasInfiniteAmmo
                ? "∞"
                : `${player.riceRocketAmmo}/${player.maxRiceRocketAmmo}`}
            </div>
            <div className="text-xs text-white/80 font-medium">
              Rice Rockets
            </div>
          </div>
        </div>

        {/* Power-ups in column */}
        {activePowerUps.map((powerUp) => (
          <div
            key={powerUp.type}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 text-white shadow-lg"
            style={this.getPowerUpStyle(powerUp)}
          >
            <div className="text-center space-y-1">
              <div className="text-2xl">{powerUp.icon}</div>
              <div className="text-sm font-bold">{powerUp.name}</div>
              <div className="text-xs text-white/80">
                {powerUp.remainingTime}s
              </div>
              {/* Progress bar */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/60 transition-all duration-1000 rounded-full"
                  style={{
                    width: `${Math.max(
                      0,
                      (powerUp.remainingTime / 10) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  private getDifficultyName(level: number): string {
    const names = [
      "Beginner",
      "Novice",
      "Apprentice",
      "Intermediate",
      "Advanced",
      "Expert",
      "Master",
      "Legend",
      "Divine",
      "Ultimate",
    ];
    return names[Math.min(level - 1, names.length - 1)] || "Ultimate";
  }
}

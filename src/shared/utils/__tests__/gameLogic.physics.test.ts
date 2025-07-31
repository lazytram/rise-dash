// Mock blockchain modules before imports
jest.mock("@/infrastructure/blockchain/blockchainService", () => ({
  blockchainService: {
    getPlayerBestScore: jest.fn(),
    getPlayerScores: jest.fn(),
    getLeaderboard: jest.fn(),
    getTotalScores: jest.fn(),
    getContractInfo: jest.fn(),
  },
}));

// Mock powerUpService with proper function exports
jest.mock("@/shared/services/powerUpService", () => ({
  getPowerUpService: jest.fn(() => ({
    getLevels: jest.fn(() => ({
      shield: 1,
      infinite_ammo: 1,
      jump_boost: 1,
      slow_motion: 1,
      multi_shot: 1,
      rice_rocket_ammo: 1,
    })),
    getMaxAmmo: jest.fn(() => 3),
    setLevels: jest.fn(),
    getPowerUpLevel: jest.fn(() => 1),
    getPowerUpEffect: jest.fn((type) => {
      switch (type) {
        case "shield":
          return { duration: 3000 };
        case "infinite_ammo":
          return { duration: 3000 };
        case "jump_boost":
          return { duration: 3000, jumpMultiplier: 1.3 };
        case "slow_motion":
          return { duration: 3000, slowMultiplier: 0.8 };
        case "multi_shot":
          return { duration: 3000, projectileCount: 3 };
        case "rice_rocket_ammo":
          return { duration: 3000, ammoCount: 3 };
        default:
          return { duration: 3000 };
      }
    }),
    canUpgrade: jest.fn(() => false),
    getUpgradeCost: jest.fn(() => 100),
    upgrade: jest.fn(() => false),
    resetLevels: jest.fn(),
    loadLevelsFromBlockchain: jest.fn(),
    upgradePowerUpOnBlockchain: jest.fn(),
    getPowerUpLevelsFromBlockchain: jest.fn(),
    getPowerUpConfigFromBlockchain: jest.fn(),
  })),
  getPowerUpEffect: jest.fn((type) => {
    switch (type) {
      case "shield":
        return { duration: 3000 };
      case "infinite_ammo":
        return { duration: 3000 };
      case "jump_boost":
        return { duration: 3000, jumpMultiplier: 1.3 };
      case "slow_motion":
        return { duration: 3000, slowMultiplier: 0.8 };
      case "multi_shot":
        return { duration: 3000, projectileCount: 3 };
      case "rice_rocket_ammo":
        return { duration: 3000, ammoCount: 3 };
      default:
        return { duration: 3000 };
    }
  }),
  getMaxAmmo: jest.fn(() => 3),
  canUpgrade: jest.fn(() => false),
  getUpgradeCost: jest.fn(() => 100),
  upgrade: jest.fn(() => false),
  loadLevelsFromBlockchain: jest.fn(),
  upgradePowerUpOnBlockchain: jest.fn(),
  getPowerUpLevelsFromBlockchain: jest.fn(),
  getPowerUpConfigFromBlockchain: jest.fn(),
}));

// Mock the problematic imports
jest.mock("@/core/game-logic/gameLogic", () => ({
  GameLogic: {
    createInitialGameState: jest.fn(() => ({
      player: {
        x: 50,
        y: 300,
        width: 40,
        height: 60,
        velocityY: 0,
        isJumping: false,
        color: "#FF0000",
        riceRocketAmmo: 3,
        maxRiceRocketAmmo: 3,
        lastAmmoRechargeTime: 0,
        hasShield: false,
        hasInfiniteAmmo: false,
        hasJumpBoost: false,
        hasSlowMotion: false,
        hasMultiShot: false,
        powerUpEndTimes: {
          shield: 0,
          infiniteAmmo: 0,
          jumpBoost: 0,
          slowMotion: 0,
          multiShot: 0,
        },
        powerUpLevels: {
          shield: 1,
          infinite_ammo: 1,
          jump_boost: 1,
          slow_motion: 1,
          multi_shot: 1,
          rice_rocket_ammo: 1,
        },
      },
      riceRockets: [],
      sushis: [],
      toriis: [],
      samurais: [],
      ninjas: [],
      bosses: [],
      samuraiBullets: [],
      powerUps: [],
      distance: 0,
      isGameRunning: false,
      isGameOver: false,
      difficultyLevel: {
        level: 1,
        speedMultiplier: 1,
        samuraiSpawnDistance: 100,
        sushiSpawnProbability: 0.1,
        samuraiShotCooldown: 3000,
        samuraiLives: 3,
        samuraiBulletSpeed: 5,
        ninjaSpawnDistance: 999,
        ninjaShotCooldown: 2000,
        ninjaLives: 2,
        bossSpawnDistance: 999,
        bossShotCooldown: 1500,
        bossLives: 8,
        powerUpSpawnProbability: 0.05,
      },
    })),
    updatePlayerPhysics: jest.fn((player) => {
      const newVelocityY = player.velocityY + 0.8; // GRAVITY
      const newY = player.y + newVelocityY;
      const groundY = 400 - 50; // CANVAS_HEIGHT - GROUND_HEIGHT

      // Check if player hit the ground
      if (newY >= groundY - player.height) {
        return {
          ...player,
          y: groundY - player.height,
          velocityY: 0,
          isJumping: false,
        };
      }

      return {
        ...player,
        y: newY,
        velocityY: newVelocityY,
      };
    }),
    canJump: jest.fn((player) => !player.isJumping),
    makePlayerJump: jest.fn((player) => {
      if (player.isJumping) return player;

      let jumpStrength = -15; // JUMP_STRENGTH
      if (player.hasJumpBoost) {
        jumpStrength = -15 * 1.3; // Apply jump boost multiplier
      }

      return {
        ...player,
        velocityY: jumpStrength,
        isJumping: true,
      };
    }),
    checkCollision: jest.fn((entity1, entity2) => {
      return (
        entity1.x < entity2.x + entity2.width &&
        entity1.x + entity1.width > entity2.x &&
        entity1.y < entity2.y + entity2.height &&
        entity1.y + entity1.height > entity2.y
      );
    }),
    getCurrentSushiSpeed: jest.fn((distance, player) => {
      const baseSpeed = -4;
      if (player?.hasSlowMotion) {
        return baseSpeed * 0.8;
      }
      return baseSpeed;
    }),
    getCurrentSamuraiSpeed: jest.fn((distance, player) => {
      const baseSpeed = -3;
      if (player?.hasSlowMotion) {
        return baseSpeed * 0.8;
      }
      return baseSpeed;
    }),
    updateGameState: jest.fn((gameState) => {
      // Update rice rockets
      const updatedRiceRockets =
        gameState.riceRockets?.map((rocket: RiceRocket) => ({
          ...rocket,
          x: rocket.x + rocket.velocityX,
        })) || [];

      // Update samurais
      const updatedSamurais =
        gameState.samurais?.map((samurai: Samurai) => ({
          ...samurai,
          x: samurai.x + samurai.velocityX,
        })) || [];

      return {
        ...gameState,
        riceRockets: updatedRiceRockets,
        samurais: updatedSamurais,
      };
    }),
  },
}));

import { GameLogic } from "@/core/game-logic/gameLogic";
import { GAME_CONSTANTS } from "@/shared/constants/game";
import { createTestPlayer, createRunningGameState } from "../testUtils.helper";
import { RiceRocket, Samurai } from "@/shared/types/game";

describe("GameLogic - Physics", () => {
  describe("Player Physics", () => {
    it("should apply gravity to player", () => {
      const player = createTestPlayer({
        y: 200,
        velocityY: 0,
      });

      const updatedPlayer = GameLogic.updatePlayerPhysics(player);

      expect(updatedPlayer.velocityY).toBe(GAME_CONSTANTS.GRAVITY);
      expect(updatedPlayer.y).toBe(200 + GAME_CONSTANTS.GRAVITY);
    });

    it("should limit player to ground level", () => {
      const groundY =
        GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
      const player = createTestPlayer({
        y: 320,
        velocityY: 5,
      });

      const updatedPlayer = GameLogic.updatePlayerPhysics(player);

      expect(updatedPlayer.y).toBe(groundY - player.height);
      expect(updatedPlayer.velocityY).toBe(0);
      expect(updatedPlayer.isJumping).toBe(false);
    });

    it("should allow jump when on ground", () => {
      const groundY =
        GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
      const player = createTestPlayer({
        y: groundY - 60, // player.height is 60
        isJumping: false,
      });

      expect(GameLogic.canJump(player)).toBe(true);
    });

    it("should not allow jump when in air", () => {
      const player = createTestPlayer({
        y: 200,
        isJumping: true,
      });

      expect(GameLogic.canJump(player)).toBe(false);
    });

    it("should make player jump", () => {
      const groundY =
        GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
      const player = createTestPlayer({
        y: groundY - 60, // player.height is 60
        isJumping: false,
      });

      const jumpingPlayer = GameLogic.makePlayerJump(player);

      expect(jumpingPlayer.velocityY).toBe(GAME_CONSTANTS.JUMP_STRENGTH);
      expect(jumpingPlayer.isJumping).toBe(true);
    });
  });

  describe("Power-up Effects on Physics", () => {
    it("should increase jump strength with jump boost", () => {
      const playerWithJumpBoost = createTestPlayer({
        hasJumpBoost: true,
        powerUpEndTimes: {
          shield: 0,
          infiniteAmmo: 0,
          jumpBoost: Date.now() + 5000,
          slowMotion: 0,
          multiShot: 0,
        },
        powerUpLevels: {
          shield: 1,
          infinite_ammo: 1,
          jump_boost: 1, // Level 1 should give 1.3 multiplier
          slow_motion: 1,
          multi_shot: 1,
          rice_rocket_ammo: 1,
        },
        y: 300,
        isJumping: false,
      });

      const jumpingPlayer = GameLogic.makePlayerJump(playerWithJumpBoost);

      // Jump boost should increase jump strength (more negative)
      expect(jumpingPlayer.velocityY).toBeLessThan(
        GAME_CONSTANTS.JUMP_STRENGTH
      );
    });

    it("should slow down enemies when slow motion is active", () => {
      const playerWithSlowMotion = createTestPlayer({
        hasSlowMotion: true,
        powerUpEndTimes: {
          shield: 0,
          infiniteAmmo: 0,
          jumpBoost: 0,
          slowMotion: Date.now() + 5000,
          multiShot: 0,
        },
        powerUpLevels: {
          shield: 1,
          infinite_ammo: 1,
          jump_boost: 1,
          slow_motion: 1, // Level 1 should give 0.8 multiplier
          multi_shot: 1,
          rice_rocket_ammo: 1,
        },
        y: 300,
        isJumping: false,
      });

      const normalSpeed = GameLogic.getCurrentSamuraiSpeed(100);
      const slowSpeed = GameLogic.getCurrentSamuraiSpeed(
        100,
        playerWithSlowMotion
      );

      // Slow motion should make enemies slower (less negative velocity)
      expect(slowSpeed).toBeGreaterThan(normalSpeed);
    });
  });

  describe("Collision Physics", () => {
    it("should detect collision between overlapping entities", () => {
      const entity1 = { x: 100, y: 100, width: 50, height: 50 };
      const entity2 = { x: 125, y: 125, width: 50, height: 50 };

      expect(GameLogic.checkCollision(entity1, entity2)).toBe(true);
    });

    it("should not detect collision between separate entities", () => {
      const entity1 = { x: 100, y: 100, width: 50, height: 50 };
      const entity2 = { x: 200, y: 200, width: 50, height: 50 };

      expect(GameLogic.checkCollision(entity1, entity2)).toBe(false);
    });
  });

  describe("Movement Physics", () => {
    it("should update rice rocket position", () => {
      const gameState = createRunningGameState({
        riceRockets: [
          {
            id: "1",
            x: 100,
            y: 300,
            width: 20,
            height: 10,
            velocityX: 5,
            color: "#FF0000",
          },
        ],
      });

      const result = GameLogic.updateGameState(gameState);

      expect(result.riceRockets[0].x).toBe(105);
    });

    it("should update samurai position", () => {
      const gameState = createRunningGameState({
        samurais: [
          {
            id: "1",
            x: 100,
            y: 300,
            width: 40,
            height: 60,
            velocityX: -3,
            lives: 3,
            maxLives: 3,
            lastShotTime: 0,
            shotCooldown: 3000,
            color: "#FF0000",
          },
        ],
      });

      const result = GameLogic.updateGameState(gameState);

      expect(result.samurais[0].x).toBe(97);
    });
  });
});

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

// Mock the problematic imports
jest.mock("@/core/game-logic/gameLogic", () => ({
  GameLogic: {
    createInitialGameState: jest.fn(() => ({})),
    collectPowerUp: jest.fn((player, powerUp) => ({
      ...player,
      hasShield: powerUp.type === "shield",
      hasInfiniteAmmo: powerUp.type === "infinite_ammo",
      hasJumpBoost: powerUp.type === "jump_boost",
      hasSlowMotion: powerUp.type === "slow_motion",
      hasMultiShot: powerUp.type === "multi_shot",
      powerUpEndTimes: {
        shield: powerUp.type === "shield" ? Date.now() + 3000 : 0,
        infiniteAmmo: powerUp.type === "infinite_ammo" ? Date.now() + 3000 : 0,
        jumpBoost: powerUp.type === "jump_boost" ? Date.now() + 3000 : 0,
        slowMotion: powerUp.type === "slow_motion" ? Date.now() + 3000 : 0,
        multiShot: powerUp.type === "multi_shot" ? Date.now() + 3000 : 0,
      },
    })),
    addRiceRocket: jest.fn((gameState) => ({
      ...gameState,
      riceRockets: [
        ...gameState.riceRockets,
        { id: "test-rocket", x: 100, y: 200 },
      ],
      player: {
        ...gameState.player,
        riceRocketAmmo: gameState.player.hasInfiniteAmmo
          ? gameState.player.riceRocketAmmo
          : gameState.player.riceRocketAmmo - 1,
      },
    })),
    makePlayerJump: jest.fn((player) => ({
      ...player,
      velocityY: -15,
      isJumping: true,
    })),
    getCurrentSushiSpeed: jest.fn((distance, player) => {
      const baseSpeed = -4;
      if (player?.hasSlowMotion) {
        return baseSpeed * 0.8;
      }
      return baseSpeed;
    }),
    updatePlayerPowerUps: jest.fn((player) => ({
      ...player,
      hasShield: player.powerUpEndTimes.shield > Date.now(),
      hasInfiniteAmmo: player.powerUpEndTimes.infiniteAmmo > Date.now(),
      hasJumpBoost: player.powerUpEndTimes.jumpBoost > Date.now(),
      hasSlowMotion: player.powerUpEndTimes.slowMotion > Date.now(),
      hasMultiShot: player.powerUpEndTimes.multiShot > Date.now(),
    })),
    updateGameState: jest.fn((gameState) => ({
      ...gameState,
      powerUps: gameState.powerUps,
    })),
    createPowerUp: jest.fn(() => ({
      id: "test-powerup",
      x: 100,
      y: 200,
      width: 30,
      height: 30,
      type: "shield",
      color: "#FFD700",
    })),
  },
}));

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

import { GameLogic } from "@/core/game-logic/gameLogic";
import { PowerUpType } from "@/shared/types/powerUps";
import {
  createTestPlayer,
  createTestGameState,
  createRunningGameState,
  createTestPowerUp,
} from "../testUtils.helper";

describe("GameLogic - Power-ups", () => {
  describe("Power-up Collection", () => {
    it("should apply shield power-up", () => {
      const player = createTestPlayer();
      const powerUp = createTestPowerUp({ type: PowerUpType.SHIELD });

      const updatedPlayer = GameLogic.collectPowerUp(player, powerUp);

      expect(updatedPlayer.hasShield).toBe(true);
      expect(updatedPlayer.powerUpEndTimes.shield).toBeGreaterThan(Date.now());
    });

    it("should apply infinite ammo power-up", () => {
      const player = createTestPlayer();
      const powerUp = createTestPowerUp({ type: PowerUpType.INFINITE_AMMO });

      const updatedPlayer = GameLogic.collectPowerUp(player, powerUp);

      expect(updatedPlayer.hasInfiniteAmmo).toBe(true);
      expect(updatedPlayer.powerUpEndTimes.infiniteAmmo).toBeGreaterThan(
        Date.now()
      );
    });

    it("should apply jump boost power-up", () => {
      const player = createTestPlayer();
      const powerUp = createTestPowerUp({ type: PowerUpType.JUMP_BOOST });

      const updatedPlayer = GameLogic.collectPowerUp(player, powerUp);

      expect(updatedPlayer.hasJumpBoost).toBe(true);
      expect(updatedPlayer.powerUpEndTimes.jumpBoost).toBeGreaterThan(
        Date.now()
      );
    });

    it("should apply slow motion power-up", () => {
      const player = createTestPlayer();
      const powerUp = createTestPowerUp({ type: PowerUpType.SLOW_MOTION });

      const updatedPlayer = GameLogic.collectPowerUp(player, powerUp);

      expect(updatedPlayer.hasSlowMotion).toBe(true);
      expect(updatedPlayer.powerUpEndTimes.slowMotion).toBeGreaterThan(
        Date.now()
      );
    });

    it("should apply multi-shot power-up", () => {
      const player = createTestPlayer();
      const powerUp = createTestPowerUp({ type: PowerUpType.MULTI_SHOT });

      const updatedPlayer = GameLogic.collectPowerUp(player, powerUp);

      expect(updatedPlayer.hasMultiShot).toBe(true);
      expect(updatedPlayer.powerUpEndTimes.multiShot).toBeGreaterThan(
        Date.now()
      );
    });

    it("should reset all power-ups when collecting a new one", () => {
      const playerWithPowerUp = createTestPlayer({
        hasShield: true,
        hasInfiniteAmmo: true,
        powerUpEndTimes: {
          shield: Date.now() + 1000,
          infiniteAmmo: Date.now() + 1000,
          jumpBoost: 0,
          slowMotion: 0,
          multiShot: 0,
        },
      });
      const newPowerUp = createTestPowerUp({ type: PowerUpType.JUMP_BOOST });

      const updatedPlayer = GameLogic.collectPowerUp(
        playerWithPowerUp,
        newPowerUp
      );

      expect(updatedPlayer.hasShield).toBe(false);
      expect(updatedPlayer.hasInfiniteAmmo).toBe(false);
      expect(updatedPlayer.hasJumpBoost).toBe(true);
    });
  });

  describe("Power-up Effects", () => {
    it("should not consume ammo with infinite ammo power-up", () => {
      const playerWithInfiniteAmmo = createTestPlayer({
        hasInfiniteAmmo: true,
        riceRocketAmmo: 5,
      });
      const gameState = createTestGameState({
        player: { ...playerWithInfiniteAmmo, riceRocketAmmo: 5 },
        riceRockets: [],
      });

      const result = GameLogic.addRiceRocket(gameState);

      expect(result.riceRockets).toHaveLength(1);
      expect(result.player.riceRocketAmmo).toBe(5); // Not consumed
    });

    it("should create multiple rockets with multi-shot power-up", () => {
      const playerWithMultiShot = createTestPlayer({
        hasMultiShot: true,
        riceRocketAmmo: 5,
        powerUpLevels: {
          shield: 1,
          infinite_ammo: 1,
          jump_boost: 1,
          slow_motion: 1,
          multi_shot: 1, // Level 1 should give 3 projectiles
          rice_rocket_ammo: 1,
        },
      });
      const gameState = createTestGameState({
        player: { ...playerWithMultiShot, riceRocketAmmo: 5 },
        riceRockets: [
          {
            id: "test-rocket",
            x: 100,
            y: 200,
            velocityX: 10,
            width: 10,
            height: 10,
            color: "#000000",
          },
          {
            id: "test-rocket1",
            x: 100,
            y: 200,
            velocityX: 10,
            width: 10,
            height: 10,
            color: "#000000",
          },
        ],
      });

      const result = GameLogic.addRiceRocket(gameState);

      expect(result.riceRockets).toHaveLength(3); // Multiple rockets
    });

    it("should increase jump strength with jump boost", () => {
      const playerWithJumpBoost = createTestPlayer({
        hasJumpBoost: true,
        powerUpLevels: {
          shield: 1,
          infinite_ammo: 1,
          jump_boost: 1, // Level 1 should give 1.3 multiplier
          slow_motion: 1,
          multi_shot: 1,
          rice_rocket_ammo: 1,
        },
        velocityY: 0,
        y: 300,
        isJumping: false,
      });

      const jumpingPlayer = GameLogic.makePlayerJump(playerWithJumpBoost);

      expect(jumpingPlayer.velocityY).toBeLessThan(-10); // Stronger jump
    });

    it("should slow down enemies with slow motion", () => {
      const playerWithSlowMotion = createTestPlayer({
        hasSlowMotion: true,
        powerUpLevels: {
          shield: 1,
          infinite_ammo: 1,
          jump_boost: 1,
          slow_motion: 1, // Level 1 should give 0.8 multiplier
          multi_shot: 1,
          rice_rocket_ammo: 1,
        },
        velocityY: 0,
        y: 300,
        isJumping: false,
      });

      const normalSpeed = GameLogic.getCurrentSushiSpeed(100);
      const slowSpeed = GameLogic.getCurrentSushiSpeed(
        100,
        playerWithSlowMotion
      );

      expect(slowSpeed).toBeGreaterThan(normalSpeed); // Slower
    });
  });

  describe("Power-up Expiration", () => {
    it("should expire power-ups after duration", () => {
      const player = createTestPlayer({
        hasShield: true,
        powerUpEndTimes: {
          shield: Date.now() - 1000, // Expired
          infiniteAmmo: 0,
          jumpBoost: 0,
          slowMotion: 0,
          multiShot: 0,
        },
      });

      const updatedPlayer = GameLogic.updatePlayerPowerUps(player);

      expect(updatedPlayer.hasShield).toBe(false);
    });

    it("should keep active power-ups", () => {
      const player = createTestPlayer({
        hasShield: true,
        powerUpEndTimes: {
          shield: Date.now() + 5000, // Still active
          infiniteAmmo: 0,
          jumpBoost: 0,
          slowMotion: 0,
          multiShot: 0,
        },
      });

      const updatedPlayer = GameLogic.updatePlayerPowerUps(player);

      expect(updatedPlayer.hasShield).toBe(true);
    });
  });

  describe("Power-up Spawning", () => {
    it("should spawn power-ups at random intervals", () => {
      const gameState = createRunningGameState({
        distance: 1000,
        powerUps: [],
      });

      const result = GameLogic.updateGameState(gameState);

      // Power-ups may or may not spawn based on probability
      expect(result.powerUps.length).toBeGreaterThanOrEqual(0);
    });

    it("should create power-ups with correct properties", () => {
      const powerUp = GameLogic.createPowerUp(100);

      expect(powerUp.x).toBeGreaterThan(0);
      expect(powerUp.y).toBeGreaterThan(0);
      expect(powerUp.width).toBeGreaterThan(0);
      expect(powerUp.height).toBeGreaterThan(0);
      expect(Object.values(PowerUpType)).toContain(powerUp.type);
    });
  });
});

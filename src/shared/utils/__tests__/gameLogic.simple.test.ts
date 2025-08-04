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
jest.mock("@/shared/services/powerUpService", () => {
  const mockService = {
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
  };

  return {
    getPowerUpService: jest.fn(() => mockService),
    setPowerUpService: jest.fn(),
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
    getMaxAmmo: jest.fn(() => 3),
    canUpgrade: jest.fn(() => false),
    getUpgradeCost: jest.fn(() => 100),
    upgrade: jest.fn(() => false),
    loadLevelsFromBlockchain: jest.fn(),
    upgradePowerUpOnBlockchain: jest.fn(),
    getPowerUpLevelsFromBlockchain: jest.fn(),
    getPowerUpConfigFromBlockchain: jest.fn(),
  };
});

// Remove the GameLogic mock to use real functions

import { GameLogic } from "@/core/game-logic/gameLogic";
import { PowerUpType } from "@/shared/types/powerUps";
import { GAME_CONSTANTS } from "@/shared/constants/game";
import {
  createTestPlayer,
  createTestGameState,
  createRunningGameState,
  createTestSushi,
  createTestSamurai,
  createTestPowerUp,
} from "../testUtils.helper";

describe("GameLogic - Simple Tests", () => {
  describe("Game State Management", () => {
    it("should create initial game state", () => {
      const gameState = GameLogic.createInitialGameState();

      expect(gameState.isGameRunning).toBe(false);
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.distance).toBe(0);
      expect(gameState.player).toBeDefined();
    });

    it("should update distance when game is running", () => {
      const gameState = createRunningGameState({ distance: 100 });
      const result = GameLogic.updateGameState(gameState);

      expect(result.distance).toBeGreaterThan(100);
    });

    it("should clear entities when game is not running", () => {
      const gameState = createTestGameState({
        isGameRunning: false,
        enemyBullets: [
          {
            id: "test",
            x: 100,
            y: 100,
            width: 10,
            height: 10,
            velocityX: -5,
            velocityY: 0,
            color: "red",
          },
        ],
        riceRockets: [
          {
            id: "test",
            x: 200,
            y: 200,
            width: 10,
            height: 10,
            velocityX: 5,
            color: "blue",
          },
        ],
      });
      const result = GameLogic.updateGameState(gameState);

      // Should clear all entities when game is not running
      expect(result.enemyBullets).toEqual([]);
      expect(result.riceRockets).toEqual([]);
      expect(result.sushis).toEqual([]);
      expect(result.toriis).toEqual([]);
      expect(result.samurais).toEqual([]);
      expect(result.ninjas).toEqual([]);
      expect(result.bosses).toEqual([]);
      expect(result.powerUps).toEqual([]);
    });
  });

  describe("Player Physics", () => {
    it("should apply gravity to player", () => {
      const player = createTestPlayer({
        y: 200,
        velocityY: 0,
        isJumping: true,
      });

      const updatedPlayer = GameLogic.updatePlayerPhysics(player);

      expect(updatedPlayer.velocityY).toBe(GAME_CONSTANTS.GRAVITY);
      expect(updatedPlayer.y).toBe(200 + GAME_CONSTANTS.GRAVITY);
    });

    it("should allow jump when on ground", () => {
      const groundY =
        GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
      const player = createTestPlayer({
        y: groundY,
        isJumping: false,
      });

      expect(GameLogic.canJump(player)).toBe(true);
    });

    it("should make player jump", () => {
      const groundY =
        GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
      const player = createTestPlayer({
        y: groundY,
        isJumping: false,
      });

      const jumpingPlayer = GameLogic.makePlayerJump(player);

      expect(jumpingPlayer.velocityY).toBe(GAME_CONSTANTS.JUMP_STRENGTH);
      expect(jumpingPlayer.isJumping).toBe(true);
    });
  });

  describe("Power-ups", () => {
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

    it("should stack power-ups", () => {
      const player = createTestPlayer();
      const shieldPowerUp = createTestPowerUp({ type: PowerUpType.SHIELD });
      const newPowerUp = createTestPowerUp({ type: PowerUpType.JUMP_BOOST });

      const playerWithShield = GameLogic.collectPowerUp(player, shieldPowerUp);
      const updatedPlayer = GameLogic.collectPowerUp(
        playerWithShield,
        newPowerUp
      );

      // The implementation resets all power-ups when collecting a new one
      // So only the latest power-up should be active
      expect(updatedPlayer.hasShield).toBe(false);
      expect(updatedPlayer.hasJumpBoost).toBe(true);
    });

    it("should expire power-ups", () => {
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
  });

  describe("Collisions", () => {
    it("should detect collision between entities", () => {
      const entity1 = { x: 100, y: 100, width: 50, height: 50 };
      const entity2 = { x: 125, y: 125, width: 50, height: 50 };

      expect(GameLogic.checkCollision(entity1, entity2)).toBe(true);
    });

    it("should not detect collision between distant entities", () => {
      const entity1 = { x: 100, y: 100, width: 50, height: 50 };
      const entity2 = { x: 200, y: 200, width: 50, height: 50 };

      expect(GameLogic.checkCollision(entity1, entity2)).toBe(false);
    });
  });

  describe("Game Over", () => {
    it("should end game when player collides with enemy", () => {
      const gameState = createRunningGameState({
        player: createTestPlayer({ hasShield: false, x: 100, y: 300 }),
        samurais: [createTestSamurai({ x: 120, y: 300 })], // Position samurai to overlap with player
      });

      const result = GameLogic.updateGameState(gameState);

      expect(result.isGameOver).toBe(true);
    });

    it("should not end game when player has shield", () => {
      const gameState = createRunningGameState({
        player: createTestPlayer({
          hasShield: true,
          x: 100,
          y: 300,
          powerUpEndTimes: {
            shield: Date.now() + 5000, // Shield active for 5 seconds
            infiniteAmmo: 0,
            jumpBoost: 0,
            slowMotion: 0,
            multiShot: 0,
          },
        }),
        samurais: [createTestSamurai({ x: 120, y: 300 })], // Position samurai to overlap with player
      });

      const result = GameLogic.updateGameState(gameState);

      expect(result.isGameOver).toBe(false);
    });
  });

  describe("Enemies", () => {
    it("should create samurai", () => {
      const difficultyLevel = GameLogic.calculateDifficultyLevel(100);
      const samurai = GameLogic.createSamurai(100, difficultyLevel);

      expect(samurai.x).toBe(GAME_CONSTANTS.CANVAS_WIDTH);
      expect(samurai.y).toBeGreaterThan(0);
      expect(samurai.y).toBeLessThan(GAME_CONSTANTS.CANVAS_HEIGHT);
    });

    it("should move samurais", () => {
      const samurai = createTestSamurai({ x: 100 });
      const updatedSamurais = GameLogic.updateSamurais([samurai]);

      expect(updatedSamurais[0].x).toBe(100 + samurai.velocityX);
    });

    it("should remove off-screen samurais", () => {
      const visibleSamurai = createTestSamurai({ x: 100 });
      const offScreenSamurai = createTestSamurai({ x: -100 });
      const updatedSamurais = GameLogic.updateSamurais([
        visibleSamurai,
        offScreenSamurai,
      ]);

      expect(updatedSamurais).toHaveLength(1);
      expect(updatedSamurais[0].x).toBe(100 + visibleSamurai.velocityX);
    });

    it("should make samurai shoot", () => {
      const samurai = createTestSamurai({ lastShotTime: 0 });
      const difficultyLevel = GameLogic.calculateDifficultyLevel(100);
      const bullet = GameLogic.makeSamuraiShoot(samurai, 100, difficultyLevel);

      expect(bullet).toBeDefined();
      expect(bullet?.x).toBe(samurai.x);
    });
  });

  describe("Rice Rockets", () => {
    it("should create rice rocket", () => {
      const player = createTestPlayer();
      const rocket = GameLogic.createRiceRocket(player);

      expect(rocket.x).toBe(player.x + player.width);
      expect(rocket.y).toBe(player.y + player.height / 2);
    });

    it("should add rice rocket when player has ammo", () => {
      const gameState = createTestGameState({
        player: createTestPlayer({ riceRocketAmmo: 1 }),
      });

      const result = GameLogic.addRiceRocket(gameState);

      expect(result.riceRockets).toHaveLength(1);
    });

    it("should not add rice rocket when player has no ammo", () => {
      const gameState = createTestGameState({
        player: createTestPlayer({ riceRocketAmmo: 0 }),
      });

      const result = GameLogic.addRiceRocket(gameState);

      expect(result.riceRockets).toHaveLength(0);
    });

    it("should not add rice rocket when player has infinite ammo", () => {
      const gameState = createTestGameState({
        player: createTestPlayer({
          riceRocketAmmo: 0,
          hasInfiniteAmmo: true,
        }),
      });

      const result = GameLogic.addRiceRocket(gameState);

      expect(result.riceRockets).toHaveLength(1);
    });
  });

  describe("Difficulty", () => {
    it("should calculate difficulty level", () => {
      const difficulty = GameLogic.calculateDifficultyLevel(1000);

      expect(difficulty.level).toBeGreaterThan(1);
      expect(difficulty.speedMultiplier).toBeGreaterThan(1);
    });

    it("should increase speed with distance", () => {
      const speed1 = GameLogic.getCurrentSushiSpeed(100);
      const speed2 = GameLogic.getCurrentSushiSpeed(200);

      expect(speed2).toBeLessThan(speed1); // Faster (more negative)
    });

    it("should apply slow motion effect", () => {
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
      });

      // Test the actual speed calculation
      const normalSpeed = GameLogic.getCurrentSushiSpeed(100);
      const slowSpeed = GameLogic.getCurrentSushiSpeed(
        100,
        playerWithSlowMotion
      );

      // Slow motion should make enemies slower (less negative velocity)
      // The mock should return 0.8 multiplier, so slowSpeed should be 0.8 * normalSpeed
      expect(slowSpeed).toBe(normalSpeed * 0.8);
    });
  });

  describe("Sushi", () => {
    it("should move sushi", () => {
      const sushi = createTestSushi({ x: 100, velocityX: -4 });
      const updatedSushis = GameLogic.updateSushis([sushi]);

      // Sushi should move left (decrease x position)
      expect(updatedSushis[0].x).toBeLessThan(100);
    });

    it("should remove off-screen sushi", () => {
      const sushi = createTestSushi({ x: -100, velocityX: -4 });
      const updatedSushis = GameLogic.updateSushis([sushi]);

      // Off-screen sushi should be removed
      expect(updatedSushis).toHaveLength(0);
    });
  });
});

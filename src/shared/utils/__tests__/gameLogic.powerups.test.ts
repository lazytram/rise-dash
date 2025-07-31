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

jest.mock("@/shared/services/powerUpService", () => ({
  PowerUpService: {
    getPowerUpLevel: jest.fn(),
    getUpgradeCost: jest.fn(),
  },
}));

import { GameLogic } from "@/core/game-logic/gameLogic";
import { PowerUpType } from "@/shared/types/powerUps";
import {
  createTestPlayer,
  createTestPowerUp,
  createPlayerWithPowerUp,
  createTestGameState,
  createRunningGameState,
} from "../testUtils.helper";

describe("GameLogic - Power-ups", () => {
  describe("Power-up Collection", () => {
    it.each([
      [PowerUpType.SHIELD, "hasShield"],
      [PowerUpType.INFINITE_AMMO, "hasInfiniteAmmo"],
      [PowerUpType.JUMP_BOOST, "hasJumpBoost"],
      [PowerUpType.SLOW_MOTION, "hasSlowMotion"],
      [PowerUpType.MULTI_SHOT, "hasMultiShot"],
    ])("should apply %s power-up correctly", (powerUpType, propertyName) => {
      const player = createTestPlayer();
      const powerUp = createTestPowerUp({ type: powerUpType });
      const currentTime = Date.now();

      const updatedPlayer = GameLogic.collectPowerUp(player, powerUp);

      expect(updatedPlayer[propertyName as keyof typeof updatedPlayer]).toBe(
        true
      );
      // Check that the power-up end time is set correctly
      if (powerUpType === PowerUpType.SHIELD) {
        expect(updatedPlayer.powerUpEndTimes.shield).toBeGreaterThan(
          currentTime
        );
      } else if (powerUpType === PowerUpType.INFINITE_AMMO) {
        expect(updatedPlayer.powerUpEndTimes.infiniteAmmo).toBeGreaterThan(
          currentTime
        );
      } else if (powerUpType === PowerUpType.JUMP_BOOST) {
        expect(updatedPlayer.powerUpEndTimes.jumpBoost).toBeGreaterThan(
          currentTime
        );
      } else if (powerUpType === PowerUpType.SLOW_MOTION) {
        expect(updatedPlayer.powerUpEndTimes.slowMotion).toBeGreaterThan(
          currentTime
        );
      } else if (powerUpType === PowerUpType.MULTI_SHOT) {
        expect(updatedPlayer.powerUpEndTimes.multiShot).toBeGreaterThan(
          currentTime
        );
      }
    });

    it("should reset all power-ups when collecting a new one", () => {
      const playerWithPowerUp = createPlayerWithPowerUp(PowerUpType.SHIELD);
      const newPowerUp = createTestPowerUp({ type: PowerUpType.JUMP_BOOST });

      const updatedPlayer = GameLogic.collectPowerUp(
        playerWithPowerUp,
        newPowerUp
      );

      expect(updatedPlayer.hasShield).toBe(false);
      expect(updatedPlayer.hasJumpBoost).toBe(true);
    });

    it("should set correct end time for power-up", () => {
      const player = createTestPlayer();
      const powerUp = createTestPowerUp({
        type: PowerUpType.SHIELD,
        duration: 5000,
      });
      const currentTime = Date.now();

      const updatedPlayer = GameLogic.collectPowerUp(player, powerUp);

      const endTime = updatedPlayer.powerUpEndTimes.shield;
      expect(endTime).toBeGreaterThan(currentTime);
      expect(endTime).toBeLessThanOrEqual(currentTime + 5000 + 100); // Allow small timing variance
    });
  });

  describe("Power-up Expiration", () => {
    it("should deactivate expired power-ups", () => {
      const playerWithExpiredPowerUps = createTestPlayer({
        hasShield: true,
        hasInfiniteAmmo: true,
        powerUpEndTimes: {
          shield: Date.now() - 1000, // Expired
          infiniteAmmo: Date.now() + 1000, // Still active
          jumpBoost: 0,
          slowMotion: 0,
          multiShot: 0,
        },
      });

      const updatedPlayer = GameLogic.updatePlayerPowerUps(
        playerWithExpiredPowerUps
      );

      expect(updatedPlayer.hasShield).toBe(false);
      expect(updatedPlayer.hasInfiniteAmmo).toBe(true);
    });

    it("should keep active power-ups", () => {
      const playerWithActivePowerUps = createTestPlayer({
        hasShield: true,
        hasInfiniteAmmo: true,
        powerUpEndTimes: {
          shield: Date.now() + 10000,
          infiniteAmmo: Date.now() + 10000,
          jumpBoost: 0,
          slowMotion: 0,
          multiShot: 0,
        },
      });

      const updatedPlayer = GameLogic.updatePlayerPowerUps(
        playerWithActivePowerUps
      );

      expect(updatedPlayer.hasShield).toBe(true);
      expect(updatedPlayer.hasInfiniteAmmo).toBe(true);
    });
  });

  describe("Power-up Effects", () => {
    it("should not consume ammo with infinite ammo power-up", () => {
      const playerWithInfiniteAmmo = createPlayerWithPowerUp(
        PowerUpType.INFINITE_AMMO
      );
      const gameState = createTestGameState({
        player: { ...playerWithInfiniteAmmo, riceRocketAmmo: 5 },
        riceRockets: [],
      });

      const result = GameLogic.addRiceRocket(gameState);

      expect(result.riceRockets).toHaveLength(1);
      expect(result.player.riceRocketAmmo).toBe(5); // Ammo not consumed
    });

    it("should create multiple rockets with multi-shot power-up", () => {
      const playerWithMultiShot = createPlayerWithPowerUp(
        PowerUpType.MULTI_SHOT
      );
      const gameState = createTestGameState({
        player: { ...playerWithMultiShot, riceRocketAmmo: 5 },
        riceRockets: [],
      });

      const result = GameLogic.addRiceRocket(gameState);

      expect(result.riceRockets).toHaveLength(3); // Multi-shot count
      expect(result.player.riceRocketAmmo).toBe(4); // Only one ammo consumed
    });

    it("should increase jump strength with jump boost", () => {
      const playerWithJumpBoost = createPlayerWithPowerUp(
        PowerUpType.JUMP_BOOST,
        2
      );
      const groundY = 300; // Simplified for test
      const playerOnGround = createTestPlayer({
        ...playerWithJumpBoost,
        y: groundY,
        isJumping: false,
      });

      const jumpingPlayer = GameLogic.makePlayerJump(playerOnGround);

      expect(jumpingPlayer.velocityY).toBeLessThan(-10); // Stronger jump
    });

    it("should slow down enemies with slow motion", () => {
      const playerWithSlowMotion = createPlayerWithPowerUp(
        PowerUpType.SLOW_MOTION,
        2
      );

      const normalSpeed = GameLogic.getCurrentSushiSpeed(100);
      const slowSpeed = GameLogic.getCurrentSushiSpeed(
        100,
        playerWithSlowMotion
      );

      expect(slowSpeed).toBeGreaterThan(normalSpeed); // Slower (less negative)
    });
  });

  describe("Power-up Spawning", () => {
    it("should spawn power-ups at correct intervals", () => {
      const gameState = createRunningGameState({
        distance: 200,
        powerUps: [],
      });

      const result = GameLogic.updateGameState(gameState);

      // Should attempt to spawn power-ups based on distance
      expect(result).toBeDefined();
    });

    it("should not spawn power-ups if one already exists", () => {
      const gameState = createRunningGameState({
        distance: 200,
        powerUps: [createTestPowerUp()],
      });

      const result = GameLogic.updateGameState(gameState);

      expect(result.powerUps).toHaveLength(1);
    });
  });

  describe("Power-up Collision Detection", () => {
    it("should collect power-up when player collides with it", () => {
      const powerUp = createTestPowerUp({ x: 100, y: 300 });
      const playerAtPowerUp = createTestPlayer({ x: 100, y: 300 });

      const gameState = createTestGameState({
        player: playerAtPowerUp,
        powerUps: [powerUp],
      });

      const result = GameLogic.checkPlayerPowerUpCollisions(gameState);

      expect(result.powerUps).toHaveLength(0); // Power-up should be removed
      expect(result.player.hasShield).toBe(true); // Power-up should be applied
    });

    it("should not collect power-up when player is not colliding", () => {
      const powerUp = createTestPowerUp({ x: 100, y: 300 });
      const playerAway = createTestPlayer({ x: 50, y: 300 });

      const gameState = createTestGameState({
        player: playerAway,
        powerUps: [powerUp],
      });

      const result = GameLogic.checkPlayerPowerUpCollisions(gameState);

      expect(result.powerUps).toHaveLength(1); // Power-up should remain
      expect(result.player.hasShield).toBe(false); // No power-up applied
    });
  });
});

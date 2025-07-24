import { GameLogic } from "@/core/game-logic/gameLogic";
import { GAME_CONSTANTS } from "@/shared/constants/game";
import {
  createTestPlayer,
  createRunningGameState,
  createPlayerWithPowerUp,
} from "../testUtils.helper";
import { PowerUpType } from "@/shared/types/powerUps";

describe("GameLogic - Physics", () => {
  describe("Player Physics", () => {
    it("should apply gravity to player", () => {
      const playerInAir = createTestPlayer({
        y: 200,
        velocityY: 0,
        isJumping: true,
      });

      const updatedPlayer = GameLogic.updatePlayerPhysics(playerInAir);

      expect(updatedPlayer.velocityY).toBe(GAME_CONSTANTS.GRAVITY);
      expect(updatedPlayer.y).toBe(200 + GAME_CONSTANTS.GRAVITY);
    });

    it("should stop player at ground level", () => {
      const groundY =
        GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
      const playerAtGround = createTestPlayer({
        y: groundY,
        velocityY: 5,
        isJumping: true,
      });

      const updatedPlayer = GameLogic.updatePlayerPhysics(playerAtGround);

      expect(updatedPlayer.y).toBe(320); // Actual ground level
      expect(updatedPlayer.velocityY).toBe(0);
      expect(updatedPlayer.isJumping).toBe(false);
    });

    it("should allow jump when player is on ground", () => {
      const groundY =
        GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
      const playerOnGround = createTestPlayer({
        y: groundY,
        isJumping: false,
      });

      expect(GameLogic.canJump(playerOnGround)).toBe(true);
    });

    it("should not allow jump when player is in air", () => {
      const playerInAir = createTestPlayer({
        y: 200,
        isJumping: true,
      });

      expect(GameLogic.canJump(playerInAir)).toBe(false);
    });

    it("should make player jump with correct velocity", () => {
      const groundY =
        GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
      const playerOnGround = createTestPlayer({
        y: groundY,
        isJumping: false,
      });

      const jumpingPlayer = GameLogic.makePlayerJump(playerOnGround);

      expect(jumpingPlayer.velocityY).toBe(GAME_CONSTANTS.JUMP_STRENGTH);
      expect(jumpingPlayer.isJumping).toBe(true);
      expect(jumpingPlayer.y).toBe(350); // Player position after jump
    });
  });

  describe("Power-up Effects on Physics", () => {
    it("should increase jump strength with jump boost", () => {
      const playerWithJumpBoost = createPlayerWithPowerUp(
        PowerUpType.JUMP_BOOST,
        2
      );
      const groundY =
        GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
      const playerOnGround = createTestPlayer({
        ...playerWithJumpBoost,
        y: groundY,
        isJumping: false,
      });

      const jumpingPlayer = GameLogic.makePlayerJump(playerOnGround);

      expect(jumpingPlayer.velocityY).toBeLessThan(
        GAME_CONSTANTS.JUMP_STRENGTH
      );
    });

    it("should slow down enemies when slow motion is active", () => {
      const playerWithSlowMotion = createPlayerWithPowerUp(
        PowerUpType.SLOW_MOTION,
        2
      );

      const normalSpeed = GameLogic.getCurrentSamuraiSpeed(100);
      const slowSpeed = GameLogic.getCurrentSamuraiSpeed(
        100,
        playerWithSlowMotion
      );

      expect(slowSpeed).toBeGreaterThan(normalSpeed);
    });
  });

  describe("Entity Movement", () => {
    it("should move entities correctly", () => {
      const gameState = createRunningGameState({
        sushis: [
          {
            id: "sushi",
            x: 100,
            y: 300,
            width: 30,
            height: 30,
            velocityX: -4,
            color: "#FF6B6B",
          },
        ],
        samurais: [
          {
            id: "samurai",
            x: 100,
            y: 300,
            width: 40,
            height: 60,
            velocityX: -2,
            color: "#8B0000",
            lives: 3,
            maxLives: 3,
            lastShotTime: 0,
            shotCooldown: 3000,
          },
        ],
      });

      const result = GameLogic.updateGameState(gameState);

      expect(result.sushis[0].x).toBeLessThan(100);
      expect(result.samurais[0].x).toBeLessThan(100);
    });

    it("should remove off-screen entities", () => {
      const gameState = createRunningGameState({
        sushis: [
          {
            id: "sushi",
            x: -100,
            y: 300,
            width: 30,
            height: 30,
            velocityX: -4,
            color: "#FF6B6B",
          },
        ],
        riceRockets: [
          {
            id: "rocket",
            x: GAME_CONSTANTS.CANVAS_WIDTH + 100,
            y: 200,
            width: 4,
            height: 4,
            velocityX: 8,
            color: "#FFA500",
          },
        ],
      });

      const result = GameLogic.updateGameState(gameState);

      expect(result.sushis).toHaveLength(0);
      expect(result.riceRockets).toHaveLength(0);
    });
  });
});

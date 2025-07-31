import { GAME_CONSTANTS } from "@/shared/constants/game";
import { RICE_ROCKET_COLORS } from "@/shared/constants/colors";

// Mock the problematic imports
jest.mock("@/core/game-logic/gameLogic", () => ({
  GameLogic: {
    createInitialGameState: jest.fn(() => ({})),
  },
}));

jest.mock("@/core/entities/player", () => ({
  player: {
    x: 100,
    y: 300,
    width: 30,
    height: 30,
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
}));

// Import after mocks
import { createTestRiceRocket } from "../testUtils.helper";

describe("testUtils.helper", () => {
  describe("createTestRiceRocket", () => {
    it("should create a rice rocket with correct default properties", () => {
      const rocket = createTestRiceRocket();

      expect(rocket.id).toBe("test-rocket");
      expect(rocket.x).toBe(100);
      expect(rocket.y).toBe(200);
      expect(rocket.width).toBe(GAME_CONSTANTS.RICE_ROCKET_SIZE);
      expect(rocket.height).toBe(GAME_CONSTANTS.RICE_ROCKET_SIZE);
      expect(rocket.velocityX).toBe(GAME_CONSTANTS.RICE_ROCKET_SPEED);
      expect(rocket.color).toBe(RICE_ROCKET_COLORS.BODY);
    });

    it("should allow overriding properties", () => {
      const rocket = createTestRiceRocket({
        x: 150,
        y: 250,
        velocityX: 10,
      });

      expect(rocket.x).toBe(150);
      expect(rocket.y).toBe(250);
      expect(rocket.velocityX).toBe(10);
      expect(rocket.width).toBe(GAME_CONSTANTS.RICE_ROCKET_SIZE);
      expect(rocket.height).toBe(GAME_CONSTANTS.RICE_ROCKET_SIZE);
      expect(rocket.color).toBe(RICE_ROCKET_COLORS.BODY);
    });

    it("should match the structure of RiceRocket type", () => {
      const rocket = createTestRiceRocket();

      // Check that it has all required MovableEntity properties
      expect(rocket).toHaveProperty("id");
      expect(rocket).toHaveProperty("x");
      expect(rocket).toHaveProperty("y");
      expect(rocket).toHaveProperty("width");
      expect(rocket).toHaveProperty("height");
      expect(rocket).toHaveProperty("velocityX");
      expect(rocket).toHaveProperty("color");
    });
  });
});

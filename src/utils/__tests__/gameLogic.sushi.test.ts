import { GameLogic } from "../gameLogic";
import { GameState, Player, Sushi } from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import { player } from "@/entities/player";

const createTestSushi = (overrides: Partial<Sushi> = {}): Sushi => ({
  id: "test-sushi",
  x: 150,
  y: 300,
  width: 30,
  height: 30,
  velocityX: GAME_CONSTANTS.BASE_SUSHI_SPEED,
  color: "#FF6B6B",
  ...overrides,
});

describe("GameLogic - Sushi functionality", () => {
  let initialGameState: GameState;
  let testPlayer: Player;

  const createGameStateWithSushi = (
    sushiOverrides: Partial<Sushi> = {},
    gameStateOverrides: Partial<GameState> = {}
  ): GameState => ({
    ...initialGameState,
    sushis: [createTestSushi(sushiOverrides)],
    ...gameStateOverrides,
  });

  beforeEach(() => {
    initialGameState = GameLogic.createInitialGameState();
    testPlayer = { ...player };
  });

  describe("createSushi", () => {
    it("should create a sushi with correct properties", () => {
      const testDistance = 100;
      const sushi = GameLogic.createSushi(testDistance);

      expect(sushi).toMatchObject({
        x: GAME_CONSTANTS.CANVAS_WIDTH,
        width: 30,
        height: 30,
        color: "#FF6B6B",
      });

      const expectedGroundY =
        GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT - 30;
      expect(sushi.y).toBe(expectedGroundY);
    });

    it("should calculate speed based on distance", () => {
      const testDistance = 100;
      const sushi = GameLogic.createSushi(testDistance);

      // Test that the speed is negative (moving left)
      expect(sushi.velocityX).toBeLessThan(0);

      // Test that the speed is reasonable (not too fast, not too slow)
      expect(sushi.velocityX).toBeGreaterThan(-10); // Not too fast
      expect(sushi.velocityX).toBeLessThan(-1); // Not too slow

      // Test that speed increases with distance
      const sushiAt200 = GameLogic.createSushi(200);
      expect(sushiAt200.velocityX).toBeLessThan(sushi.velocityX); // Faster at higher distance
    });
  });

  describe("updateSushis", () => {
    it("should move sushis and filter off-screen ones", () => {
      const visibleSushi = createTestSushi({ x: 100 });
      const offScreenSushi = createTestSushi({ x: -100 });

      const updatedSushis = GameLogic.updateSushis([
        visibleSushi,
        offScreenSushi,
      ]);

      expect(updatedSushis).toHaveLength(1);
      expect(updatedSushis[0].x).toBe(100 + visibleSushi.velocityX);
    });
  });

  describe("shouldSpawnSushi", () => {
    it("should not spawn sushi before minimum distance", () => {
      const gameState = { ...initialGameState, distance: 50 };
      expect(GameLogic.shouldSpawnSushi(gameState)).toBe(false);
    });

    it("should handle distance 0 correctly", () => {
      const gameState = { ...initialGameState, distance: 0 };
      expect(GameLogic.shouldSpawnSushi(gameState)).toBe(false);
    });
  });

  describe("checkCollisionWithSushi", () => {
    it("should detect collision correctly", () => {
      const testSushi = createTestSushi();

      // Collision case
      const overlappingPlayer = { ...testPlayer, x: 150, y: 300 };
      expect(
        GameLogic.checkCollisionWithSushi(overlappingPlayer, testSushi)
      ).toBe(true);

      // No collision case
      const separatePlayer = { ...testPlayer, x: 50, y: 300 };
      expect(GameLogic.checkCollisionWithSushi(separatePlayer, testSushi)).toBe(
        false
      );
    });
  });

  describe("updateGameState", () => {
    it("should handle collisions correctly", () => {
      // Test collision
      const collisionGameState = createGameStateWithSushi(
        { x: 100 },
        {
          isGameRunning: true,
          player: { ...testPlayer, x: 100, y: 300 },
        }
      );
      const collisionResult = GameLogic.updateGameState(collisionGameState);
      expect(collisionResult.isGameOver).toBe(true);
    });

    it("should not update when game is not running", () => {
      const gameState = { ...initialGameState, isGameRunning: false };
      const result = GameLogic.updateGameState(gameState);
      expect(result).toBe(gameState);
    });
  });
});

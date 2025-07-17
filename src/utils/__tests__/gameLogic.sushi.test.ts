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

      // Calculate expected base speed
      const expectedBaseSpeed =
        GAME_CONSTANTS.BASE_SUSHI_SPEED *
        Math.pow(
          1 + GAME_CONSTANTS.SPEED_INCREASE_PERCENTAGE,
          Math.floor(testDistance / GAME_CONSTANTS.SPEED_INCREASE_INTERVAL)
        );

      expect(sushi).toMatchObject({
        x: GAME_CONSTANTS.CANVAS_WIDTH,
        width: player.width,
        height: player.height,
        color: "#FF6B6B",
      });

      // Check that velocity is within the expected range (±20% variation)
      // Since speed is negative, the min/max are inverted
      const minExpectedSpeed = expectedBaseSpeed * 1.2; // More negative = faster
      const maxExpectedSpeed = expectedBaseSpeed * 0.8; // Less negative = slower
      expect(sushi.velocityX).toBeGreaterThanOrEqual(minExpectedSpeed);
      expect(sushi.velocityX).toBeLessThanOrEqual(maxExpectedSpeed);

      const expectedGroundY =
        GAME_CONSTANTS.CANVAS_HEIGHT -
        GAME_CONSTANTS.GROUND_HEIGHT -
        player.height;
      expect(sushi.y).toBe(expectedGroundY);
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
      expect(updatedSushis[0].x).toBe(100 + GAME_CONSTANTS.BASE_SUSHI_SPEED);
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

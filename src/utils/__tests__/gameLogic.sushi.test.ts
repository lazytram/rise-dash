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
  velocityX: GAME_CONSTANTS.SUSHI_SPEED,
  color: "#ff9500",
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
      const sushi = GameLogic.createSushi();

      expect(sushi).toMatchObject({
        x: GAME_CONSTANTS.CANVAS_WIDTH,
        width: player.width,
        height: player.height,
        velocityX: GAME_CONSTANTS.SUSHI_SPEED,
        color: "#ff9500",
      });

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
      expect(updatedSushis[0].x).toBe(100 + GAME_CONSTANTS.SUSHI_SPEED);
    });
  });

  describe("shouldSpawnSushi", () => {
    it.each([
      [0, false],
      [150, true],
    ])("should handle distance %d correctly", (distance, expected) => {
      const gameState = { ...initialGameState, distance };
      expect(GameLogic.shouldSpawnSushi(gameState)).toBe(expected);
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
    it("should spawn sushi and handle collisions", () => {
      // Test spawning
      const spawnGameState = {
        ...initialGameState,
        isGameRunning: true,
        distance: 150,
      };
      const spawnResult = GameLogic.updateGameState(spawnGameState);
      expect(spawnResult.sushis).toHaveLength(1);

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

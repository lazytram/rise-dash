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

      // Should be positioned on the ground
      const expectedGroundY =
        GAME_CONSTANTS.CANVAS_HEIGHT -
        GAME_CONSTANTS.GROUND_HEIGHT -
        player.height;
      expect(sushi.y).toBe(expectedGroundY);

      // Should have a unique ID
      expect(sushi.id).toBeDefined();
      expect(typeof sushi.id).toBe("string");
    });

    it("should create sushis with unique IDs", () => {
      const sushi1 = GameLogic.createSushi();
      const sushi2 = GameLogic.createSushi();

      expect(sushi1.id).not.toBe(sushi2.id);
    });
  });

  describe("updateSushis", () => {
    it("should move sushis to the left", () => {
      const sushi = GameLogic.createSushi();
      const initialX = sushi.x;

      const updatedSushis = GameLogic.updateSushis([sushi]);

      expect(updatedSushis[0].x).toBe(initialX + GAME_CONSTANTS.SUSHI_SPEED);
    });

    it.each([
      ["off-screen to the left", -100, 0],
      ["still visible", 100, 1],
    ])("should handle sushis that are %s", (_, x, expectedLength) => {
      const sushi = createTestSushi({ x });
      const updatedSushis = GameLogic.updateSushis([sushi]);

      expect(updatedSushis).toHaveLength(expectedLength);
    });
  });

  describe("shouldSpawnSushi", () => {
    it.each([
      ["at the beginning", 0, false],
      ["after some distance", 150, true],
    ])("should %s spawn sushi %s", (_, distance, expected) => {
      const gameState = { ...initialGameState, distance };
      const shouldSpawn = GameLogic.shouldSpawnSushi(gameState);

      expect(shouldSpawn).toBe(expected);
    });

    it.each([
      [
        "spawn when last sushi is far enough",
        GAME_CONSTANTS.CANVAS_WIDTH - GAME_CONSTANTS.SUSHI_SPAWN_DISTANCE - 10,
        true,
      ],
      [
        "not spawn when last sushi is too close",
        GAME_CONSTANTS.CANVAS_WIDTH - 50,
        false,
      ],
    ])("should %s", (_, sushiX, expected) => {
      const gameState = createGameStateWithSushi({ x: sushiX });
      const shouldSpawn = GameLogic.shouldSpawnSushi(gameState);

      expect(shouldSpawn).toBe(expected);
    });
  });

  describe("addSushi", () => {
    it("should add a new sushi to the game state", () => {
      const gameState = { ...initialGameState };

      const updatedGameState = GameLogic.addSushi(gameState);

      expect(updatedGameState.sushis).toHaveLength(1);
      expect(updatedGameState.sushis[0]).toMatchObject({
        x: GAME_CONSTANTS.CANVAS_WIDTH,
        width: player.width,
        height: player.height,
        velocityX: GAME_CONSTANTS.SUSHI_SPEED,
        color: "#ff9500",
      });
    });

    it("should preserve existing sushis when adding new one", () => {
      const existingSushi = createTestSushi({ id: "existing-sushi", x: 400 });
      const gameState = { ...initialGameState, sushis: [existingSushi] };

      const updatedGameState = GameLogic.addSushi(gameState);

      expect(updatedGameState.sushis).toHaveLength(2);
      expect(updatedGameState.sushis[0]).toBe(existingSushi);
    });
  });

  describe("checkCollisionWithSushi", () => {
    let testSushi: Sushi;

    beforeEach(() => {
      testSushi = createTestSushi();
    });

    it("should detect collision when player overlaps with sushi", () => {
      const playerOnSushi = { ...testPlayer, x: 150, y: 300 };
      const collision = GameLogic.checkCollisionWithSushi(
        playerOnSushi,
        testSushi
      );

      expect(collision).toBe(true);
    });

    it.each([
      ["above sushi", 150, 250],
      ["to the left of sushi", 50, 300],
      ["to the right of sushi", 200, 300],
    ])("should not detect collision when player is %s", (_, x, y) => {
      const player = { ...testPlayer, x, y };
      const collision = GameLogic.checkCollisionWithSushi(player, testSushi);

      expect(collision).toBe(false);
    });
  });

  describe("checkPlayerSushiCollisions", () => {
    it("should return true when player collides with any sushi", () => {
      const sushi1 = createTestSushi({ id: "sushi1", x: 50 });
      const sushi2 = createTestSushi({ id: "sushi2", x: 100 }); // Player position

      const gameState = {
        ...initialGameState,
        player: { ...testPlayer, x: 100, y: 300 },
        sushis: [sushi1, sushi2],
      };

      const hasCollision = GameLogic.checkPlayerSushiCollisions(gameState);

      expect(hasCollision).toBe(true);
    });

    it("should return false when player doesn't collide with any sushi", () => {
      const gameState = createGameStateWithSushi(
        { x: 200 },
        { player: { ...testPlayer, x: 100, y: 300 } }
      );

      const hasCollision = GameLogic.checkPlayerSushiCollisions(gameState);

      expect(hasCollision).toBe(false);
    });
  });

  describe("updateGameState", () => {
    it("should spawn sushi when conditions are met", () => {
      const gameState = {
        ...initialGameState,
        isGameRunning: true,
        distance: 150,
      };

      const updatedGameState = GameLogic.updateGameState(gameState);

      expect(updatedGameState.sushis).toHaveLength(1);
    });

    it("should end game when player collides with sushi", () => {
      const gameState = createGameStateWithSushi(
        { id: "collision-sushi", x: 100 },
        {
          isGameRunning: true,
          player: { ...testPlayer, x: 100, y: 300 },
        }
      );

      const updatedGameState = GameLogic.updateGameState(gameState);

      expect(updatedGameState.isGameRunning).toBe(false);
      expect(updatedGameState.isGameOver).toBe(true);
    });

    it.each([
      ["not running", { isGameRunning: false, distance: 100 }],
      ["over", { isGameRunning: false, isGameOver: true, distance: 100 }],
    ])("should not update when game is %s", (_, gameStateOverrides) => {
      const gameState = { ...initialGameState, ...gameStateOverrides };
      const updatedGameState = GameLogic.updateGameState(gameState);

      expect(updatedGameState).toBe(gameState);
    });
  });
});

import { GameLogic } from "@/core/game-logic/gameLogic";
import { GAME_CONSTANTS } from "@/shared/constants/game";
import { PowerUpType } from "@/shared/types/powerUps";
import {
  createTestPlayer,
  createTestGameState,
  createRunningGameState,
  createTestSushi,
  createTestSamurai,
  createTestPowerUp,
  createPlayerWithPowerUp,
  createTestRiceRocket,
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

    it("should not update when game is not running", () => {
      const gameState = createTestGameState({ isGameRunning: false });
      const result = GameLogic.updateGameState(gameState);

      expect(result).toBe(gameState);
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

    it("should reset power-ups when collecting new one", () => {
      const playerWithShield = createPlayerWithPowerUp(PowerUpType.SHIELD);
      const newPowerUp = createTestPowerUp({ type: PowerUpType.JUMP_BOOST });

      const updatedPlayer = GameLogic.collectPowerUp(
        playerWithShield,
        newPowerUp
      );

      expect(updatedPlayer.hasShield).toBe(false);
      expect(updatedPlayer.hasJumpBoost).toBe(true);
    });

    it("should deactivate expired power-ups", () => {
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
    it("should detect collision between overlapping entities", () => {
      const entity1 = { x: 100, y: 100, width: 50, height: 50 };
      const entity2 = { x: 120, y: 120, width: 50, height: 50 };

      expect(GameLogic.checkCollision(entity1, entity2)).toBe(true);
    });

    it("should not detect collision between separate entities", () => {
      const entity1 = { x: 100, y: 100, width: 50, height: 50 };
      const entity2 = { x: 200, y: 200, width: 50, height: 50 };

      expect(GameLogic.checkCollision(entity1, entity2)).toBe(false);
    });

    it("should trigger game over on sushi collision", () => {
      const sushi = createTestSushi({ x: 100, y: 300 });
      const player = createTestPlayer({ x: 100, y: 300 });
      const gameState = createRunningGameState({
        player,
        sushis: [sushi],
      });

      const result = GameLogic.updateGameState(gameState);

      expect(result.isGameOver).toBe(true);
      expect(result.isGameRunning).toBe(false);
    });

    it("should prevent game over with shield", () => {
      const playerWithShield = createPlayerWithPowerUp(PowerUpType.SHIELD);
      const sushi = createTestSushi({ x: 100, y: 300 });
      const gameState = createRunningGameState({
        player: { ...playerWithShield, x: 100, y: 300 },
        sushis: [sushi],
      });

      const result = GameLogic.updateGameState(gameState);

      expect(result.isGameOver).toBe(false);
      expect(result.isGameRunning).toBe(true);
    });
  });

  describe("Enemies", () => {
    it("should create samurai", () => {
      const difficultyLevel = GameLogic.calculateDifficultyLevel(100);
      const samurai = GameLogic.createSamurai(100, difficultyLevel);

      expect(samurai.x).toBe(GAME_CONSTANTS.CANVAS_WIDTH);
      expect(samurai.velocityX).toBeLessThan(0);
      expect(samurai.lives).toBe(difficultyLevel.samuraiLives);
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
      expect(rocket.velocityX).toBe(GAME_CONSTANTS.RICE_ROCKET_SPEED);
    });

    it("should add rice rocket when player has ammo", () => {
      const player = createTestPlayer({ riceRocketAmmo: 5 });
      const gameState = createTestGameState({
        player,
        riceRockets: [],
      });

      const result = GameLogic.addRiceRocket(gameState);

      expect(result.riceRockets).toHaveLength(1);
      expect(result.player.riceRocketAmmo).toBe(4);
    });

    it("should not add rice rocket without ammo", () => {
      const player = createTestPlayer({ riceRocketAmmo: 0 });
      const gameState = createTestGameState({
        player,
        riceRockets: [],
      });

      const result = GameLogic.addRiceRocket(gameState);

      expect(result.riceRockets).toHaveLength(0);
      expect(result.player.riceRocketAmmo).toBe(0);
    });

    it("should not consume ammo with infinite ammo", () => {
      const playerWithInfiniteAmmo = createPlayerWithPowerUp(
        PowerUpType.INFINITE_AMMO
      );
      const gameState = createTestGameState({
        player: { ...playerWithInfiniteAmmo, riceRocketAmmo: 5 },
        riceRockets: [],
      });

      const result = GameLogic.addRiceRocket(gameState);

      expect(result.riceRockets).toHaveLength(1);
      expect(result.player.riceRocketAmmo).toBe(5); // Not consumed
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

    it("should slow down with slow motion power-up", () => {
      const playerWithSlowMotion = createPlayerWithPowerUp(
        PowerUpType.SLOW_MOTION
      );
      const normalSpeed = GameLogic.getCurrentSushiSpeed(100);
      const slowSpeed = GameLogic.getCurrentSushiSpeed(
        100,
        playerWithSlowMotion
      );

      expect(slowSpeed).toBeGreaterThan(normalSpeed); // Slower (less negative)
    });
  });

  describe("Entity Management", () => {
    it("should move entities", () => {
      const gameState = createRunningGameState({
        sushis: [createTestSushi({ x: 100 })],
        samurais: [createTestSamurai({ x: 100 })],
      });

      const result = GameLogic.updateGameState(gameState);

      expect(result.sushis[0].x).toBeLessThan(100);
      expect(result.samurais[0].x).toBeLessThan(100);
    });

    it("should remove off-screen entities", () => {
      const gameState = createRunningGameState({
        sushis: [createTestSushi({ x: -100 })],
        riceRockets: [
          createTestRiceRocket({ x: GAME_CONSTANTS.CANVAS_WIDTH + 100 }),
        ],
      });

      const result = GameLogic.updateGameState(gameState);

      expect(result.sushis).toHaveLength(0);
      expect(result.riceRockets).toHaveLength(0);
    });
  });
});

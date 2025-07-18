import { GameLogic } from "../gameLogic";
import {
  GameState,
  Player,
  PowerUp,
  Samurai,
  Ninja,
  Boss,
  SamuraiBullet,
  RiceRocket,
} from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import { player } from "@/entities/player";

const createTestPowerUp = (overrides: Partial<PowerUp> = {}): PowerUp => ({
  id: "test-powerup",
  x: 150,
  y: 300,
  width: GAME_CONSTANTS.POWERUP_WIDTH,
  height: GAME_CONSTANTS.POWERUP_HEIGHT,
  velocityX: GAME_CONSTANTS.BASE_SUSHI_SPEED,
  color: "#FFD700",
  type: "shield",
  duration: GAME_CONSTANTS.POWERUP_DURATION,
  ...overrides,
});

const createTestSamurai = (overrides: Partial<Samurai> = {}): Samurai => ({
  id: "test-samurai",
  x: 150,
  y: 300,
  width: GAME_CONSTANTS.SAMURAI_WIDTH,
  height: GAME_CONSTANTS.SAMURAI_HEIGHT,
  velocityX: GAME_CONSTANTS.BASE_SAMURAI_SPEED,
  color: "#8B0000",
  lives: GAME_CONSTANTS.SAMURAI_LIVES,
  maxLives: GAME_CONSTANTS.SAMURAI_LIVES,
  lastShotTime: 0,
  shotCooldown: GAME_CONSTANTS.SAMURAI_SHOT_COOLDOWN,
  ...overrides,
});

const createTestNinja = (overrides: Partial<Ninja> = {}): Ninja => ({
  id: "test-ninja",
  x: 150,
  y: 300,
  width: GAME_CONSTANTS.NINJA_WIDTH,
  height: GAME_CONSTANTS.NINJA_HEIGHT,
  velocityX: GAME_CONSTANTS.NINJA_SPEED,
  color: "#000080",
  lives: GAME_CONSTANTS.NINJA_LIVES,
  maxLives: GAME_CONSTANTS.NINJA_LIVES,
  lastShotTime: 0,
  shotCooldown: GAME_CONSTANTS.NINJA_SHOT_COOLDOWN,
  velocityY: 0,
  isJumping: false,
  jumpCooldown: 2000,
  lastJumpTime: 0,
  ...overrides,
});

const createTestBoss = (overrides: Partial<Boss> = {}): Boss => ({
  id: "test-boss",
  x: 150,
  y: 300,
  width: GAME_CONSTANTS.BOSS_WIDTH,
  height: GAME_CONSTANTS.BOSS_HEIGHT,
  velocityX: GAME_CONSTANTS.BOSS_SPEED,
  color: "#800080",
  lives: GAME_CONSTANTS.BOSS_LIVES,
  maxLives: GAME_CONSTANTS.BOSS_LIVES,
  lastShotTime: 0,
  shotCooldown: GAME_CONSTANTS.BOSS_SHOT_COOLDOWN,
  phase: 1,
  lastPhaseChange: 0,
  ...overrides,
});

const createTestRiceRocket = (
  overrides: Partial<RiceRocket> = {}
): RiceRocket => ({
  id: "test-rocket",
  x: 100,
  y: 200,
  width: GAME_CONSTANTS.RICE_ROCKET_SIZE,
  height: GAME_CONSTANTS.RICE_ROCKET_SIZE,
  velocityX: GAME_CONSTANTS.RICE_ROCKET_SPEED,
  color: "#FFA500",
  ...overrides,
});

const createTestSamuraiBullet = (
  overrides: Partial<SamuraiBullet> = {}
): SamuraiBullet => ({
  id: "test-bullet",
  x: 150,
  y: 300,
  width: GAME_CONSTANTS.SAMURAI_BULLET_WIDTH,
  height: GAME_CONSTANTS.SAMURAI_BULLET_HEIGHT,
  velocityX: GAME_CONSTANTS.BASE_SAMURAI_BULLET_SPEED,
  velocityY: 0,
  color: "#FF0000",
  ...overrides,
});

const createTestSushi = (
  overrides: Partial<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    velocityX: number;
    color: string;
  }> = {}
) => ({
  id: "test-sushi",
  x: 150,
  y: 300,
  width: 30, // Default sushi width
  height: 30, // Default sushi height
  velocityX: GAME_CONSTANTS.BASE_SUSHI_SPEED,
  color: "#FF6B6B",
  ...overrides,
});

describe("GameLogic - Collisions and Power-ups", () => {
  let initialGameState: GameState;
  let testPlayer: Player;

  beforeEach(() => {
    initialGameState = GameLogic.createInitialGameState();
    testPlayer = { ...player };
  });

  describe("checkCollision", () => {
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

    it("should detect collision when entities touch edges", () => {
      const entity1 = { x: 100, y: 100, width: 50, height: 50 };
      const entity2 = { x: 100, y: 100, width: 50, height: 50 };

      expect(GameLogic.checkCollision(entity1, entity2)).toBe(true);
    });
  });

  describe("Power-up functionality", () => {
    describe("createPowerUp", () => {
      it("should create a power-up with correct properties", () => {
        const testDistance = 100;
        const powerUp = GameLogic.createPowerUp(testDistance);

        expect(powerUp).toMatchObject({
          x: GAME_CONSTANTS.CANVAS_WIDTH,
          width: GAME_CONSTANTS.POWERUP_WIDTH,
          height: GAME_CONSTANTS.POWERUP_HEIGHT,
          duration: GAME_CONSTANTS.POWERUP_DURATION,
        });

        expect([
          "shield",
          "infinite_ammo",
          "speed_boost",
          "multi_shot",
        ]).toContain(powerUp.type);

        const expectedGroundY =
          GAME_CONSTANTS.CANVAS_HEIGHT -
          GAME_CONSTANTS.GROUND_HEIGHT -
          GAME_CONSTANTS.POWERUP_HEIGHT;
        expect(powerUp.y).toBe(expectedGroundY);
      });
    });

    describe("updatePowerUps", () => {
      it("should move power-ups and filter off-screen ones", () => {
        const visiblePowerUp = createTestPowerUp({ x: 100 });
        const offScreenPowerUp = createTestPowerUp({ x: -100 });

        const updatedPowerUps = GameLogic.updatePowerUps([
          visiblePowerUp,
          offScreenPowerUp,
        ]);

        expect(updatedPowerUps).toHaveLength(1);
        expect(updatedPowerUps[0].x).toBe(
          100 + GAME_CONSTANTS.BASE_SUSHI_SPEED
        );
      });
    });

    describe("shouldSpawnPowerUp", () => {
      it("should not spawn power-up if one already exists", () => {
        const gameState = {
          ...initialGameState,
          powerUps: [createTestPowerUp()],
          distance: 200,
        };
        expect(GameLogic.shouldSpawnPowerUp(gameState)).toBe(false);
      });

      it("should spawn power-up at correct distance intervals", () => {
        const gameState = {
          ...initialGameState,
          powerUps: [],
          distance: 2000, // 200 * 10 to match formatDistance logic
        };

        // Mock Math.random to return a value that will trigger spawn
        const originalRandom = Math.random;
        Math.random = jest.fn(() => 0.1); // Low value to ensure spawn

        expect(GameLogic.shouldSpawnPowerUp(gameState)).toBe(true);

        Math.random = originalRandom;
      });
    });

    describe("collectPowerUp", () => {
      it("should apply shield power-up correctly", () => {
        const powerUp = createTestPowerUp({ type: "shield" });
        const currentTime = Date.now();

        const updatedPlayer = GameLogic.collectPowerUp(testPlayer, powerUp);

        expect(updatedPlayer.hasShield).toBe(true);
        expect(updatedPlayer.powerUpEndTimes.shield).toBe(
          currentTime + powerUp.duration
        );
        expect(updatedPlayer.hasInfiniteAmmo).toBe(false);
        expect(updatedPlayer.hasSpeedBoost).toBe(false);
        expect(updatedPlayer.hasMultiShot).toBe(false);
      });

      it("should apply infinite_ammo power-up correctly", () => {
        const powerUp = createTestPowerUp({ type: "infinite_ammo" });
        const currentTime = Date.now();

        const updatedPlayer = GameLogic.collectPowerUp(testPlayer, powerUp);

        expect(updatedPlayer.hasInfiniteAmmo).toBe(true);
        expect(updatedPlayer.powerUpEndTimes.infiniteAmmo).toBe(
          currentTime + powerUp.duration
        );
        expect(updatedPlayer.hasShield).toBe(false);
      });

      it("should apply speed_boost power-up correctly", () => {
        const powerUp = createTestPowerUp({ type: "speed_boost" });
        const currentTime = Date.now();

        const updatedPlayer = GameLogic.collectPowerUp(testPlayer, powerUp);

        expect(updatedPlayer.hasSpeedBoost).toBe(true);
        expect(updatedPlayer.powerUpEndTimes.speedBoost).toBe(
          currentTime + powerUp.duration
        );
        expect(updatedPlayer.hasShield).toBe(false);
      });

      it("should apply multi_shot power-up correctly", () => {
        const powerUp = createTestPowerUp({ type: "multi_shot" });
        const currentTime = Date.now();

        const updatedPlayer = GameLogic.collectPowerUp(testPlayer, powerUp);

        expect(updatedPlayer.hasMultiShot).toBe(true);
        expect(updatedPlayer.powerUpEndTimes.multiShot).toBe(
          currentTime + powerUp.duration
        );
        expect(updatedPlayer.hasShield).toBe(false);
      });

      it("should reset all power-ups when collecting a new one", () => {
        const playerWithPowerUp = {
          ...testPlayer,
          hasShield: true,
          hasInfiniteAmmo: true,
          powerUpEndTimes: {
            shield: Date.now() + 5000,
            infiniteAmmo: Date.now() + 5000,
            speedBoost: 0,
            multiShot: 0,
          },
        };

        const newPowerUp = createTestPowerUp({ type: "speed_boost" });
        const updatedPlayer = GameLogic.collectPowerUp(
          playerWithPowerUp,
          newPowerUp
        );

        expect(updatedPlayer.hasShield).toBe(false);
        expect(updatedPlayer.hasInfiniteAmmo).toBe(false);
        expect(updatedPlayer.hasSpeedBoost).toBe(true);
      });
    });

    describe("updatePlayerPowerUps", () => {
      it("should deactivate expired power-ups", () => {
        const playerWithExpiredPowerUps = {
          ...testPlayer,
          hasShield: true,
          hasInfiniteAmmo: true,
          powerUpEndTimes: {
            shield: Date.now() - 1000, // Expired
            infiniteAmmo: Date.now() + 1000, // Still active
            speedBoost: 0,
            multiShot: 0,
          },
        };

        const updatedPlayer = GameLogic.updatePlayerPowerUps(
          playerWithExpiredPowerUps
        );

        expect(updatedPlayer.hasShield).toBe(false);
        expect(updatedPlayer.hasInfiniteAmmo).toBe(true);
      });
    });

    describe("checkPlayerPowerUpCollisions", () => {
      it("should collect power-up when player collides with it", () => {
        const powerUp = createTestPowerUp({ x: 100, y: 300 });
        const playerAtPowerUp = { ...testPlayer, x: 100, y: 300 };

        const gameState = {
          ...initialGameState,
          player: playerAtPowerUp,
          powerUps: [powerUp],
        };

        const result = GameLogic.checkPlayerPowerUpCollisions(gameState);

        expect(result.powerUps).toHaveLength(0); // Power-up should be removed
        expect(result.player.hasShield).toBe(true); // Power-up should be applied
      });

      it("should not collect power-up when player is not colliding", () => {
        const powerUp = createTestPowerUp({ x: 100, y: 300 });
        const playerAway = { ...testPlayer, x: 50, y: 300 };

        const gameState = {
          ...initialGameState,
          player: playerAway,
          powerUps: [powerUp],
        };

        const result = GameLogic.checkPlayerPowerUpCollisions(gameState);

        expect(result.powerUps).toHaveLength(1); // Power-up should remain
        expect(result.player.hasShield).toBe(false); // No power-up applied
      });
    });
  });

  describe("RiceRocket vs Enemy collisions", () => {
    describe("checkRiceRocketSamuraiCollisions", () => {
      it("should destroy rocket and reduce samurai lives on collision", () => {
        const rocket = createTestRiceRocket({ x: 150, y: 300 });
        const samurai = createTestSamurai({ x: 150, y: 300, lives: 3 });

        const gameState = {
          ...initialGameState,
          riceRockets: [rocket],
          samurais: [samurai],
        };

        const result = GameLogic.checkRiceRocketSamuraiCollisions(gameState);

        expect(result.riceRockets).toHaveLength(0); // Rocket destroyed
        expect(result.samurais[0].lives).toBe(2); // Samurai lost 1 life
      });

      it("should destroy samurai when lives reach zero", () => {
        const rocket = createTestRiceRocket({ x: 150, y: 300 });
        const samurai = createTestSamurai({ x: 150, y: 300, lives: 1 });

        const gameState = {
          ...initialGameState,
          riceRockets: [rocket],
          samurais: [samurai],
        };

        const result = GameLogic.checkRiceRocketSamuraiCollisions(gameState);

        expect(result.riceRockets).toHaveLength(0); // Rocket destroyed
        expect(result.samurais).toHaveLength(0); // Samurai destroyed
      });

      it("should not affect entities that are not colliding", () => {
        const rocket = createTestRiceRocket({ x: 100, y: 300 });
        const samurai = createTestSamurai({ x: 200, y: 300 });

        const gameState = {
          ...initialGameState,
          riceRockets: [rocket],
          samurais: [samurai],
        };

        const result = GameLogic.checkRiceRocketSamuraiCollisions(gameState);

        expect(result.riceRockets).toHaveLength(1); // Rocket remains
        expect(result.samurais[0].lives).toBe(3); // Samurai lives unchanged
      });
    });

    describe("checkRiceRocketNinjaCollisions", () => {
      it("should destroy rocket and reduce ninja lives on collision", () => {
        const rocket = createTestRiceRocket({ x: 150, y: 300 });
        const ninja = createTestNinja({ x: 150, y: 300, lives: 2 });

        const gameState = {
          ...initialGameState,
          riceRockets: [rocket],
          ninjas: [ninja],
        };

        const result = GameLogic.checkRiceRocketNinjaCollisions(gameState);

        expect(result.riceRockets).toHaveLength(0); // Rocket destroyed
        expect(result.ninjas[0].lives).toBe(1); // Ninja lost 1 life
      });

      it("should destroy ninja when lives reach zero", () => {
        const rocket = createTestRiceRocket({ x: 150, y: 300 });
        const ninja = createTestNinja({ x: 150, y: 300, lives: 1 });

        const gameState = {
          ...initialGameState,
          riceRockets: [rocket],
          ninjas: [ninja],
        };

        const result = GameLogic.checkRiceRocketNinjaCollisions(gameState);

        expect(result.riceRockets).toHaveLength(0); // Rocket destroyed
        expect(result.ninjas).toHaveLength(0); // Ninja destroyed
      });
    });

    describe("checkRiceRocketBossCollisions", () => {
      it("should destroy rocket and reduce boss lives on collision", () => {
        const rocket = createTestRiceRocket({ x: 150, y: 300 });
        const boss = createTestBoss({ x: 150, y: 300, lives: 8 });

        const gameState = {
          ...initialGameState,
          riceRockets: [rocket],
          bosses: [boss],
        };

        const result = GameLogic.checkRiceRocketBossCollisions(gameState);

        expect(result.riceRockets).toHaveLength(0); // Rocket destroyed
        expect(result.bosses[0].lives).toBe(7); // Boss lost 1 life
      });

      it("should destroy boss when lives reach zero", () => {
        const rocket = createTestRiceRocket({ x: 150, y: 300 });
        const boss = createTestBoss({ x: 150, y: 300, lives: 1 });

        const gameState = {
          ...initialGameState,
          riceRockets: [rocket],
          bosses: [boss],
        };

        const result = GameLogic.checkRiceRocketBossCollisions(gameState);

        expect(result.riceRockets).toHaveLength(0); // Rocket destroyed
        expect(result.bosses).toHaveLength(0); // Boss destroyed
      });
    });
  });

  describe("Player vs Enemy collisions", () => {
    describe("checkPlayerSamuraiBulletCollisions", () => {
      it("should remove bullet when player collides with it", () => {
        const bullet = createTestSamuraiBullet({ x: 100, y: 300 });
        const playerAtBullet = { ...testPlayer, x: 100, y: 300 };

        const gameState = {
          ...initialGameState,
          player: playerAtBullet,
          samuraiBullets: [bullet],
        };

        const result = GameLogic.checkPlayerSamuraiBulletCollisions(gameState);

        expect(result.samuraiBullets).toHaveLength(0); // Bullet removed
      });

      it("should not remove bullet when player is not colliding", () => {
        const bullet = createTestSamuraiBullet({ x: 100, y: 300 });
        const playerAway = { ...testPlayer, x: 50, y: 300 };

        const gameState = {
          ...initialGameState,
          player: playerAway,
          samuraiBullets: [bullet],
        };

        const result = GameLogic.checkPlayerSamuraiBulletCollisions(gameState);

        expect(result.samuraiBullets).toHaveLength(1); // Bullet remains
      });
    });

    describe("checkPlayerSamuraiCollisions", () => {
      it("should detect collision between player and samurai", () => {
        const samurai = createTestSamurai({ x: 100, y: 300 });
        const playerAtSamurai = { ...testPlayer, x: 100, y: 300 };

        const gameState = {
          ...initialGameState,
          player: playerAtSamurai,
          samurais: [samurai],
        };

        expect(GameLogic.checkPlayerSamuraiCollisions(gameState)).toBe(true);
      });

      it("should not detect collision when player and samurai are separate", () => {
        const samurai = createTestSamurai({ x: 200, y: 300 });
        const playerAway = { ...testPlayer, x: 100, y: 300 };

        const gameState = {
          ...initialGameState,
          player: playerAway,
          samurais: [samurai],
        };

        expect(GameLogic.checkPlayerSamuraiCollisions(gameState)).toBe(false);
      });
    });
  });

  describe("Game over conditions", () => {
    describe("checkGameOverConditions", () => {
      it("should return true when player collides with sushi", () => {
        const sushi = createTestSushi({ x: 100, y: 300 });
        const playerAtSushi = { ...testPlayer, x: 100, y: 300 };

        const gameState = {
          ...initialGameState,
          player: playerAtSushi,
          sushis: [sushi],
        };

        expect(GameLogic.checkGameOverConditions(gameState)).toBe(true);
      });

      it("should return true when player collides with samurai", () => {
        const samurai = createTestSamurai({ x: 100, y: 300 });
        const playerAtSamurai = { ...testPlayer, x: 100, y: 300 };

        const gameState = {
          ...initialGameState,
          player: playerAtSamurai,
          samurais: [samurai],
        };

        expect(GameLogic.checkGameOverConditions(gameState)).toBe(true);
      });

      it("should return false when no collisions occur", () => {
        const sushi = createTestSushi({ x: 200, y: 300 });
        const samurai = createTestSamurai({ x: 200, y: 300 });
        const playerAway = { ...testPlayer, x: 100, y: 300 };

        const gameState = {
          ...initialGameState,
          player: playerAway,
          sushis: [sushi],
          samurais: [samurai],
        };

        expect(GameLogic.checkGameOverConditions(gameState)).toBe(false);
      });
    });
  });

  describe("checkCollisions integration", () => {
    it("should handle multiple collision types in one update", () => {
      const rocket = createTestRiceRocket({ x: 150, y: 300 });
      const samurai = createTestSamurai({ x: 150, y: 300, lives: 1 });
      const powerUp = createTestPowerUp({ x: 100, y: 300 });
      const playerAtPowerUp = { ...testPlayer, x: 100, y: 300 };

      const gameState = {
        ...initialGameState,
        player: playerAtPowerUp,
        riceRockets: [rocket],
        samurais: [samurai],
        powerUps: [powerUp],
        isGameRunning: true,
      };

      const result = GameLogic.checkCollisions(gameState);

      expect(result.riceRockets).toHaveLength(0); // Rocket destroyed by samurai
      expect(result.samurais).toHaveLength(0); // Samurai destroyed by rocket
      expect(result.powerUps).toHaveLength(0); // Power-up collected by player
      expect(result.player.hasShield).toBe(true); // Power-up applied
    });

    it("should trigger game over when player is hit by bullet", () => {
      const bullet = createTestSamuraiBullet({ x: 100, y: 300 });
      const playerAtBullet = { ...testPlayer, x: 100, y: 300 };

      const gameState = {
        ...initialGameState,
        player: playerAtBullet,
        samuraiBullets: [bullet],
        isGameRunning: true,
      };

      const result = GameLogic.checkCollisions(gameState);

      expect(result.isGameOver).toBe(true);
      expect(result.isGameRunning).toBe(false);
    });
  });

  describe("Shield power-up functionality", () => {
    it("should prevent game over when player has shield and collides with sushi", () => {
      const playerWithShield = {
        ...testPlayer,
        hasShield: true,
        powerUpEndTimes: {
          ...testPlayer.powerUpEndTimes,
          shield: Date.now() + 10000,
        },
      };
      const sushi = createTestSushi();

      const gameState = {
        ...initialGameState,
        player: playerWithShield,
        sushis: [sushi],
        isGameRunning: true,
      };

      expect(GameLogic.checkGameOverConditions(gameState)).toBe(false);
    });

    it("should prevent game over when player has shield and collides with samurai", () => {
      const playerWithShield = {
        ...testPlayer,
        hasShield: true,
        powerUpEndTimes: {
          ...testPlayer.powerUpEndTimes,
          shield: Date.now() + 10000,
        },
      };
      const samurai = createTestSamurai({ x: 100, y: 300 });

      const gameState = {
        ...initialGameState,
        player: playerWithShield,
        samurais: [samurai],
        isGameRunning: true,
      };

      expect(GameLogic.checkGameOverConditions(gameState)).toBe(false);
    });

    it("should prevent game over when player has shield and collides with ninja", () => {
      const playerWithShield = {
        ...testPlayer,
        hasShield: true,
        powerUpEndTimes: {
          ...testPlayer.powerUpEndTimes,
          shield: Date.now() + 10000,
        },
      };
      const ninja = createTestNinja({ x: 100, y: 300 });

      const gameState = {
        ...initialGameState,
        player: playerWithShield,
        ninjas: [ninja],
        isGameRunning: true,
      };

      expect(GameLogic.checkGameOverConditions(gameState)).toBe(false);
    });

    it("should prevent game over when player has shield and collides with boss", () => {
      const playerWithShield = {
        ...testPlayer,
        hasShield: true,
        powerUpEndTimes: {
          ...testPlayer.powerUpEndTimes,
          shield: Date.now() + 10000,
        },
      };
      const boss = createTestBoss({ x: 100, y: 300 });

      const gameState = {
        ...initialGameState,
        player: playerWithShield,
        bosses: [boss],
        isGameRunning: true,
      };

      expect(GameLogic.checkGameOverConditions(gameState)).toBe(false);
    });

    it("should remove bullet but not trigger game over when player with shield is hit by bullet", () => {
      const playerWithShield = {
        ...testPlayer,
        hasShield: true,
        powerUpEndTimes: {
          ...testPlayer.powerUpEndTimes,
          shield: Date.now() + 10000,
        },
      };
      const bullet = createTestSamuraiBullet({ x: 100, y: 300 });

      const gameState = {
        ...initialGameState,
        player: playerWithShield,
        samuraiBullets: [bullet],
        isGameRunning: true,
      };

      const result = GameLogic.checkPlayerSamuraiBulletCollisions(gameState);

      expect(result.samuraiBullets).toHaveLength(0); // Bullet should be removed
      expect(result.isGameOver).toBe(false); // Should not trigger game over
      expect(result.isGameRunning).toBe(true); // Game should continue
    });

    it("should trigger game over when player without shield is hit by bullet", () => {
      const bullet = createTestSamuraiBullet({ x: 100, y: 300 });
      const playerAtBullet = { ...testPlayer, x: 100, y: 300 };

      const gameState = {
        ...initialGameState,
        player: playerAtBullet,
        samuraiBullets: [bullet],
        isGameRunning: true,
      };

      const result = GameLogic.checkPlayerSamuraiBulletCollisions(gameState);

      expect(result.samuraiBullets).toHaveLength(0); // Bullet should be removed
      expect(result.isGameOver).toBe(true); // Should trigger game over
      expect(result.isGameRunning).toBe(false); // Game should stop
    });

    it("should allow game over when shield expires", () => {
      const playerWithExpiredShield = {
        ...testPlayer,
        hasShield: false, // Shield expired
        powerUpEndTimes: {
          ...testPlayer.powerUpEndTimes,
          shield: Date.now() - 1000,
        }, // Expired
      };
      const sushi = createTestSushi({ x: 100, y: 300 });

      const gameState = {
        ...initialGameState,
        player: { ...playerWithExpiredShield, x: 100, y: 300 },
        sushis: [sushi],
        isGameRunning: true,
      };

      expect(GameLogic.checkGameOverConditions(gameState)).toBe(true);
    });
  });
});

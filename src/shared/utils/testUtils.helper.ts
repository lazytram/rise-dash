import { GameLogic } from "@/core/game-logic/gameLogic";
import {
  GameState,
  Player,
  Sushi,
  Samurai,
  Ninja,
  Boss,
  SamuraiBullet,
  RiceRocket,
  PowerUp,
  Torii,
} from "@/shared/types/game";
import { PowerUpType } from "@/shared/types/powerUps";
import { GAME_CONSTANTS } from "@/shared/constants/game";
import { player } from "@/core/entities/player";

// ============================================================================
// GAME STATE FACTORIES
// ============================================================================

export const createTestGameState = (
  overrides: Partial<GameState> = {}
): GameState => ({
  ...GameLogic.createInitialGameState(),
  ...overrides,
});

export const createRunningGameState = (
  overrides: Partial<GameState> = {}
): GameState =>
  createTestGameState({
    isGameRunning: true,
    ...overrides,
  });

// ============================================================================
// ENTITY FACTORIES
// ============================================================================

export const createTestPlayer = (overrides: Partial<Player> = {}): Player => ({
  ...player,
  ...overrides,
});

export const createTestSushi = (overrides: Partial<Sushi> = {}): Sushi => ({
  id: "test-sushi",
  x: 150,
  y: 300,
  width: 30,
  height: 30,
  velocityX: GAME_CONSTANTS.BASE_SUSHI_SPEED,
  color: "#FF6B6B",
  ...overrides,
});

export const createTestSamurai = (
  overrides: Partial<Samurai> = {}
): Samurai => ({
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

export const createTestNinja = (overrides: Partial<Ninja> = {}): Ninja => ({
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

export const createTestBoss = (overrides: Partial<Boss> = {}): Boss => ({
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

export const createTestSamuraiBullet = (
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

export const createTestRiceRocket = (
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

export const createTestPowerUp = (
  overrides: Partial<PowerUp> = {}
): PowerUp => ({
  id: "test-powerup",
  x: 150,
  y: 300,
  width: GAME_CONSTANTS.POWERUP_WIDTH,
  height: GAME_CONSTANTS.POWERUP_HEIGHT,
  velocityX: GAME_CONSTANTS.BASE_SUSHI_SPEED,
  color: "#FFD700",
  type: PowerUpType.SHIELD,
  duration: GAME_CONSTANTS.POWERUP_DURATION,
  ...overrides,
});

export const createTestTorii = (overrides: Partial<Torii> = {}): Torii => ({
  id: "test-torii",
  x: 150,
  y: 200,
  width: 60,
  height: 80,
  velocityX: GAME_CONSTANTS.BASE_SUSHI_SPEED,
  color: "#8B4513",
  ...overrides,
});

// ============================================================================
// COLLISION HELPERS
// ============================================================================

export const createCollidingEntities = (
  entityType: "sushi" | "samurai" | "bullet" | "powerup"
) => {
  const player = createTestPlayer({ x: 100, y: 300 });

  switch (entityType) {
    case "sushi":
      return { player, entity: createTestSushi({ x: 100, y: 300 }) };
    case "samurai":
      return { player, entity: createTestSamurai({ x: 100, y: 300 }) };
    case "bullet":
      return { player, entity: createTestSamuraiBullet({ x: 100, y: 300 }) };
    case "powerup":
      return { player, entity: createTestPowerUp({ x: 100, y: 300 }) };
    default:
      return { player, entity: createTestSushi({ x: 100, y: 300 }) };
  }
};

export const createNonCollidingEntities = (
  entityType: "sushi" | "samurai" | "bullet" | "powerup"
) => {
  const player = createTestPlayer({ x: 100, y: 300 });

  switch (entityType) {
    case "sushi":
      return { player, entity: createTestSushi({ x: 200, y: 300 }) };
    case "samurai":
      return { player, entity: createTestSamurai({ x: 200, y: 300 }) };
    case "bullet":
      return { player, entity: createTestSamuraiBullet({ x: 200, y: 300 }) };
    case "powerup":
      return { player, entity: createTestPowerUp({ x: 200, y: 300 }) };
    default:
      return { player, entity: createTestSushi({ x: 200, y: 300 }) };
  }
};

// ============================================================================
// POWER-UP HELPERS
// ============================================================================

export const createPlayerWithPowerUp = (
  powerUpType: PowerUpType,
  level: number = 1
) => {
  const powerUpEndTimes = {
    shield: 0,
    infiniteAmmo: 0,
    jumpBoost: 0,
    slowMotion: 0,
    multiShot: 0,
  };

  const powerUpLevels = {
    [PowerUpType.SHIELD]: 1,
    [PowerUpType.INFINITE_AMMO]: 1,
    [PowerUpType.JUMP_BOOST]: 1,
    [PowerUpType.SLOW_MOTION]: 1,
    [PowerUpType.MULTI_SHOT]: 1,
    [PowerUpType.RICE_ROCKET_AMMO]: 1,
  };

  // Set the specific power-up as active
  switch (powerUpType) {
    case PowerUpType.SHIELD:
      powerUpEndTimes.shield = Date.now() + 10000;
      powerUpLevels[PowerUpType.SHIELD] = level;
      break;
    case PowerUpType.INFINITE_AMMO:
      powerUpEndTimes.infiniteAmmo = Date.now() + 10000;
      powerUpLevels[PowerUpType.INFINITE_AMMO] = level;
      break;
    case PowerUpType.JUMP_BOOST:
      powerUpEndTimes.jumpBoost = Date.now() + 10000;
      powerUpLevels[PowerUpType.JUMP_BOOST] = level;
      break;
    case PowerUpType.SLOW_MOTION:
      powerUpEndTimes.slowMotion = Date.now() + 10000;
      powerUpLevels[PowerUpType.SLOW_MOTION] = level;
      break;
    case PowerUpType.MULTI_SHOT:
      powerUpEndTimes.multiShot = Date.now() + 10000;
      powerUpLevels[PowerUpType.MULTI_SHOT] = level;
      break;
  }

  return createTestPlayer({
    hasShield: powerUpType === PowerUpType.SHIELD,
    hasInfiniteAmmo: powerUpType === PowerUpType.INFINITE_AMMO,
    hasJumpBoost: powerUpType === PowerUpType.JUMP_BOOST,
    hasSlowMotion: powerUpType === PowerUpType.SLOW_MOTION,
    hasMultiShot: powerUpType === PowerUpType.MULTI_SHOT,
    powerUpEndTimes,
    powerUpLevels,
  });
};

// ============================================================================
// DIFFICULTY HELPERS
// ============================================================================

export const createDifficultyTestCases = () => {
  return [
    { distance: 0, expectedLevel: 1 },
    { distance: 1000, expectedLevel: 2 },
    { distance: 2000, expectedLevel: 3 },
    { distance: 5000, expectedLevel: 6 },
  ];
};

export const createSpeedTestCases = () => {
  return [
    { distance: 0, shouldBeFaster: false },
    { distance: 100, shouldBeFaster: true },
    { distance: 500, shouldBeFaster: true },
    { distance: 1000, shouldBeFaster: true },
  ];
};

// ============================================================================
// PERFORMANCE HELPERS
// ============================================================================

export const createManyEntities = (
  count: number,
  entityType: "sushi" | "samurai" | "ninja" | "boss"
) => {
  const factories = {
    sushi: createTestSushi,
    samurai: createTestSamurai,
    ninja: createTestNinja,
    boss: createTestBoss,
  };

  return Array.from({ length: count }, (_, i) =>
    factories[entityType]({
      id: `${entityType}-${i}`,
      x: 100 + i * 10,
    })
  );
};

// ============================================================================
// TEST HELPERS
// ============================================================================

export const mockMathRandom = (value: number) => {
  const originalRandom = Math.random;
  Math.random = jest.fn(() => value);
  return () => {
    Math.random = originalRandom;
  };
};

export const expectEntityToMove = (
  entity: { velocityX: number },
  direction: "left" | "right" = "left"
) => {
  const velocityX = entity.velocityX;

  if (direction === "left") {
    expect(velocityX).toBeLessThan(0);
  } else {
    expect(velocityX).toBeGreaterThan(0);
  }
};

export const expectCollision = (
  entity1: { x: number; y: number; width: number; height: number },
  entity2: { x: number; y: number; width: number; height: number },
  shouldCollide: boolean = true
) => {
  const collision = GameLogic.checkCollision(entity1, entity2);
  expect(collision).toBe(shouldCollide);
};

export const expectGameOver = (
  gameState: GameState,
  shouldBeGameOver: boolean = true
) => {
  const result = GameLogic.updateGameState(gameState);
  expect(result.isGameOver).toBe(shouldBeGameOver);
  if (shouldBeGameOver) {
    expect(result.isGameRunning).toBe(false);
  }
};

// ============================================================================
// COMMON TEST SETUPS
// ============================================================================

export const setupGameTest = () => {
  let gameState: GameState;
  let testPlayer: Player;

  beforeEach(() => {
    gameState = createTestGameState();
    testPlayer = createTestPlayer();
  });

  return () => ({ gameState, testPlayer });
};

export const setupCollisionTest = (
  entityType: "sushi" | "samurai" | "bullet" | "powerup"
) => {
  const { player, entity } = createCollidingEntities(entityType);
  const gameState = createRunningGameState({
    player,
    [getEntityArrayName(entityType)]: [entity],
  });

  return { gameState, player, entity };
};

const getEntityArrayName = (entityType: string) => {
  switch (entityType) {
    case "sushi":
      return "sushis";
    case "samurai":
      return "samurais";
    case "bullet":
      return "samuraiBullets";
    case "powerup":
      return "powerUps";
    default:
      return "sushis";
  }
};

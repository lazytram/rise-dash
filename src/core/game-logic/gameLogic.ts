import {
  Player,
  GameState,
  RiceRocket,
  Sushi,
  Torii,
  Samurai,
  EnemyBullet,
  Ninja,
  Boss,
  PowerUp,
  DifficultyLevel,
  ProjectileType,
} from "@/shared/types/game";
import { GAME_CONSTANTS } from "@/shared/constants/game";
import {
  RICE_ROCKET_COLORS,
  SUSHI_COLORS,
  TORII_COLORS,
  SAMURAI_COLORS,
  SAMURAI_BULLET_COLORS,
  NINJA_COLORS,
  BOSS_COLORS,
  POWERUP_COLORS,
} from "@/shared/constants/colors";
import {
  getPowerUpEffect,
  getMaxAmmo,
  getPowerUpService,
} from "@/shared/services/powerUpService";
import { POWERUP_UPGRADES } from "@/shared/constants/powerUps";
import { PowerUpType } from "@/shared/types/powerUps";

export class GameLogic {
  // ================================
  // DIFFICULTY SYSTEM
  // ================================

  static calculateDifficultyLevel(distance: number): DifficultyLevel {
    const level = Math.min(
      Math.floor(distance / GAME_CONSTANTS.DIFFICULTY_LEVEL_INTERVAL) + 1,
      GAME_CONSTANTS.MAX_DIFFICULTY_LEVEL
    );

    const speedMultiplier = this.calculateSpeedMultiplier(distance);

    // Calculate sushi spawn probability (increases with level)
    const sushiSpawnProbability = Math.min(
      GAME_CONSTANTS.MAX_SUSHI_SPAWN_PROBABILITY,
      GAME_CONSTANTS.BASE_SUSHI_SPAWN_PROBABILITY +
        (level - 1) * GAME_CONSTANTS.SUSHI_SPAWN_PROBABILITY_INCREASE
    );

    // Calculate samurai shot cooldown (decreases with level)
    const samuraiShotCooldown = Math.max(
      GAME_CONSTANTS.MIN_SAMURAI_SHOT_COOLDOWN,
      GAME_CONSTANTS.BASE_SAMURAI_SHOT_COOLDOWN -
        (level - 1) * GAME_CONSTANTS.SAMURAI_SHOT_COOLDOWN_DECREASE
    );

    // Calculate samurai lives (increases with level)
    const samuraiLives = Math.min(
      5,
      GAME_CONSTANTS.SAMURAI_LIVES + Math.floor(level / 3)
    );

    // Calculate samurai bullet speed (increases with level)
    const enemyBulletspeed =
      GAME_CONSTANTS.BASE_SAMURAI_BULLET_SPEED * (1 + (level - 1) * 0.1);

    // Calculate ninja parameters (unlocked at level 3+)
    const ninjaSpawnDistance =
      level >= 3 ? Math.max(30, 60 - (level - 3) * 3) : 999;
    const ninjaShotCooldown = Math.max(
      1000,
      GAME_CONSTANTS.NINJA_SHOT_COOLDOWN - (level - 3) * 100
    );
    const ninjaLives = Math.min(
      4,
      GAME_CONSTANTS.NINJA_LIVES + Math.floor((level - 3) / 2)
    );

    // Calculate boss parameters (unlocked at level 5+)
    const bossSpawnDistance =
      level >= 5 ? Math.max(100, 300 - (level - 5) * 20) : 999;
    const bossShotCooldown = Math.max(
      800,
      GAME_CONSTANTS.BOSS_SHOT_COOLDOWN - (level - 5) * 50
    );
    const bossLives = Math.min(
      12,
      GAME_CONSTANTS.BOSS_LIVES + Math.floor((level - 5) / 2)
    );

    // Calculate power-up spawn probability (increases with level)
    const powerUpSpawnProbability = Math.min(
      0.8,
      GAME_CONSTANTS.POWERUP_SPAWN_PROBABILITY + (level - 1) * 0.065
    );

    return {
      level,
      speedMultiplier,
      sushiSpawnProbability,
      samuraiShotCooldown,
      samuraiLives,
      enemyBulletspeed,
      ninjaSpawnDistance,
      ninjaShotCooldown,
      ninjaLives,
      bossSpawnDistance,
      bossShotCooldown,
      bossLives,
      powerUpSpawnProbability,
    };
  }

  static getDifficultyLevelName(level: number): string {
    const names = [
      "beginner",
      "novice",
      "apprentice",
      "intermediate",
      "advanced",
      "expert",
      "master",
      "legend",
      "divine",
      "ultimate",
    ];
    return names[Math.min(level - 1, names.length - 1)] || "ultimate";
  }

  // ================================
  // GAME STATE MANAGEMENT
  // ================================

  static createInitialGameState(): GameState {
    return {
      player: this.resetPlayer({
        x: 100,
        y: 300,
        width: 30,
        height: 30,
        velocityY: 0,
        isJumping: false,
        color: "#ff6b6b",
        riceRocketAmmo: getMaxAmmo(),
        maxRiceRocketAmmo: getMaxAmmo(),
        lastAmmoRechargeTime: Date.now(),
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
        stackedPowerUps: {},
        powerUpLevels: {
          [PowerUpType.SHIELD]: 1,
          [PowerUpType.INFINITE_AMMO]: 1,
          [PowerUpType.JUMP_BOOST]: 1,
          [PowerUpType.SLOW_MOTION]: 1,
          [PowerUpType.MULTI_SHOT]: 1,
          [PowerUpType.RICE_ROCKET_AMMO]: 1,
          [PowerUpType.PHOENIX_PACT]: 1,
        },
      }),
      riceRockets: [],
      sushis: [],
      toriis: [],
      samurais: [],
      ninjas: [],
      bosses: [],
      enemyBullets: [],
      powerUps: [],
      distance: 0,
      isGameRunning: false,
      isGameOver: false,
      difficultyLevel: this.calculateDifficultyLevel(0),
      lastEnemySpawnDistance: 0,
    };
  }

  static updateGameState(gameState: GameState): GameState {
    if (!gameState.isGameRunning || gameState.isGameOver) {
      // Ensure projectiles are cleared when game is not running
      return {
        ...gameState,
        enemyBullets: [],
        riceRockets: [],
        sushis: [],
        toriis: [],
        samurais: [],
        ninjas: [],
        bosses: [],
        powerUps: [],
      };
    }

    // Pre-calculate common values for better performance
    const updatedDistance = this.updateDistance(gameState.distance);
    const updatedDifficultyLevel =
      this.calculateDifficultyLevel(updatedDistance);

    // Update all game entities in parallel for better performance
    const [
      updatedPlayer,
      updatedRiceRockets,
      updatedSushis,
      updatedToriis,
      updatedSamurais,
      updatedNinjas,
      updatedBosses,
      updatedEnemyBullets,
      updatedPowerUps,
    ] = [
      this.updatePlayerPhysics(gameState.player),
      this.updateRiceRockets(gameState.riceRockets),
      this.updateSushis(gameState.sushis),
      this.updateToriis(gameState.toriis),
      this.updateSamurais(gameState.samurais),
      this.updateNinjas(gameState.ninjas),
      this.updateBosses(gameState.bosses),
      this.updateEnemyBullets(gameState.enemyBullets),
      this.updatePowerUps(gameState.powerUps),
    ];

    let newGameState = {
      ...gameState,
      player: updatedPlayer,
      riceRockets: updatedRiceRockets,
      sushis: updatedSushis,
      toriis: updatedToriis,
      samurais: updatedSamurais,
      ninjas: updatedNinjas,
      bosses: updatedBosses,
      enemyBullets: updatedEnemyBullets,
      powerUps: updatedPowerUps,
      distance: updatedDistance,
      difficultyLevel: updatedDifficultyLevel,
    };

    // Spawn new entities
    newGameState = this.spawnEntities(newGameState);

    // Check for collisions
    newGameState = this.checkCollisions(newGameState);

    // Check for game over conditions (sushi and samurai collisions)
    if (this.checkGameOverConditions(newGameState)) {
      const phoenixStacks =
        newGameState.player.stackedPowerUps?.[PowerUpType.PHOENIX_PACT] || 0;
      if (phoenixStacks > 0) {
        // Consume a Phoenix Pact to instantly resurrect
        newGameState = {
          ...newGameState,
          player: {
            ...this.resetPlayer(newGameState.player),
            stackedPowerUps: {
              ...(newGameState.player.stackedPowerUps || {}),
              [PowerUpType.PHOENIX_PACT]: phoenixStacks - 1,
            },
          },
          // Clear entities to give a brief respite
          enemyBullets: [],
          riceRockets: [],
          sushis: [],
          toriis: [],
          samurais: [],
          ninjas: [],
          bosses: [],
          powerUps: [],
          isGameOver: false,
          isGameRunning: true,
        };
      } else {
        newGameState = {
          ...newGameState,
          isGameOver: true,
          isGameRunning: false,
          // Clear ALL game entities when game over to prevent instant death on restart
          enemyBullets: [],
          riceRockets: [],
          sushis: [],
          toriis: [],
          samurais: [],
          ninjas: [],
          bosses: [],
          powerUps: [],
        };
      }
    }

    return newGameState;
  }

  // ================================
  // ENTITY SPAWNING
  // ================================

  static spawnEntities(gameState: GameState): GameState {
    let newGameState = gameState;

    if (this.shouldSpawnSushi(newGameState)) {
      newGameState = this.addSushi(newGameState);
    }

    // Spawn Torii
    if (this.shouldSpawnTorii(newGameState)) {
      newGameState = this.addTorii(newGameState);
    }

    // Spawn Enemy (Samurai or Ninja) - unified spawn logic
    if (this.shouldSpawnEnemy(newGameState)) {
      newGameState = this.spawnEnemy(newGameState);
    }

    // Spawn Boss (every 1000 meters)
    if (this.shouldSpawnBoss(newGameState)) {
      newGameState = this.addBoss(newGameState);
    }

    // Spawn Power-ups
    if (this.shouldSpawnPowerUp(newGameState)) {
      newGameState = this.addPowerUp(newGameState);
    }

    return newGameState;
  }

  // ================================
  // PLAYER MANAGEMENT
  // ================================

  static resetPlayer(player: Player): Player {
    const powerUpService = getPowerUpService();

    return {
      ...player,
      x: 100,
      y: 300,
      velocityY: 0,
      isJumping: false,
      riceRocketAmmo: getMaxAmmo(),
      maxRiceRocketAmmo: getMaxAmmo(),
      lastAmmoRechargeTime: Date.now(),
      // Reset power-up states
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
      stackedPowerUps: player.stackedPowerUps || {},
      // Update power-up levels from service
      powerUpLevels: {
        [PowerUpType.SHIELD]: powerUpService.getPowerUpLevel(
          PowerUpType.SHIELD
        ),
        [PowerUpType.INFINITE_AMMO]: powerUpService.getPowerUpLevel(
          PowerUpType.INFINITE_AMMO
        ),
        [PowerUpType.JUMP_BOOST]: powerUpService.getPowerUpLevel(
          PowerUpType.JUMP_BOOST
        ),
        [PowerUpType.SLOW_MOTION]: powerUpService.getPowerUpLevel(
          PowerUpType.SLOW_MOTION
        ),
        [PowerUpType.MULTI_SHOT]: powerUpService.getPowerUpLevel(
          PowerUpType.MULTI_SHOT
        ),
        [PowerUpType.RICE_ROCKET_AMMO]: powerUpService.getPowerUpLevel(
          PowerUpType.RICE_ROCKET_AMMO
        ),
        [PowerUpType.PHOENIX_PACT]: powerUpService.getPowerUpLevel(
          PowerUpType.PHOENIX_PACT
        ),
      },
    };
  }

  static updatePlayerPhysics(player: Player): Player {
    const newVelocityY = player.velocityY + GAME_CONSTANTS.GRAVITY;
    const newY = player.y + newVelocityY;
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    // Update ammo recharge (skip if infinite ammo is active)
    const currentTime = Date.now();
    const timeSinceLastRecharge = currentTime - player.lastAmmoRechargeTime;

    let updatedPlayer = {
      ...player,
      y: newY,
      velocityY: newVelocityY,
    };

    // Check if player hit the ground
    if (newY >= groundY - player.height) {
      updatedPlayer = {
        ...updatedPlayer,
        y: groundY - player.height,
        velocityY: 0,
        isJumping: false,
      };
    }

    // Update power-ups (always call this)
    updatedPlayer = this.updatePlayerPowerUps(updatedPlayer);

    // Recharge ammo only if not infinite
    if (
      !updatedPlayer.hasInfiniteAmmo &&
      timeSinceLastRecharge >= GAME_CONSTANTS.AMMO_RECHARGE_INTERVAL &&
      updatedPlayer.riceRocketAmmo < updatedPlayer.maxRiceRocketAmmo
    ) {
      updatedPlayer = {
        ...updatedPlayer,
        riceRocketAmmo: Math.min(
          updatedPlayer.riceRocketAmmo + 1,
          updatedPlayer.maxRiceRocketAmmo
        ),
        lastAmmoRechargeTime: currentTime,
      };
    }

    return updatedPlayer;
  }

  static canJump(player: Player): boolean {
    return !player.isJumping;
  }

  static makePlayerJump(player: Player): Player {
    if (!this.canJump(player)) return player;

    // Apply jump boost effect to jump strength if active
    let jumpStrength = GAME_CONSTANTS.JUMP_STRENGTH;
    if (player.hasJumpBoost) {
      const jumpEffect = getPowerUpEffect(PowerUpType.JUMP_BOOST);
      if (jumpEffect.jumpMultiplier) {
        jumpStrength = GAME_CONSTANTS.JUMP_STRENGTH * jumpEffect.jumpMultiplier;
      }
    }

    return {
      ...player,
      velocityY: jumpStrength,
      isJumping: true,
    };
  }

  // ================================
  // RICE ROCKET MANAGEMENT
  // ================================

  static createRiceRocket(player: Player, yOffset: number = 0): RiceRocket {
    return {
      id: Date.now().toString() + Math.random(),
      x: player.x + player.width,
      y: player.y + player.height / 2 + yOffset,
      width: GAME_CONSTANTS.RICE_ROCKET_SIZE,
      height: GAME_CONSTANTS.RICE_ROCKET_SIZE,
      velocityX: GAME_CONSTANTS.RICE_ROCKET_SPEED,
      color: RICE_ROCKET_COLORS.BODY,
    };
  }

  static createMultiShotRockets(player: Player): RiceRocket[] {
    if (!player.hasMultiShot) {
      return [this.createRiceRocket(player)];
    }

    const multiShotEffect = getPowerUpEffect(PowerUpType.MULTI_SHOT);
    const projectileCount = multiShotEffect.projectileCount || 2;
    const rockets: RiceRocket[] = [];

    for (let i = 0; i < projectileCount; i++) {
      const offset = (i - (projectileCount - 1) / 2) * 10; // Spread rockets vertically
      rockets.push(this.createRiceRocket(player, offset));
    }

    return rockets;
  }

  static updateRiceRockets(riceRockets: RiceRocket[]): RiceRocket[] {
    return riceRockets
      .map((rocket) => ({
        ...rocket,
        x: rocket.x + rocket.velocityX,
      }))
      .filter((rocket) => rocket.x < GAME_CONSTANTS.CANVAS_WIDTH + 50);
  }

  static addRiceRocket(gameState: GameState): GameState {
    // Check if player has ammo (unless infinite ammo is active)
    if (
      !gameState.player.hasInfiniteAmmo &&
      gameState.player.riceRocketAmmo <= 0
    ) {
      return gameState; // Can't shoot without ammo
    }

    // Create rockets based on multi-shot level
    const newRockets = this.createMultiShotRockets(gameState.player);
    let updatedPlayer = gameState.player;

    // Reduce ammo only if not infinite
    if (!gameState.player.hasInfiniteAmmo) {
      updatedPlayer = {
        ...gameState.player,
        riceRocketAmmo: gameState.player.riceRocketAmmo - 1,
      };
    }

    return {
      ...gameState,
      riceRockets: [...gameState.riceRockets, ...newRockets],
      player: updatedPlayer,
    };
  }

  // ================================
  // SUSHI MANAGEMENT
  // ================================

  static createSushi(distance: number, player?: Player): Sushi {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
    const baseSpeed = this.getCurrentSushiSpeed(distance, player);
    const speedVariation = this.calculateSushiSpeedVariation();

    return {
      id: this.generateEntityId(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - 25, // Increased height to reduce collision chance
      width: 30, // Default sushi width
      height: 30, // Default sushi height
      velocityX: baseSpeed * speedVariation,
      color: SUSHI_COLORS.BASE,
    };
  }

  /**
   * Generates a unique ID for game entities
   */
  private static generateEntityId(): string {
    return Date.now().toString() + Math.random();
  }

  /**
   * Calculates speed variation for sushis (±7.5% variation)
   * Returns a multiplier between 0.925 and 1.075
   */
  private static calculateSushiSpeedVariation(): number {
    return 0.925 + Math.random() * 0.15;
  }

  static updateSushis(sushis: Sushi[]): Sushi[] {
    return sushis
      .map((sushi) => ({
        ...sushi,
        x: sushi.x + sushi.velocityX,
      }))
      .filter((sushi) => sushi.x > -sushi.width);
  }

  static shouldSpawnSushi(gameState: GameState): boolean {
    // Don't spawn sushis too early in the game
    if (gameState.distance < 100) {
      return false;
    }

    // If no sushi on screen, spawn based on difficulty probability
    if (gameState.sushis.length === 0) {
      return Math.random() < gameState.difficultyLevel.sushiSpawnProbability;
    }

    const lastSushi = gameState.sushis[gameState.sushis.length - 1];
    const distanceFromLast = GAME_CONSTANTS.CANVAS_WIDTH - lastSushi.x;

    // Calculate spawn distance using hybrid approach
    const spawnDistance = this.calculateSushiSpawnDistance();

    // Only spawn if distance is sufficient and probability check passes
    if (distanceFromLast >= spawnDistance) {
      return Math.random() < gameState.difficultyLevel.sushiSpawnProbability;
    }

    return false;
  }

  /**
   * Calculates the spawn distance for sushis using a hybrid approach:
   * - 85% of the time: Linear distribution (predictable spacing)
   * - 15% of the time: Exponential distribution (surprise factor)
   */
  private static calculateSushiSpawnDistance(): number {
    const useExponentialDistribution = Math.random() < 0.15;

    if (useExponentialDistribution) {
      return this.calculateExponentialSpawnDistance();
    } else {
      return this.calculateLinearSpawnDistance();
    }
  }

  /**
   * Calculates spawn distance using exponential distribution for unpredictability
   * Creates more varied spacing with occasional very close or far spawns
   */
  private static calculateExponentialSpawnDistance(): number {
    const minDistance = 200;
    const maxDistance = 1200;
    const randomValue = Math.random();

    return minDistance + (maxDistance - minDistance) * Math.pow(randomValue, 2);
  }

  /**
   * Calculates spawn distance using linear distribution for predictability
   * Creates consistent, player-friendly spacing
   */
  private static calculateLinearSpawnDistance(): number {
    const minDistance = 300;
    const maxDistance = 800;

    return minDistance + Math.random() * (maxDistance - minDistance);
  }

  static addSushi(gameState: GameState): GameState {
    const newSushi = this.createSushi(gameState.distance, gameState.player);
    return {
      ...gameState,
      sushis: [...gameState.sushis, newSushi],
    };
  }

  // ================================
  // TORII MANAGEMENT
  // ================================

  static createTorii(distance: number, player?: Player): Torii {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.TORII_HEIGHT,
      width: GAME_CONSTANTS.TORII_WIDTH,
      height: GAME_CONSTANTS.TORII_HEIGHT,
      velocityX: this.getCurrentSushiSpeed(distance, player), // Use same speed as sushi
      color: TORII_COLORS.PRIMARY,
    };
  }

  static updateToriis(toriis: Torii[]): Torii[] {
    return toriis
      .map((torii) => ({
        ...torii,
        x: torii.x + torii.velocityX,
      }))
      .filter((torii) => torii.x > -torii.width);
  }

  static shouldSpawnTorii(gameState: GameState): boolean {
    // Only spawn a torii if there are none currently on screen
    if (gameState.toriis.length > 0) return false;
    return (
      GameLogic.formatDistance(gameState.distance) %
        GAME_CONSTANTS.TORII_SPAWN_DISTANCE ===
      0
    );
  }

  static addTorii(gameState: GameState): GameState {
    const newTorii = this.createTorii(gameState.distance, gameState.player);
    return {
      ...gameState,
      toriis: [...gameState.toriis, newTorii],
    };
  }

  // ================================
  // UTILITY FUNCTIONS
  // ================================

  static updateDistance(currentDistance: number): number {
    return currentDistance + 1;
  }

  static formatDistance(distance: number): number {
    return Math.floor(distance / 10);
  }

  // ================================
  // SPEED PROGRESSION SYSTEM
  // ================================

  static calculateSpeedMultiplier(distance: number): number {
    const speedLevel = Math.floor(
      distance / GAME_CONSTANTS.SPEED_INCREASE_INTERVAL
    );
    return Math.pow(1 + GAME_CONSTANTS.SPEED_INCREASE_PERCENTAGE, speedLevel);
  }

  static getCurrentSushiSpeed(distance: number, player?: Player): number {
    const speedMultiplier = this.calculateSpeedMultiplier(distance);
    let speed = GAME_CONSTANTS.BASE_SUSHI_SPEED * speedMultiplier;

    // Apply slow motion effect if active
    if (player?.hasSlowMotion) {
      const slowEffect = getPowerUpEffect(PowerUpType.SLOW_MOTION);
      if (slowEffect.slowMultiplier) {
        speed *= slowEffect.slowMultiplier;
      }
    }

    return speed;
  }

  static getCurrentSamuraiSpeed(distance: number, player?: Player): number {
    const speedMultiplier = this.calculateSpeedMultiplier(distance);
    let speed = GAME_CONSTANTS.BASE_SAMURAI_SPEED * speedMultiplier;

    // Apply slow motion effect if active
    if (player?.hasSlowMotion) {
      const slowEffect = getPowerUpEffect(PowerUpType.SLOW_MOTION);
      if (slowEffect.slowMultiplier) {
        speed *= slowEffect.slowMultiplier;
      }
    }

    return speed;
  }

  static getCurrentenemyBulletspeed(distance: number, player?: Player): number {
    const speedMultiplier = this.calculateSpeedMultiplier(distance);
    let speed = GAME_CONSTANTS.BASE_SAMURAI_BULLET_SPEED * speedMultiplier;

    // Apply slow motion effect if active
    if (player?.hasSlowMotion) {
      const slowEffect = getPowerUpEffect(PowerUpType.SLOW_MOTION);
      if (slowEffect.slowMultiplier) {
        speed *= slowEffect.slowMultiplier;
      }
    }

    return speed;
  }

  // ================================
  // SAMURAI MANAGEMENT
  // ================================

  static createSamurai(
    distance: number,
    difficultyLevel: DifficultyLevel,
    player?: Player
  ): Samurai {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.SAMURAI_HEIGHT,
      width: GAME_CONSTANTS.SAMURAI_WIDTH,
      height: GAME_CONSTANTS.SAMURAI_HEIGHT,
      velocityX: this.getCurrentSamuraiSpeed(distance, player),
      color: SAMURAI_COLORS.BODY,
      lives: difficultyLevel.samuraiLives,
      maxLives: difficultyLevel.samuraiLives,
      lastShotTime: Date.now(),
      shotCooldown: difficultyLevel.samuraiShotCooldown,
    };
  }

  static updateSamurais(samurais: Samurai[]): Samurai[] {
    return samurais
      .map((samurai) => ({
        ...samurai,
        x: samurai.x + samurai.velocityX,
      }))
      .filter((samurai) => samurai.x > -samurai.width);
  }

  static shouldSpawnSamurai(gameState: GameState): boolean {
    // Only spawn a samurai if there are none currently on screen
    if (gameState.samurais.length > 0) return false;

    const formattedDistance = GameLogic.formatDistance(gameState.distance);

    // Don't spawn samurai before minimum distance
    if (formattedDistance < GAME_CONSTANTS.SAMURAI_MIN_SPAWN_DISTANCE) {
      return false;
    }

    // Don't spawn at exactly 0 (which would be the case at the very beginning)
    if (formattedDistance === 0) {
      return false;
    }

    // Check if we have enough distance since the last samurai spawn
    const distanceSinceLastSpawn =
      formattedDistance - gameState.lastEnemySpawnDistance;
    if (distanceSinceLastSpawn < GAME_CONSTANTS.SAMURAI_MIN_SPAWN_INTERVAL) {
      return false;
    }

    // Random chance to spawn (70% probability when conditions are met)
    return Math.random() < GAME_CONSTANTS.SAMURAI_SPAWN_PROBABILITY;
  }

  static addSamurai(gameState: GameState): GameState {
    const newSamurai = this.createSamurai(
      gameState.distance,
      gameState.difficultyLevel,
      gameState.player
    );
    return {
      ...gameState,
      samurais: [...gameState.samurais, newSamurai],
      lastEnemySpawnDistance: GameLogic.formatDistance(gameState.distance),
    };
  }

  static createEnemyBullet(
    enemy: Samurai | Ninja,
    distance: number,
    difficultyLevel: DifficultyLevel,
    player?: Player
  ): EnemyBullet {
    // Ensure bullet starts at a safe distance from the player
    const bulletX = Math.max(enemy.x, 150); // Minimum 150px from left edge

    return {
      id: Date.now().toString() + Math.random(),
      x: bulletX, // Start from safe position
      y: enemy.y + enemy.height / 2, // Same height as enemy center
      width: GAME_CONSTANTS.SAMURAI_BULLET_WIDTH,
      height: GAME_CONSTANTS.SAMURAI_BULLET_HEIGHT,
      velocityX: this.getCurrentenemyBulletspeed(distance, player), // Use difficulty-based speed
      velocityY: 0, // No vertical movement
      color: SAMURAI_BULLET_COLORS.BODY,
      projectileType: ProjectileType.BOSS_BULLET,
    };
  }

  static createShuriken(
    ninja: Ninja,
    distance: number,
    difficultyLevel: DifficultyLevel,
    player?: Player
  ): EnemyBullet {
    // Ensure shuriken starts at a safe distance from the player
    const shurikenX = Math.max(ninja.x, 150); // Minimum 150px from left edge

    return {
      id: Date.now().toString() + Math.random(),
      x: shurikenX, // Start from safe position
      y: ninja.y + ninja.height / 2, // Same height as ninja center
      width: GAME_CONSTANTS.SHURIKEN_WIDTH,
      height: GAME_CONSTANTS.SHURIKEN_HEIGHT,
      velocityX: this.getCurrentenemyBulletspeed(distance, player) * 1.2, // Shuriken are faster
      velocityY: 0, // No vertical movement
      color: NINJA_COLORS.SHURIKEN, // Purple shuriken
      projectileType: ProjectileType.SHURIKEN,
    };
  }

  static createKatanaSlash(samurai: Samurai): EnemyBullet {
    // Katana slash is a melee attack that appears as a circular slash
    const slashRadius = 60; // 1.5m equivalent in pixels
    const slashX = samurai.x - slashRadius; // Start from samurai position
    const slashY = samurai.y + samurai.height / 2 - slashRadius / 2;

    return {
      id: Date.now().toString() + Math.random(),
      x: slashX,
      y: slashY,
      width: slashRadius * 2,
      height: slashRadius,
      velocityX: GAME_CONSTANTS.KATANA_SLASH_SPEED, // Slower than bullets, moves towards player
      velocityY: 0,
      color: "#C0C0C0", // Silver color for katana slash
      projectileType: ProjectileType.KATANA_SLASH,
    };
  }

  static updateEnemyBullets(enemyBullets: EnemyBullet[]): EnemyBullet[] {
    return enemyBullets
      .map((bullet) => ({
        ...bullet,
        x: bullet.x + bullet.velocityX,
        y: bullet.y + bullet.velocityY,
      }))
      .filter((bullet) => bullet.x > -bullet.width);
  }

  static makeSamuraiShoot(samurai: Samurai): EnemyBullet | null {
    const currentTime = Date.now();
    if (currentTime - samurai.lastShotTime >= samurai.shotCooldown) {
      return this.createKatanaSlash(samurai);
    }
    return null;
  }

  static makeNinjaShoot(
    ninja: Ninja,
    distance: number,
    difficultyLevel: DifficultyLevel,
    player?: Player
  ): EnemyBullet | null {
    const currentTime = Date.now();
    if (currentTime - ninja.lastShotTime >= ninja.shotCooldown) {
      return this.createShuriken(ninja, distance, difficultyLevel, player);
    }
    return null;
  }

  // ================================
  // COLLISION DETECTION
  // ================================

  static checkCollisions(gameState: GameState): GameState {
    let newGameState = gameState;

    // Make enemies shoot FIRST (before collision checks)
    newGameState = this.makeEnemiesShoot(newGameState);

    // Check RiceRocket vs Enemy collisions
    newGameState = this.checkRiceRocketEnemyCollisions(newGameState);

    // Check Player vs EnemyBullet collisions (handles shield protection)
    newGameState = this.checkPlayerEnemyBulletCollisions(newGameState);

    // Check Player vs PowerUp collisions
    newGameState = this.checkPlayerPowerUpCollisions(newGameState);

    return newGameState;
  }

  static checkRiceRocketEnemyCollisions(gameState: GameState): GameState {
    let newGameState = gameState;

    // Check RiceRocket vs Samurai collisions
    newGameState = this.checkRiceRocketSamuraiCollisions(newGameState);

    // Check RiceRocket vs Ninja collisions
    newGameState = this.checkRiceRocketNinjaCollisions(newGameState);

    // Check RiceRocket vs Boss collisions
    newGameState = this.checkRiceRocketBossCollisions(newGameState);

    return newGameState;
  }

  static checkRiceRocketSamuraiCollisions(gameState: GameState): GameState {
    const { riceRockets, samurais, enemyBullets } = gameState;
    const newRiceRockets = [...riceRockets];
    const newSamurais = [...samurais];
    let enemyDied = false;

    // Check each rice rocket against each samurai
    for (let i = newRiceRockets.length - 1; i >= 0; i--) {
      const rocket = newRiceRockets[i];
      for (let j = newSamurais.length - 1; j >= 0; j--) {
        const samurai = newSamurais[j];
        if (this.checkCollision(rocket, samurai)) {
          // Remove the rocket
          newRiceRockets.splice(i, 1);
          // Reduce samurai lives
          newSamurais[j] = {
            ...samurai,
            lives: samurai.lives - 1,
          };
          // Remove samurai if no lives left
          if (newSamurais[j].lives <= 0) {
            newSamurais.splice(j, 1);
            enemyDied = true;
          }
          break;
        }
      }
    }

    return {
      ...gameState,
      riceRockets: newRiceRockets,
      samurais: newSamurais,
      enemyBullets: enemyDied ? [] : enemyBullets,
    };
  }

  static checkPlayerEnemyBulletCollisions(gameState: GameState): GameState {
    const { player, enemyBullets } = gameState;
    const newenemyBullets = [...enemyBullets];

    // Check each samurai bullet against player
    for (let i = newenemyBullets.length - 1; i >= 0; i--) {
      const bullet = newenemyBullets[i];
      if (this.checkCollision(player, bullet)) {
        // Debug: Log bullet collision
        const formattedDistance = this.formatDistance(gameState.distance);
        console.log(
          `Bullet collision at distance ${formattedDistance}, Player pos: (${player.x}, ${player.y}), Bullet pos: (${bullet.x}, ${bullet.y})`
        );

        // Always remove the bullet on collision
        newenemyBullets.splice(i, 1);

        // If player has shield, remove bullet and continue (shield protects from death)
        if (player.hasShield) {
          // Shield absorbs the bullet - player survives
          // Continue checking other bullets
        } else {
          // No shield - try Phoenix Pact instant resurrection
          const phoenixStacks =
            gameState.player.stackedPowerUps?.[PowerUpType.PHOENIX_PACT] || 0;
          if (phoenixStacks > 0) {
            const resurrectedPlayer = {
              ...this.resetPlayer(gameState.player),
              stackedPowerUps: {
                ...(gameState.player.stackedPowerUps || {}),
                [PowerUpType.PHOENIX_PACT]: phoenixStacks - 1,
              },
            };

            return {
              ...gameState,
              player: resurrectedPlayer,
              enemyBullets: [],
              riceRockets: [],
              sushis: [],
              toriis: [],
              samurais: [],
              ninjas: [],
              bosses: [],
              powerUps: [],
              isGameOver: false,
              isGameRunning: true,
            };
          }

          // No Phoenix Pact -> game over
          return {
            ...gameState,
            enemyBullets: [],
            riceRockets: [],
            sushis: [],
            toriis: [],
            samurais: [],
            ninjas: [],
            bosses: [],
            powerUps: [],
            isGameOver: true,
            isGameRunning: false,
          };
        }
      }
    }

    return {
      ...gameState,
      enemyBullets: newenemyBullets,
    };
  }

  static checkCollision(
    entity1: { x: number; y: number; width: number; height: number },
    entity2: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      entity1.x < entity2.x + entity2.width &&
      entity1.x + entity1.width > entity2.x &&
      entity1.y < entity2.y + entity2.height &&
      entity1.y + entity1.height > entity2.y
    );
  }

  static checkCollisionWithSushi(player: Player, sushi: Sushi): boolean {
    return this.checkCollision(player, sushi);
  }

  static checkPlayerSushiCollisions(gameState: GameState): boolean {
    return gameState.sushis.some((sushi) =>
      this.checkCollision(gameState.player, sushi)
    );
  }

  static checkPlayerSamuraiCollisions(gameState: GameState): boolean {
    return gameState.samurais.some((samurai) =>
      this.checkCollision(gameState.player, samurai)
    );
  }

  static checkPlayerNinjaCollisions(gameState: GameState): boolean {
    return gameState.ninjas.some((ninja) =>
      this.checkCollision(gameState.player, ninja)
    );
  }

  static checkPlayerBossCollisions(gameState: GameState): boolean {
    return gameState.bosses.some((boss) =>
      this.checkCollision(gameState.player, boss)
    );
  }

  static checkGameOverConditions(gameState: GameState): boolean {
    const { player } = gameState;

    // If player has shield active, no game over from collisions
    if (player.hasShield) {
      return false;
    }

    // Check if player collides with sushi
    if (this.checkPlayerSushiCollisions(gameState)) {
      return true;
    }

    // Check if player collides with samurai
    if (this.checkPlayerSamuraiCollisions(gameState)) {
      return true;
    }

    // Check if player collides with ninja
    if (this.checkPlayerNinjaCollisions(gameState)) {
      return true;
    }

    // Check if player collides with boss
    if (this.checkPlayerBossCollisions(gameState)) {
      return true;
    }

    return false;
  }

  // ================================
  // NINJA MANAGEMENT
  // ================================

  static createNinja(
    distance: number,
    difficultyLevel: DifficultyLevel,
    player?: Player
  ): Ninja {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.NINJA_HEIGHT,
      width: GAME_CONSTANTS.NINJA_WIDTH,
      height: GAME_CONSTANTS.NINJA_HEIGHT,
      velocityX: this.getCurrentSamuraiSpeed(distance, player), // Use same speed calculation as samurai
      color: NINJA_COLORS.BODY,
      lives: difficultyLevel.ninjaLives,
      maxLives: difficultyLevel.ninjaLives,
      lastShotTime: Date.now(),
      shotCooldown: difficultyLevel.ninjaShotCooldown,
      velocityY: 0,
      isJumping: false,
      jumpCooldown: 2000,
      lastJumpTime: 0,
    };
  }

  static updateNinjas(ninjas: Ninja[]): Ninja[] {
    return ninjas
      .map((ninja) => {
        // Apply gravity
        const newVelocityY = ninja.velocityY + GAME_CONSTANTS.GRAVITY;
        const newY = ninja.y + newVelocityY;
        const groundY =
          GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

        // Check if ninja hit the ground
        if (newY >= groundY - ninja.height) {
          return {
            ...ninja,
            y: groundY - ninja.height,
            velocityY: 0,
            isJumping: false,
            x: ninja.x + ninja.velocityX,
          };
        }

        // Random jumping
        const currentTime = Date.now();
        if (
          !ninja.isJumping &&
          currentTime - ninja.lastJumpTime > ninja.jumpCooldown &&
          Math.random() < GAME_CONSTANTS.NINJA_JUMP_PROBABILITY
        ) {
          return {
            ...ninja,
            y: newY,
            velocityY: GAME_CONSTANTS.NINJA_JUMP_STRENGTH,
            isJumping: true,
            lastJumpTime: currentTime,
            x: ninja.x + ninja.velocityX,
          };
        }

        return {
          ...ninja,
          y: newY,
          velocityY: newVelocityY,
          x: ninja.x + ninja.velocityX,
        };
      })
      .filter((ninja) => ninja.x > -ninja.width);
  }

  static shouldSpawnNinja(gameState: GameState): boolean {
    if (gameState.ninjas.length > 0) return false;

    const formattedDistance = GameLogic.formatDistance(gameState.distance);
    const difficultyLevel = gameState.difficultyLevel;

    // Only spawn ninjas at level 3+
    if (difficultyLevel.level < 3) return false;

    return formattedDistance % difficultyLevel.ninjaSpawnDistance === 0;
  }

  static addNinja(gameState: GameState): GameState {
    const newNinja = this.createNinja(
      gameState.distance,
      gameState.difficultyLevel,
      gameState.player
    );
    return {
      ...gameState,
      ninjas: [...gameState.ninjas, newNinja],
    };
  }

  // ================================
  // BOSS MANAGEMENT
  // ================================

  static createBoss(
    distance: number,
    difficultyLevel: DifficultyLevel,
    player?: Player
  ): Boss {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.BOSS_HEIGHT,
      width: GAME_CONSTANTS.BOSS_WIDTH,
      height: GAME_CONSTANTS.BOSS_HEIGHT,
      velocityX: this.getCurrentSamuraiSpeed(distance, player), // Use same speed calculation as samurai
      color: BOSS_COLORS.BODY,
      lives: difficultyLevel.bossLives,
      maxLives: difficultyLevel.bossLives,
      lastShotTime: Date.now(),
      shotCooldown: difficultyLevel.bossShotCooldown,
      phase: 1,
      lastPhaseChange: Date.now(),
    };
  }

  static updateBosses(bosses: Boss[]): Boss[] {
    return bosses
      .map((boss) => ({
        ...boss,
        x: boss.x + boss.velocityX,
      }))
      .filter((boss) => boss.x > -boss.width);
  }

  static shouldSpawnBoss(gameState: GameState): boolean {
    if (gameState.bosses.length > 0) return false;

    const formattedDistance = GameLogic.formatDistance(gameState.distance);

    // Don't spawn boss at the very beginning (distance 0)
    if (formattedDistance === 0) return false;

    // Spawn bosses every 1000 meters
    return formattedDistance % GAME_CONSTANTS.BOSS_SPAWN_DISTANCE === 0;
  }

  static addBoss(gameState: GameState): GameState {
    const newBoss = this.createBoss(
      gameState.distance,
      gameState.difficultyLevel,
      gameState.player
    );
    return {
      ...gameState,
      bosses: [...gameState.bosses, newBoss],
    };
  }

  // ================================
  // POWER-UP MANAGEMENT
  // ================================

  static createPowerUp(distance: number, player?: Player): PowerUp {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
    // Use player's current levels to decide eligibility
    const powerUpTypes = Object.values(GAME_CONSTANTS.POWERUP_TYPES);
    // Filter power-ups that require purchase if player level == 0 (locked)
    const eligibleTypes = powerUpTypes.filter((type) => {
      const config = POWERUP_UPGRADES[type as unknown as PowerUpType];
      const requiresPurchase = config?.requiresPurchase === true;
      const playerLevel =
        player?.powerUpLevels?.[type as unknown as PowerUpType];
      if (requiresPurchase) {
        // Level must be defined and > 0
        return (playerLevel ?? 0) > 0;
      }
      return true;
    });

    const pool = eligibleTypes.length > 0 ? eligibleTypes : powerUpTypes;
    const randomType = pool[Math.floor(Math.random() * pool.length)];

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.POWERUP_HEIGHT,
      width: GAME_CONSTANTS.POWERUP_WIDTH,
      height: GAME_CONSTANTS.POWERUP_HEIGHT,
      velocityX: this.getCurrentSushiSpeed(distance, player),
      color:
        POWERUP_COLORS[randomType.toUpperCase() as keyof typeof POWERUP_COLORS],
      type: randomType,
      duration: GAME_CONSTANTS.POWERUP_DURATION,
    };
  }

  static updatePowerUps(powerUps: PowerUp[]): PowerUp[] {
    return powerUps
      .map((powerUp) => ({
        ...powerUp,
        x: powerUp.x + powerUp.velocityX,
      }))
      .filter((powerUp) => powerUp.x > -powerUp.width);
  }

  static shouldSpawnPowerUp(gameState: GameState): boolean {
    // Only one power-up at a time
    if (gameState.powerUps.length > 0) return false;

    const formattedDistance = GameLogic.formatDistance(gameState.distance);
    const difficultyLevel = gameState.difficultyLevel;

    // Spawn power-ups every 200m with probability
    if (formattedDistance % GAME_CONSTANTS.POWERUP_SPAWN_DISTANCE !== 0)
      return false;

    return Math.random() < difficultyLevel.powerUpSpawnProbability;
  }

  static addPowerUp(gameState: GameState): GameState {
    const newPowerUp = this.createPowerUp(gameState.distance, gameState.player);
    return {
      ...gameState,
      powerUps: [...gameState.powerUps, newPowerUp],
    };
  }

  static collectPowerUp(player: Player, powerUp: PowerUp): Player {
    const currentTime = Date.now();

    // Reset all power-up states first (only one power-up at a time)
    const resetPlayer = {
      ...player,
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
    };

    // Prevent collecting locked purchased power-ups (e.g., Phoenix) if level is 0
    const powerUpType = powerUp.type;
    const config = POWERUP_UPGRADES[powerUpType];
    if (config?.requiresPurchase) {
      const level = player.powerUpLevels?.[powerUpType];
      if ((level ?? 0) <= 0) {
        return player;
      }
    }

    const effect = getPowerUpEffect(powerUpType);
    const endTime =
      currentTime + (effect.duration || GAME_CONSTANTS.POWERUP_DURATION);

    // Apply the new power-up with level-based effects
    switch (powerUp.type) {
      case PowerUpType.PHOENIX_PACT: {
        const current = player.stackedPowerUps?.[PowerUpType.PHOENIX_PACT] || 0;
        return {
          ...player,
          stackedPowerUps: {
            ...(player.stackedPowerUps || {}),
            [PowerUpType.PHOENIX_PACT]: current + 1,
          },
        };
      }
      case PowerUpType.SHIELD:
        console.log(
          "Shield collected! End time:",
          endTime,
          "Current time:",
          currentTime
        );
        return {
          ...resetPlayer,
          hasShield: true,
          powerUpEndTimes: { ...resetPlayer.powerUpEndTimes, shield: endTime },
        };
      case PowerUpType.INFINITE_AMMO:
        return {
          ...resetPlayer,
          hasInfiniteAmmo: true,
          powerUpEndTimes: {
            ...resetPlayer.powerUpEndTimes,
            infiniteAmmo: endTime,
          },
        };
      case PowerUpType.JUMP_BOOST:
        return {
          ...resetPlayer,
          hasJumpBoost: true,
          powerUpEndTimes: {
            ...resetPlayer.powerUpEndTimes,
            jumpBoost: endTime,
          },
        };
      case PowerUpType.SLOW_MOTION:
        return {
          ...resetPlayer,
          hasSlowMotion: true,
          powerUpEndTimes: {
            ...resetPlayer.powerUpEndTimes,
            slowMotion: endTime,
          },
        };
      case PowerUpType.MULTI_SHOT:
        return {
          ...resetPlayer,
          hasMultiShot: true,
          powerUpEndTimes: {
            ...resetPlayer.powerUpEndTimes,
            multiShot: endTime,
          },
        };
      default:
        return resetPlayer;
    }
  }

  static updatePlayerPowerUps(player: Player): Player {
    const currentTime = Date.now();
    const { powerUpEndTimes } = player;
    return {
      // Log simple pour vérifier que la fonction est appelée

      ...player,
      hasShield:
        currentTime < powerUpEndTimes.shield && powerUpEndTimes.shield > 0,
      hasInfiniteAmmo:
        currentTime < powerUpEndTimes.infiniteAmmo &&
        powerUpEndTimes.infiniteAmmo > 0,
      hasJumpBoost:
        currentTime < powerUpEndTimes.jumpBoost &&
        powerUpEndTimes.jumpBoost > 0,
      hasSlowMotion:
        currentTime < powerUpEndTimes.slowMotion &&
        powerUpEndTimes.slowMotion > 0,
      hasMultiShot:
        currentTime < powerUpEndTimes.multiShot &&
        powerUpEndTimes.multiShot > 0,
    };
  }

  // ================================
  // ADDITIONAL COLLISION METHODS
  // ================================

  static checkRiceRocketNinjaCollisions(gameState: GameState): GameState {
    const { riceRockets, ninjas, enemyBullets } = gameState;
    const newRiceRockets = [...riceRockets];
    const newNinjas = [...ninjas];
    let enemyDied = false;

    // Check each rice rocket against each ninja
    for (let i = newRiceRockets.length - 1; i >= 0; i--) {
      const rocket = newRiceRockets[i];
      for (let j = newNinjas.length - 1; j >= 0; j--) {
        const ninja = newNinjas[j];
        if (this.checkCollision(rocket, ninja)) {
          // Remove the rocket
          newRiceRockets.splice(i, 1);
          // Reduce ninja lives
          newNinjas[j] = {
            ...ninja,
            lives: ninja.lives - 1,
          };
          // Remove ninja if no lives left
          if (newNinjas[j].lives <= 0) {
            newNinjas.splice(j, 1);
            enemyDied = true;
          }
          break;
        }
      }
    }

    return {
      ...gameState,
      riceRockets: newRiceRockets,
      ninjas: newNinjas,
      enemyBullets: enemyDied ? [] : enemyBullets,
    };
  }

  static checkRiceRocketBossCollisions(gameState: GameState): GameState {
    const { riceRockets, bosses, enemyBullets } = gameState;
    const newRiceRockets = [...riceRockets];
    const newBosses = [...bosses];

    let enemyDied = false;

    // Check each rice rocket against each boss
    for (let i = newRiceRockets.length - 1; i >= 0; i--) {
      const rocket = newRiceRockets[i];
      for (let j = newBosses.length - 1; j >= 0; j--) {
        const boss = newBosses[j];
        if (this.checkCollision(rocket, boss)) {
          // Remove the rocket
          newRiceRockets.splice(i, 1);
          // Reduce boss lives
          newBosses[j] = {
            ...boss,
            lives: boss.lives - 1,
          };
          // Remove boss if no lives left
          if (newBosses[j].lives <= 0) {
            newBosses.splice(j, 1);
            enemyDied = true;
          }
          break;
        }
      }
    }

    return {
      ...gameState,
      riceRockets: newRiceRockets,
      bosses: newBosses,
      enemyBullets: enemyDied ? [] : enemyBullets,
    };
  }

  static checkPlayerPowerUpCollisions(gameState: GameState): GameState {
    const { player, powerUps } = gameState;
    const newPowerUps = [...powerUps];
    let updatedPlayer = player;

    // Check each power-up against player
    for (let i = newPowerUps.length - 1; i >= 0; i--) {
      const powerUp = newPowerUps[i];
      if (this.checkCollision(player, powerUp)) {
        // Collect the power-up
        updatedPlayer = this.collectPowerUp(player, powerUp);
        // Remove the power-up
        newPowerUps.splice(i, 1);
      }
    }

    return {
      ...gameState,
      player: updatedPlayer,
      powerUps: newPowerUps,
    };
  }

  static makeEnemiesShoot(gameState: GameState): GameState {
    let newGameState = gameState;

    // Make all enemies shoot in one unified function
    newGameState = this.makeAllEnemiesShoot(newGameState);

    return newGameState;
  }

  static makeAllEnemiesShoot(gameState: GameState): GameState {
    const { samurais, ninjas, bosses, enemyBullets } = gameState;
    const newEnemyBullets = [...enemyBullets];

    // Make samurais shoot katana slashes
    const newSamurais = [...samurais];
    newSamurais.forEach((samurai, index) => {
      if (samurai.lives > 0) {
        const slash = this.makeSamuraiShoot(samurai);
        if (slash) {
          newEnemyBullets.push(slash);
          newSamurais[index] = {
            ...samurai,
            lastShotTime: Date.now(),
          };
        }
      }
    });

    // Make ninjas shoot shuriken
    const newNinjas = [...ninjas];
    newNinjas.forEach((ninja, index) => {
      if (ninja.lives > 0) {
        const shuriken = this.makeNinjaShoot(
          ninja,
          gameState.distance,
          gameState.difficultyLevel,
          gameState.player
        );
        if (shuriken) {
          newEnemyBullets.push(shuriken);
          newNinjas[index] = {
            ...ninja,
            lastShotTime: Date.now(),
          };
        }
      }
    });

    // Helper function for multi-shot enemies (bosses)
    const makeMultiShotEnemyShoot = (bosses: Boss[]) => {
      bosses.forEach((boss, index) => {
        if (boss.lives > 0) {
          const currentTime = Date.now();
          if (currentTime - boss.lastShotTime >= boss.shotCooldown) {
            // Boss shoots multiple bullets
            for (let i = 0; i < GAME_CONSTANTS.BOSS_MULTI_SHOT_COUNT; i++) {
              const bullet = this.createEnemyBullet(
                boss,
                gameState.distance,
                gameState.difficultyLevel,
                gameState.player
              );
              // Adjust bullet positions for spread
              bullet.y = boss.y + boss.height / 2 + (i - 1) * 20;
              newEnemyBullets.push(bullet);
            }
            bosses[index] = {
              ...boss,
              lastShotTime: currentTime,
            };
          }
        }
      });
    };

    // Make bosses shoot
    const newBosses = [...bosses];
    makeMultiShotEnemyShoot(newBosses);

    return {
      ...gameState,
      samurais: newSamurais,
      ninjas: newNinjas,
      bosses: newBosses,
      enemyBullets: newEnemyBullets,
    };
  }

  static shouldSpawnEnemy(gameState: GameState): boolean {
    // Don't spawn if there are already enemies on screen
    if (gameState.samurais.length > 0 || gameState.ninjas.length > 0) {
      console.log("❌ Enemies already on screen:", {
        samurais: gameState.samurais.length,
        ninjas: gameState.ninjas.length,
      });
      return false;
    }

    const formattedDistance = GameLogic.formatDistance(gameState.distance);

    // Don't spawn enemies before 50 meters
    if (formattedDistance < GAME_CONSTANTS.SAMURAI_MIN_SPAWN_DISTANCE) {
      console.log(
        "❌ Distance too low:",
        formattedDistance,
        "<",
        GAME_CONSTANTS.SAMURAI_MIN_SPAWN_DISTANCE
      );
      return false;
    }

    // Don't spawn at exactly 0 (which would be the case at the very beginning)
    if (formattedDistance === 0) {
      console.log("❌ Distance is 0");
      return false;
    }

    // Check if we have enough distance since the last enemy spawn
    const distanceSinceLastSpawn =
      formattedDistance - gameState.lastEnemySpawnDistance;
    if (distanceSinceLastSpawn < GAME_CONSTANTS.SAMURAI_MIN_SPAWN_INTERVAL) {
      console.log(
        "❌ Not enough distance since last spawn:",
        distanceSinceLastSpawn,
        "<",
        GAME_CONSTANTS.SAMURAI_MIN_SPAWN_INTERVAL
      );
      return false;
    }

    console.log("✅ Should spawn enemy at distance:", formattedDistance);
    // 100% chance to spawn when conditions are met
    return true;
  }

  static spawnEnemy(gameState: GameState): GameState {
    const random = Math.random();

    if (random < 0.7) {
      // Spawn samurai (70% chance)
      return this.addSamurai(gameState);
    } else {
      // Spawn ninja (30% chance)
      return this.addNinja(gameState);
    }
  }
}

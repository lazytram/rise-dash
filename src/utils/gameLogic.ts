import {
  Player,
  GameState,
  RiceRocket,
  Sushi,
  Torii,
  Samurai,
  SamuraiBullet,
  Ninja,
  Boss,
  PowerUp,
  DifficultyLevel,
} from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import {
  RICE_ROCKET_COLORS,
  SUSHI_COLORS,
  TORII_COLORS,
  SAMURAI_COLORS,
  SAMURAI_BULLET_COLORS,
  NINJA_COLORS,
  BOSS_COLORS,
  POWERUP_COLORS,
} from "@/constants/colors";
import { player } from "@/entities/player";

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

    // Calculate samurai spawn distance (decreases with level)
    const samuraiSpawnDistance = Math.max(
      GAME_CONSTANTS.MIN_SAMURAI_SPAWN_DISTANCE,
      GAME_CONSTANTS.BASE_SAMURAI_SPAWN_DISTANCE -
        (level - 1) * GAME_CONSTANTS.SAMURAI_SPAWN_DISTANCE_DECREASE
    );

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
    const samuraiBulletSpeed =
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
      GAME_CONSTANTS.POWERUP_SPAWN_PROBABILITY + (level - 1) * 0.05
    );

    return {
      level,
      speedMultiplier,
      samuraiSpawnDistance,
      sushiSpawnProbability,
      samuraiShotCooldown,
      samuraiLives,
      samuraiBulletSpeed,
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
      player: player,
      riceRockets: [],
      sushis: [],
      toriis: [],
      samurais: [],
      ninjas: [],
      bosses: [],
      samuraiBullets: [],
      powerUps: [],
      distance: 0,
      isGameRunning: false,
      isGameOver: false,
      difficultyLevel: this.calculateDifficultyLevel(0),
    };
  }

  static updateGameState(gameState: GameState): GameState {
    if (!gameState.isGameRunning || gameState.isGameOver) {
      return gameState;
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
      updatedSamuraiBullets,
      updatedPowerUps,
    ] = [
      this.updatePlayerPhysics(gameState.player),
      this.updateRiceRockets(gameState.riceRockets),
      this.updateSushis(gameState.sushis),
      this.updateToriis(gameState.toriis),
      this.updateSamurais(gameState.samurais),
      this.updateNinjas(gameState.ninjas),
      this.updateBosses(gameState.bosses),
      this.updateSamuraiBullets(gameState.samuraiBullets),
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
      samuraiBullets: updatedSamuraiBullets,
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
      newGameState = {
        ...newGameState,
        isGameOver: true,
        isGameRunning: false,
      };
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

    // Spawn Samurai
    if (this.shouldSpawnSamurai(newGameState)) {
      newGameState = this.addSamurai(newGameState);
    }

    // Spawn Ninja (level 3+)
    if (this.shouldSpawnNinja(newGameState)) {
      newGameState = this.addNinja(newGameState);
    }

    // Spawn Boss (level 5+)
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
    return {
      ...player,
      x: 100,
      y: 300,
      velocityY: 0,
      isJumping: false,
      riceRocketAmmo: GAME_CONSTANTS.MAX_RICE_ROCKET_AMMO,
      lastAmmoRechargeTime: Date.now(),
      // Reset power-up states
      hasShield: false,
      hasInfiniteAmmo: false,
      hasSpeedBoost: false,
      hasMultiShot: false,
      powerUpEndTimes: {
        shield: 0,
        infiniteAmmo: 0,
        speedBoost: 0,
        multiShot: 0,
      },
    };
  }

  static updatePlayerPhysics(player: Player): Player {
    const newVelocityY = player.velocityY + GAME_CONSTANTS.GRAVITY;
    const newY = player.y + newVelocityY;
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    // Check if player hit the ground
    if (newY >= groundY - player.height) {
      return {
        ...player,
        y: groundY - player.height,
        velocityY: 0,
        isJumping: false,
      };
    }

    // Update ammo recharge (skip if infinite ammo is active)
    const currentTime = Date.now();
    const timeSinceLastRecharge = currentTime - player.lastAmmoRechargeTime;

    let updatedPlayer = {
      ...player,
      y: newY,
      velocityY: newVelocityY,
    };

    // Update power-ups
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

    return {
      ...player,
      velocityY: GAME_CONSTANTS.JUMP_STRENGTH,
      isJumping: true,
    };
  }

  // ================================
  // RICE ROCKET MANAGEMENT
  // ================================

  static createRiceRocket(player: Player): RiceRocket {
    return {
      id: Date.now().toString() + Math.random(),
      x: player.x + player.width,
      y: player.y + player.height / 2,
      width: GAME_CONSTANTS.RICE_ROCKET_SIZE,
      height: GAME_CONSTANTS.RICE_ROCKET_SIZE,
      velocityX: GAME_CONSTANTS.RICE_ROCKET_SPEED,
      color: RICE_ROCKET_COLORS.BODY,
    };
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

    const newRiceRocket = this.createRiceRocket(gameState.player);
    let updatedPlayer = gameState.player;

    // Reduce ammo only if not infinite
    if (!gameState.player.hasInfiniteAmmo) {
      updatedPlayer = {
        ...gameState.player,
        riceRocketAmmo: gameState.player.riceRocketAmmo - 1,
      };
    }

    // Handle multi-shot
    if (gameState.player.hasMultiShot) {
      const multiRocket1 = this.createRiceRocket(gameState.player);
      const multiRocket2 = this.createRiceRocket(gameState.player);

      // Adjust positions for multi-shot
      multiRocket1.y = gameState.player.y + gameState.player.height / 2 - 10;
      multiRocket2.y = gameState.player.y + gameState.player.height / 2 + 10;

      return {
        ...gameState,
        riceRockets: [
          ...gameState.riceRockets,
          newRiceRocket,
          multiRocket1,
          multiRocket2,
        ],
        player: updatedPlayer,
      };
    }

    return {
      ...gameState,
      riceRockets: [...gameState.riceRockets, newRiceRocket],
      player: updatedPlayer,
    };
  }

  // ================================
  // SUSHI MANAGEMENT
  // ================================

  static createSushi(distance: number): Sushi {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
    const baseSpeed = this.getCurrentSushiSpeed(distance);
    const speedVariation = this.calculateSushiSpeedVariation();

    return {
      id: this.generateEntityId(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - player.width,
      width: player.width,
      height: player.width,
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
    const newSushi = this.createSushi(gameState.distance);
    return {
      ...gameState,
      sushis: [...gameState.sushis, newSushi],
    };
  }

  // ================================
  // TORII MANAGEMENT
  // ================================

  static createTorii(distance: number): Torii {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.TORII_HEIGHT,
      width: GAME_CONSTANTS.TORII_WIDTH,
      height: GAME_CONSTANTS.TORII_HEIGHT,
      velocityX: this.getCurrentSushiSpeed(distance), // Use same speed as sushi
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
    const newTorii = this.createTorii(gameState.distance);
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

  static getCurrentSushiSpeed(distance: number): number {
    const speedMultiplier = this.calculateSpeedMultiplier(distance);
    return GAME_CONSTANTS.BASE_SUSHI_SPEED * speedMultiplier;
  }

  static getCurrentSamuraiSpeed(distance: number): number {
    const speedMultiplier = this.calculateSpeedMultiplier(distance);
    return GAME_CONSTANTS.BASE_SAMURAI_SPEED * speedMultiplier;
  }

  static getCurrentSamuraiBulletSpeed(distance: number): number {
    const speedMultiplier = this.calculateSpeedMultiplier(distance);
    return GAME_CONSTANTS.BASE_SAMURAI_BULLET_SPEED * speedMultiplier;
  }

  // ================================
  // SAMURAI MANAGEMENT
  // ================================

  static createSamurai(
    distance: number,
    difficultyLevel: DifficultyLevel
  ): Samurai {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.SAMURAI_HEIGHT,
      width: GAME_CONSTANTS.SAMURAI_WIDTH,
      height: GAME_CONSTANTS.SAMURAI_HEIGHT,
      velocityX: this.getCurrentSamuraiSpeed(distance),
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

    // Use dynamic spawn distance based on difficulty level
    return (
      formattedDistance % gameState.difficultyLevel.samuraiSpawnDistance === 0
    );
  }

  static addSamurai(gameState: GameState): GameState {
    const newSamurai = this.createSamurai(
      gameState.distance,
      gameState.difficultyLevel
    );
    return {
      ...gameState,
      samurais: [...gameState.samurais, newSamurai],
    };
  }

  static createSamuraiBullet(
    samurai: Samurai,
    distance: number,
    difficultyLevel: DifficultyLevel
  ): SamuraiBullet {
    return {
      id: Date.now().toString() + Math.random(),
      x: samurai.x, // Start from samurai position
      y: samurai.y + samurai.height / 2, // Same height as samurai center
      width: GAME_CONSTANTS.SAMURAI_BULLET_WIDTH,
      height: GAME_CONSTANTS.SAMURAI_BULLET_HEIGHT,
      velocityX: difficultyLevel.samuraiBulletSpeed, // Use difficulty-based speed
      velocityY: 0, // No vertical movement
      color: SAMURAI_BULLET_COLORS.BODY,
    };
  }

  static updateSamuraiBullets(
    samuraiBullets: SamuraiBullet[]
  ): SamuraiBullet[] {
    return samuraiBullets
      .map((bullet) => ({
        ...bullet,
        x: bullet.x + bullet.velocityX,
        y: bullet.y + bullet.velocityY,
      }))
      .filter((bullet) => bullet.x > -bullet.width);
  }

  static makeSamuraiShoot(
    samurai: Samurai,
    distance: number,
    difficultyLevel: DifficultyLevel
  ): SamuraiBullet | null {
    const currentTime = Date.now();
    if (currentTime - samurai.lastShotTime >= samurai.shotCooldown) {
      return this.createSamuraiBullet(samurai, distance, difficultyLevel);
    }
    return null;
  }

  // ================================
  // COLLISION DETECTION
  // ================================

  static checkCollisions(gameState: GameState): GameState {
    let newGameState = gameState;

    // Check RiceRocket vs Enemy collisions
    newGameState = this.checkRiceRocketEnemyCollisions(newGameState);

    // Check Player vs SamuraiBullet collisions
    newGameState = this.checkPlayerSamuraiBulletCollisions(newGameState);

    // Check Player vs PowerUp collisions
    newGameState = this.checkPlayerPowerUpCollisions(newGameState);

    // Check if player was hit by a samurai bullet (game over)
    const originalBulletCount = gameState.samuraiBullets.length;
    const newBulletCount = newGameState.samuraiBullets.length;
    if (newBulletCount < originalBulletCount) {
      // A bullet was removed, meaning player was hit
      newGameState = {
        ...newGameState,
        isGameOver: true,
        isGameRunning: false,
      };
      return newGameState;
    }

    // Make enemies shoot
    newGameState = this.makeEnemiesShoot(newGameState);

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
    const { riceRockets, samurais } = gameState;
    const newRiceRockets = [...riceRockets];
    const newSamurais = [...samurais];

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
          }
          break;
        }
      }
    }

    return {
      ...gameState,
      riceRockets: newRiceRockets,
      samurais: newSamurais,
    };
  }

  static checkPlayerSamuraiBulletCollisions(gameState: GameState): GameState {
    const { player, samuraiBullets } = gameState;
    const newSamuraiBullets = [...samuraiBullets];

    // Check each samurai bullet against player
    for (let i = newSamuraiBullets.length - 1; i >= 0; i--) {
      const bullet = newSamuraiBullets[i];
      if (this.checkCollision(player, bullet)) {
        // If player has shield, just remove the bullet without game over
        if (player.hasShield) {
          newSamuraiBullets.splice(i, 1);
        } else {
          // Remove the bullet and trigger game over
          newSamuraiBullets.splice(i, 1);
          return {
            ...gameState,
            samuraiBullets: newSamuraiBullets,
            isGameOver: true,
            isGameRunning: false,
          };
        }
      }
    }

    return {
      ...gameState,
      samuraiBullets: newSamuraiBullets,
    };
  }

  static makeSamuraisShoot(gameState: GameState): GameState {
    const { samurais, samuraiBullets } = gameState;
    const newSamuraiBullets = [...samuraiBullets];
    const newSamurais = [...samurais];

    newSamurais.forEach((samurai, index) => {
      const bullet = this.makeSamuraiShoot(
        samurai,
        gameState.distance,
        gameState.difficultyLevel
      );
      if (bullet) {
        newSamuraiBullets.push(bullet);
        newSamurais[index] = {
          ...samurai,
          lastShotTime: Date.now(),
        };
      }
    });

    return {
      ...gameState,
      samurais: newSamurais,
      samuraiBullets: newSamuraiBullets,
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
    difficultyLevel: DifficultyLevel
  ): Ninja {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.NINJA_HEIGHT,
      width: GAME_CONSTANTS.NINJA_WIDTH,
      height: GAME_CONSTANTS.NINJA_HEIGHT,
      velocityX: GAME_CONSTANTS.NINJA_SPEED * difficultyLevel.speedMultiplier,
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
      gameState.difficultyLevel
    );
    return {
      ...gameState,
      ninjas: [...gameState.ninjas, newNinja],
    };
  }

  // ================================
  // BOSS MANAGEMENT
  // ================================

  static createBoss(distance: number, difficultyLevel: DifficultyLevel): Boss {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.BOSS_HEIGHT,
      width: GAME_CONSTANTS.BOSS_WIDTH,
      height: GAME_CONSTANTS.BOSS_HEIGHT,
      velocityX: GAME_CONSTANTS.BOSS_SPEED * difficultyLevel.speedMultiplier,
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
    const difficultyLevel = gameState.difficultyLevel;

    // Only spawn bosses at level 5+
    if (difficultyLevel.level < 5) return false;

    return formattedDistance % difficultyLevel.bossSpawnDistance === 0;
  }

  static addBoss(gameState: GameState): GameState {
    const newBoss = this.createBoss(
      gameState.distance,
      gameState.difficultyLevel
    );
    return {
      ...gameState,
      bosses: [...gameState.bosses, newBoss],
    };
  }

  // ================================
  // POWER-UP MANAGEMENT
  // ================================

  static createPowerUp(distance: number): PowerUp {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
    const powerUpTypes = Object.values(GAME_CONSTANTS.POWERUP_TYPES);
    const randomType =
      powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.POWERUP_HEIGHT,
      width: GAME_CONSTANTS.POWERUP_WIDTH,
      height: GAME_CONSTANTS.POWERUP_HEIGHT,
      velocityX: this.getCurrentSushiSpeed(distance),
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
    const newPowerUp = this.createPowerUp(gameState.distance);
    return {
      ...gameState,
      powerUps: [...gameState.powerUps, newPowerUp],
    };
  }

  static collectPowerUp(player: Player, powerUp: PowerUp): Player {
    const currentTime = Date.now();
    const endTime = currentTime + powerUp.duration;

    // Reset all power-up states first (only one power-up at a time)
    const resetPlayer = {
      ...player,
      hasShield: false,
      hasInfiniteAmmo: false,
      hasSpeedBoost: false,
      hasMultiShot: false,
      powerUpEndTimes: {
        shield: 0,
        infiniteAmmo: 0,
        speedBoost: 0,
        multiShot: 0,
      },
    };

    // Apply the new power-up
    switch (powerUp.type) {
      case "shield":
        return {
          ...resetPlayer,
          hasShield: true,
          powerUpEndTimes: { ...resetPlayer.powerUpEndTimes, shield: endTime },
        };
      case "infinite_ammo":
        return {
          ...resetPlayer,
          hasInfiniteAmmo: true,
          powerUpEndTimes: {
            ...resetPlayer.powerUpEndTimes,
            infiniteAmmo: endTime,
          },
        };
      case "speed_boost":
        return {
          ...resetPlayer,
          hasSpeedBoost: true,
          powerUpEndTimes: {
            ...resetPlayer.powerUpEndTimes,
            speedBoost: endTime,
          },
        };
      case "multi_shot":
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
      ...player,
      hasShield: currentTime < powerUpEndTimes.shield,
      hasInfiniteAmmo: currentTime < powerUpEndTimes.infiniteAmmo,
      hasSpeedBoost: currentTime < powerUpEndTimes.speedBoost,
      hasMultiShot: currentTime < powerUpEndTimes.multiShot,
    };
  }

  // ================================
  // ADDITIONAL COLLISION METHODS
  // ================================

  static checkRiceRocketNinjaCollisions(gameState: GameState): GameState {
    const { riceRockets, ninjas } = gameState;
    const newRiceRockets = [...riceRockets];
    const newNinjas = [...ninjas];

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
          }
          break;
        }
      }
    }

    return {
      ...gameState,
      riceRockets: newRiceRockets,
      ninjas: newNinjas,
    };
  }

  static checkRiceRocketBossCollisions(gameState: GameState): GameState {
    const { riceRockets, bosses } = gameState;
    const newRiceRockets = [...riceRockets];
    const newBosses = [...bosses];

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
          }
          break;
        }
      }
    }

    return {
      ...gameState,
      riceRockets: newRiceRockets,
      bosses: newBosses,
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

    // Make samurais shoot
    newGameState = this.makeSamuraisShoot(newGameState);

    // Make ninjas shoot
    newGameState = this.makeNinjasShoot(newGameState);

    // Make bosses shoot
    newGameState = this.makeBossesShoot(newGameState);

    return newGameState;
  }

  static makeNinjasShoot(gameState: GameState): GameState {
    const { ninjas, samuraiBullets } = gameState;
    const newSamuraiBullets = [...samuraiBullets];
    const newNinjas = [...ninjas];

    newNinjas.forEach((ninja, index) => {
      const bullet = this.makeSamuraiShoot(
        ninja,
        gameState.distance,
        gameState.difficultyLevel
      );
      if (bullet) {
        newSamuraiBullets.push(bullet);
        newNinjas[index] = {
          ...ninja,
          lastShotTime: Date.now(),
        };
      }
    });

    return {
      ...gameState,
      ninjas: newNinjas,
      samuraiBullets: newSamuraiBullets,
    };
  }

  static makeBossesShoot(gameState: GameState): GameState {
    const { bosses, samuraiBullets } = gameState;
    const newSamuraiBullets = [...samuraiBullets];
    const newBosses = [...bosses];

    newBosses.forEach((boss, index) => {
      const currentTime = Date.now();
      if (currentTime - boss.lastShotTime >= boss.shotCooldown) {
        // Boss shoots multiple bullets
        for (let i = 0; i < GAME_CONSTANTS.BOSS_MULTI_SHOT_COUNT; i++) {
          const bullet = this.createSamuraiBullet(
            boss,
            gameState.distance,
            gameState.difficultyLevel
          );
          // Adjust bullet positions for spread
          bullet.y = boss.y + boss.height / 2 + (i - 1) * 20;
          newSamuraiBullets.push(bullet);
        }
        newBosses[index] = {
          ...boss,
          lastShotTime: currentTime,
        };
      }
    });

    return {
      ...gameState,
      bosses: newBosses,
      samuraiBullets: newSamuraiBullets,
    };
  }
}

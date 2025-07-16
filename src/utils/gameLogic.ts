import {
  Player,
  GameState,
  RiceRocket,
  Sushi,
  Torii,
  Samurai,
  SamuraiBullet,
} from "@/types/game";
import { GAME_CONSTANTS } from "@/constants/game";
import {
  RICE_ROCKET_COLORS,
  SUSHI_COLORS,
  TORII_COLORS,
  SAMURAI_COLORS,
  SAMURAI_BULLET_COLORS,
} from "@/constants/colors";
import { player } from "@/entities/player";

export class GameLogic {
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
      samuraiBullets: [],
      distance: 0,
      isGameRunning: false,
      isGameOver: false,
    };
  }

  static updateGameState(gameState: GameState): GameState {
    if (!gameState.isGameRunning || gameState.isGameOver) {
      return gameState;
    }

    // Update all game entities
    const updatedPlayer = this.updatePlayerPhysics(gameState.player);
    const updatedRiceRockets = this.updateRiceRockets(gameState.riceRockets);
    const updatedSushis = this.updateSushis(gameState.sushis);
    const updatedToriis = this.updateToriis(gameState.toriis);
    const updatedSamurais = this.updateSamurais(gameState.samurais);
    const updatedSamuraiBullets = this.updateSamuraiBullets(
      gameState.samuraiBullets
    );
    const updatedDistance = this.updateDistance(gameState.distance);

    let newGameState = {
      ...gameState,
      player: updatedPlayer,
      riceRockets: updatedRiceRockets,
      sushis: updatedSushis,
      toriis: updatedToriis,
      samurais: updatedSamurais,
      samuraiBullets: updatedSamuraiBullets,
      distance: updatedDistance,
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

    // Update ammo recharge
    const currentTime = Date.now();
    const timeSinceLastRecharge = currentTime - player.lastAmmoRechargeTime;

    if (
      timeSinceLastRecharge >= GAME_CONSTANTS.AMMO_RECHARGE_INTERVAL &&
      player.riceRocketAmmo < player.maxRiceRocketAmmo
    ) {
      return {
        ...player,
        y: newY,
        velocityY: newVelocityY,
        riceRocketAmmo: Math.min(
          player.riceRocketAmmo + 1,
          player.maxRiceRocketAmmo
        ),
        lastAmmoRechargeTime: currentTime,
      };
    }

    return {
      ...player,
      y: newY,
      velocityY: newVelocityY,
    };
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
    // Check if player has ammo
    if (gameState.player.riceRocketAmmo <= 0) {
      return gameState; // Can't shoot without ammo
    }

    const newRiceRocket = this.createRiceRocket(gameState.player);
    return {
      ...gameState,
      riceRockets: [...gameState.riceRockets, newRiceRocket],
      player: {
        ...gameState.player,
        riceRocketAmmo: gameState.player.riceRocketAmmo - 1,
      },
    };
  }

  // ================================
  // SUSHI MANAGEMENT
  // ================================

  static createSushi(distance: number): Sushi {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - player.height, // Same height as player, on the ground
      width: player.width, // Same width as player
      height: player.height, // Same height as player
      velocityX: this.getCurrentSushiSpeed(distance),
      color: SUSHI_COLORS.BASE,
    };
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
    if (gameState.sushis.length === 0) {
      return gameState.distance > 100; // Start spawning after some distance
    }

    const lastSushi = gameState.sushis[gameState.sushis.length - 1];
    const distanceFromLast = GAME_CONSTANTS.CANVAS_WIDTH - lastSushi.x;

    // Calculate base spawn distance with more variance
    const baseSpawnDistance =
      GAME_CONSTANTS.SUSHI_MIN_SPAWN_DISTANCE +
      Math.random() *
        (GAME_CONSTANTS.SUSHI_MAX_SPAWN_DISTANCE -
          GAME_CONSTANTS.SUSHI_MIN_SPAWN_DISTANCE);

    // Add additional variance based on the variance constant
    const variance = baseSpawnDistance * GAME_CONSTANTS.SUSHI_SPACING_VARIANCE;
    const finalSpawnDistance =
      baseSpawnDistance + (Math.random() - 0.5) * variance;

    return distanceFromLast >= finalSpawnDistance;
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

  static createSamurai(distance: number): Samurai {
    const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

    return {
      id: Date.now().toString() + Math.random(),
      x: GAME_CONSTANTS.CANVAS_WIDTH,
      y: groundY - GAME_CONSTANTS.SAMURAI_HEIGHT,
      width: GAME_CONSTANTS.SAMURAI_WIDTH,
      height: GAME_CONSTANTS.SAMURAI_HEIGHT,
      velocityX: this.getCurrentSamuraiSpeed(distance),
      color: SAMURAI_COLORS.BODY,
      lives: GAME_CONSTANTS.SAMURAI_LIVES,
      maxLives: GAME_CONSTANTS.SAMURAI_LIVES,
      lastShotTime: Date.now(),
      shotCooldown: GAME_CONSTANTS.SAMURAI_SHOT_COOLDOWN,
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

    return formattedDistance % GAME_CONSTANTS.SAMURAI_SPAWN_DISTANCE === 0;
  }

  static addSamurai(gameState: GameState): GameState {
    const newSamurai = this.createSamurai(gameState.distance);
    return {
      ...gameState,
      samurais: [...gameState.samurais, newSamurai],
    };
  }

  static createSamuraiBullet(
    samurai: Samurai,
    distance: number
  ): SamuraiBullet {
    return {
      id: Date.now().toString() + Math.random(),
      x: samurai.x, // Start from samurai position
      y: samurai.y + samurai.height / 2, // Same height as samurai center
      width: GAME_CONSTANTS.SAMURAI_BULLET_WIDTH,
      height: GAME_CONSTANTS.SAMURAI_BULLET_HEIGHT,
      velocityX: this.getCurrentSamuraiBulletSpeed(distance), // Dynamic speed based on distance
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
    distance: number
  ): SamuraiBullet | null {
    const currentTime = Date.now();
    if (currentTime - samurai.lastShotTime >= samurai.shotCooldown) {
      return this.createSamuraiBullet(samurai, distance);
    }
    return null;
  }

  // ================================
  // COLLISION DETECTION
  // ================================

  static checkCollisions(gameState: GameState): GameState {
    let newGameState = gameState;

    // Check RiceRocket vs Samurai collisions
    newGameState = this.checkRiceRocketSamuraiCollisions(newGameState);

    // Check Player vs SamuraiBullet collisions
    newGameState = this.checkPlayerSamuraiBulletCollisions(newGameState);

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

    // Make samurais shoot
    newGameState = this.makeSamuraisShoot(newGameState);

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
        // Remove the bullet immediately (like sushi collision)
        newSamuraiBullets.splice(i, 1);
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
      const bullet = this.makeSamuraiShoot(samurai, gameState.distance);
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

  static checkGameOverConditions(gameState: GameState): boolean {
    // Check if player collides with sushi
    if (this.checkPlayerSushiCollisions(gameState)) {
      return true;
    }

    // Check if player collides with samurai
    if (this.checkPlayerSamuraiCollisions(gameState)) {
      return true;
    }

    return false;
  }
}

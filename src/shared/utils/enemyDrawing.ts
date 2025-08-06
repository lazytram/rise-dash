import { EnemyType } from "@/features/game/components/hooks/useEnemyData";

// Dimensions de chaque ennemi
export const ENEMY_DIMENSIONS = {
  samurai: { width: 40, height: 60 },
  ninja: { width: 35, height: 50 },
  boss: { width: 80, height: 100 },
};

// Couleurs des ennemis
export const ENEMY_COLORS = {
  samurai: {
    body: "#0066CC",
    armor: "#FFD700",
    helmet: "#0088FF",
    face: "#CC0000",
    weapon: "#C0C0C0",
  },
  ninja: {
    body: "#000000",
    suit: "#333333",
    hood: "#1a1a1a",
    mask: "#000000",
    weapon: "#800080",
  },
  boss: {
    body: "#8B0000",
    armor: "#4A4A4A",
    horns: "#2F4F4F",
    face: "#8B0000",
    weapon: "#8B4513",
  },
};

// Fonction générique pour centrer un ennemi
export const getCenteredPosition = (
  enemyType: EnemyType,
  canvasSize: number = 100
) => {
  const enemy = ENEMY_DIMENSIONS[enemyType];
  return {
    x: (canvasSize - enemy.width) / 2,
    y: (canvasSize - enemy.height) / 2,
  };
};

// Fonction générique pour dessiner un ennemi
export const drawEnemy = (
  ctx: CanvasRenderingContext2D,
  type: EnemyType,
  x: number,
  y: number,
  frame: number = 0,
  options: {
    detailed?: boolean;
    animated?: boolean;
    showShadow?: boolean;
  } = {}
) => {
  const { detailed = true, animated = true, showShadow = true } = options;

  switch (type) {
    case "samurai":
      drawSamurai(ctx, x, y, frame, { detailed, animated, showShadow });
      break;
    case "ninja":
      drawNinja(ctx, x, y, frame, { detailed, animated, showShadow });
      break;
    case "boss":
      drawBoss(ctx, x, y, frame, { detailed, animated, showShadow });
      break;
  }
};

// Fonctions de dessin spécifiques
const drawSamurai = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  options: { detailed: boolean; animated: boolean; showShadow: boolean }
) => {
  const { detailed, animated, showShadow } = options;
  const bounce = animated ? Math.sin(frame * 0.1) * 2 : 0;
  const colors = ENEMY_COLORS.samurai;

  // Shadow
  if (showShadow) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(x + 2, y + 58, 40, 8);
  }

  // Samurai body
  if (detailed) {
    const bodyGradient = ctx.createLinearGradient(x, y, x, y + 60);
    bodyGradient.addColorStop(0, colors.body);
    bodyGradient.addColorStop(0.3, "#0088FF");
    bodyGradient.addColorStop(0.7, colors.body);
    bodyGradient.addColorStop(1, "#004499");
    ctx.fillStyle = bodyGradient;
  } else {
    ctx.fillStyle = colors.body;
  }
  ctx.fillRect(x, y + bounce, 40, 60);

  if (detailed) {
    // Armor plates
    ctx.fillStyle = colors.armor;
    ctx.fillRect(x + 5, y + 5 + bounce, 30, 8);
    ctx.fillRect(x + 8, y + 13 + bounce, 24, 3);
    ctx.fillRect(x + 8, y + 20 + bounce, 24, 3);
    ctx.fillRect(x + 8, y + 27 + bounce, 24, 3);

    // Shoulder plates
    ctx.fillRect(x + 2, y + 8 + bounce, 6, 12);
    ctx.fillRect(x + 32, y + 8 + bounce, 6, 12);

    // Helmet
    const helmetGradient = ctx.createLinearGradient(x + 6, y, x + 34, y);
    helmetGradient.addColorStop(0, colors.body);
    helmetGradient.addColorStop(0.5, "#0088FF");
    helmetGradient.addColorStop(1, colors.body);
    ctx.fillStyle = helmetGradient;
    ctx.fillRect(x + 6, y + bounce, 28, 15);

    // Helmet top
    ctx.fillStyle = "#004499";
    ctx.fillRect(x + 8, y - 2 + bounce, 24, 4);

    // Helmet crest
    ctx.fillStyle = colors.armor;
    ctx.fillRect(x + 12, y - 6 + bounce + Math.sin(frame * 0.2) * 1, 4, 8);
    ctx.fillRect(x + 24, y - 6 + bounce + Math.sin(frame * 0.2 + 1) * 1, 4, 8);

    // Helmet decorations
    ctx.fillRect(x + 4, y + 2 + bounce, 3, 8);
    ctx.fillRect(x + 33, y + 2 + bounce, 3, 8);
  }

  // Face mask
  ctx.fillStyle = colors.face;
  ctx.fillRect(x + 10, y + 8 + bounce, 20, 8);

  if (detailed) {
    // Mask details
    ctx.fillStyle = "#8B0000";
    ctx.fillRect(x + 12, y + 10 + bounce, 16, 2);
    ctx.fillRect(x + 12, y + 14 + bounce, 16, 2);

    // Eyes
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(x + 12, y + 10 + bounce, 16, 2);
    ctx.fillRect(x + 12, y + 14 + bounce, 16, 2);

    // Eye highlights
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillRect(x + 13, y + 10 + bounce, 2, 2);
    ctx.fillRect(x + 25, y + 10 + bounce, 2, 2);
  }

  // Katana
  ctx.fillStyle = colors.weapon;
  ctx.fillRect(x + 15, y + 20 + bounce, 10, 2);

  if (detailed) {
    // Katana handle
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(x + 25, y + 19 + bounce, 3, 4);

    // Katana shine
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(x + 16, y + 20 + bounce, 8, 1);

    // Katana guard
    ctx.fillStyle = colors.armor;
    ctx.fillRect(x + 14, y + 18 + bounce, 12, 2);
  }
};

const drawNinja = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  options: { detailed: boolean; animated: boolean; showShadow: boolean }
) => {
  const { detailed, animated, showShadow } = options;
  const stealth = animated ? Math.sin(frame * 0.15) * 3 : 0;
  const colors = ENEMY_COLORS.ninja;

  // Shadow
  if (showShadow) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(x + 2, y + 48, 35, 8);
  }

  // Ninja body
  if (detailed) {
    const bodyGradient = ctx.createLinearGradient(x, y, x, y + 50);
    bodyGradient.addColorStop(0, colors.body);
    bodyGradient.addColorStop(0.5, "#1a1a1a");
    bodyGradient.addColorStop(1, colors.body);
    ctx.fillStyle = bodyGradient;
  } else {
    ctx.fillStyle = colors.body;
  }
  ctx.fillRect(x, y + stealth, 35, 50);

  if (detailed) {
    // Ninja suit details
    ctx.fillStyle = colors.suit;
    ctx.fillRect(x + 5, y + 5 + stealth, 25, 8);
    ctx.fillRect(x + 8, y + 15 + stealth, 19, 3);
    ctx.fillRect(x + 8, y + 25 + stealth, 19, 3);
    ctx.fillRect(x + 8, y + 35 + stealth, 19, 3);

    // Hood
    const hoodGradient = ctx.createLinearGradient(x + 5, y, x + 30, y);
    hoodGradient.addColorStop(0, colors.body);
    hoodGradient.addColorStop(0.5, "#1a1a1a");
    hoodGradient.addColorStop(1, colors.body);
    ctx.fillStyle = hoodGradient;
    ctx.fillRect(x + 5, y + stealth, 25, 15);

    // Hood top
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(x + 8, y - 3 + stealth, 19, 6);

    // Hood flaps
    ctx.fillStyle = colors.body;
    ctx.fillRect(x - 2 + Math.sin(frame * 0.1) * 1, y + 2 + stealth, 6, 12);
    ctx.fillRect(
      x + 31 + Math.sin(frame * 0.1 + 1) * 1,
      y + 2 + stealth,
      6,
      12
    );
  }

  // Mask
  ctx.fillStyle = colors.mask;
  ctx.fillRect(x + 8, y + 5 + stealth, 19, 10);

  if (detailed) {
    // Mask details
    ctx.fillStyle = colors.suit;
    ctx.fillRect(x + 10, y + 7 + stealth, 15, 2);
    ctx.fillRect(x + 10, y + 11 + stealth, 15, 2);

    // Eyes
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x + 12, y + 7 + stealth, 4, 3);
    ctx.fillRect(x + 24, y + 7 + stealth, 4, 3);

    // Eye pupils
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + 13 + Math.sin(frame * 0.05) * 1, y + 8 + stealth, 2, 1);
    ctx.fillRect(
      x + 25 + Math.sin(frame * 0.05 + 1) * 1,
      y + 8 + stealth,
      2,
      1
    );
  }

  // Shuriken
  if (detailed) {
    ctx.save();
    const centerX = x + 17.5;
    const centerY = y + 25 + stealth;
    ctx.translate(centerX, centerY);
    ctx.rotate(frame * 0.1);

    ctx.fillStyle = colors.weapon;
    ctx.fillRect(-2, -8, 4, 16);
    ctx.fillRect(-8, -2, 16, 4);

    ctx.fillStyle = "#FFD700";
    ctx.fillRect(-1, -1, 2, 2);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillRect(-1.5, -6, 3, 12);
    ctx.fillRect(-6, -1.5, 12, 3);

    ctx.restore();
  }
};

const drawBoss = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  options: { detailed: boolean; animated: boolean; showShadow: boolean }
) => {
  const { detailed, animated, showShadow } = options;
  const stomp = animated ? Math.sin(frame * 0.08) * 3 : 0;
  const eyeGlow = animated ? Math.sin(frame * 0.2) * 0.3 + 0.7 : 0.7;
  const colors = ENEMY_COLORS.boss;

  // Shadow
  if (showShadow) {
    ctx.fillStyle = "rgba(139, 0, 0, 0.4)";
    ctx.fillRect(x + 4, y + 98, 80, 12);
  }

  // Boss body
  if (detailed) {
    const bodyGradient = ctx.createLinearGradient(x, y, x, y + 100);
    bodyGradient.addColorStop(0, colors.body);
    bodyGradient.addColorStop(0.3, "#A00000");
    bodyGradient.addColorStop(0.7, colors.body);
    bodyGradient.addColorStop(1, "#660000");
    ctx.fillStyle = bodyGradient;
  } else {
    ctx.fillStyle = colors.body;
  }
  ctx.fillRect(x, y + stomp, 80, 100);

  if (detailed) {
    // Armor plates
    ctx.fillStyle = colors.armor;
    ctx.fillRect(x + 10, y + 10 + stomp, 60, 8);
    ctx.fillRect(x + 15, y + 25 + stomp, 50, 6);
    ctx.fillRect(x + 15, y + 40 + stomp, 50, 6);
    ctx.fillRect(x + 15, y + 55 + stomp, 50, 6);

    // Horns
    ctx.fillStyle = colors.horns;
    ctx.fillRect(x + 15, y - 15 + stomp, 8, 20);
    ctx.fillRect(x + 25, y - 12 + stomp, 8, 18);
    ctx.fillRect(x + 35, y - 15 + stomp, 8, 20);
    ctx.fillRect(x + 45, y - 12 + stomp, 8, 18);

    // Horn details
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(x + 16, y - 14 + stomp, 6, 18);
    ctx.fillRect(x + 26, y - 11 + stomp, 6, 16);
    ctx.fillRect(x + 36, y - 14 + stomp, 6, 18);
    ctx.fillRect(x + 46, y - 11 + stomp, 6, 16);

    // Horn glow
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(x + 17, y - 13 + stomp, 4, 16);
    ctx.fillRect(x + 27, y - 10 + stomp, 4, 14);
    ctx.fillRect(x + 37, y - 13 + stomp, 4, 16);
    ctx.fillRect(x + 47, y - 10 + stomp, 4, 14);
  }

  // Face
  ctx.fillStyle = colors.face;
  ctx.fillRect(x + 10, y + 5 + stomp, 60, 25);

  if (detailed) {
    // Face details
    ctx.fillStyle = "#660000";
    ctx.fillRect(x + 15, y + 8 + stomp, 50, 3);
    ctx.fillRect(x + 15, y + 15 + stomp, 50, 3);

    // Eyes
    ctx.fillStyle = `rgba(255, 215, 0, ${eyeGlow})`;
    ctx.fillRect(x + 15, y + 10 + stomp, 6, 8);
    ctx.fillRect(x + 25, y + 10 + stomp, 6, 8);
    ctx.fillRect(x + 35, y + 10 + stomp, 6, 8);
    ctx.fillRect(x + 45, y + 10 + stomp, 6, 8);

    // Eye pupils
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + 17, y + 12 + stomp, 2, 4);
    ctx.fillRect(x + 27, y + 12 + stomp, 2, 4);
    ctx.fillRect(x + 37, y + 12 + stomp, 2, 4);
    ctx.fillRect(x + 47, y + 12 + stomp, 2, 4);

    // Mouth
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + 20, y + 20 + stomp, 40, 3);
    ctx.fillRect(x + 18, y + 23 + stomp, 44, 2 + Math.sin(frame * 0.1) * 1);

    // Teeth
    ctx.fillStyle = "#FFFFFF";
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(x + 22 + i * 8, y + 21 + stomp, 2, 2);
    }
  }

  // Weapon
  ctx.fillStyle = colors.weapon;
  ctx.fillRect(x + 15, y + 25 + stomp, 10, 40);

  if (detailed) {
    // Weapon handle
    ctx.fillStyle = "#654321";
    ctx.fillRect(x + 17, y + 65 + stomp, 6, 15);

    // Weapon spikes
    ctx.fillStyle = colors.armor;
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(x + 16 + i * 3, y + 27 + stomp, 2, 8);
    }

    // Weapon shine
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillRect(x + 16, y + 26 + stomp, 8, 38);
  }
};

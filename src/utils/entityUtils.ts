import { GAME_CONSTANTS } from "@/constants/game";

export const generateId = (): string => {
  return Date.now().toString() + Math.random();
};

export const getGroundY = (): number => {
  return GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;
};

export const formatDistance = (distance: number): number => {
  return Math.floor(distance / 10);
};

export const updateMovingEntities = <
  T extends { x: number; velocityX: number; width?: number }
>(
  entities: T[],
  boundaryX: number
): T[] => {
  return entities
    .map((entity) => ({
      ...entity,
      x: entity.x + entity.velocityX,
    }))
    .filter((entity) => {
      if (boundaryX > 0) {
        return entity.x < boundaryX; // Right boundary
      } else {
        return entity.x > boundaryX; // Left boundary
      }
    });
};

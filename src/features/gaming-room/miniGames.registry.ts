import { SceneType } from "@/shared/types/scenes";

export type MiniGameStatus = "available" | "coming_soon";

export interface MiniGameDefinition {
  /**
   * Stable identifier used as key in lists and analytics.
   */
  id: string;
  /**
   * i18n key for the game's display title.
   */
  titleKey: string;
  /**
   * i18n key for the short description shown in the Bento card.
   */
  descriptionKey: string;
  /**
   * Optional scene that opens when the game is available.
   * If omitted, the card will render as Coming Soon.
   */
  scene?: SceneType;
  /**
   * Availability status for the game card.
   */
  status: MiniGameStatus;
  /**
   * Optional emoji/icon string to render on the badge or card.
   */
  icon?: string;
}

/**
 * Central registry for Bento mini-games.
 * To add a new game, append a new entry here.
 */
export const miniGamesRegistry: MiniGameDefinition[] = [
  {
    id: "daily-reveal",
    titleKey: "scenes.gamingRoom.items.dailyReveal.title",
    descriptionKey: "scenes.gamingRoom.items.dailyReveal.description",
    scene: SceneType.DAILY_REVEAL,
    status: "available",
    icon: "🍚",
  },
  {
    id: "memory-flip",
    titleKey: "scenes.memoryFlip.title",
    descriptionKey: "scenes.memoryFlip.subtitle",
    scene: SceneType.MEMORY_FLIP,
    status: "available",
    icon: "🧠",
  },
  {
    id: "tape-rice",
    titleKey: "scenes.tapeRice.title",
    descriptionKey: "scenes.tapeRice.subtitle",
    scene: SceneType.TAPE_RICE,
    status: "available",
    icon: "🦝",
  },
  {
    id: "coming-soon-2",
    titleKey: "scenes.gamingRoom.items.comingSoon2.title",
    descriptionKey: "scenes.gamingRoom.items.comingSoon2.description",
    status: "coming_soon",
    icon: "🎮",
  },
];

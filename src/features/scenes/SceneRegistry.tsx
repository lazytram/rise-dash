import { SceneConfig, SceneType } from "@/shared/types/scenes";
import { WelcomeScene } from "../welcome/WelcomeScene";
import { GameScene } from "../game/GameScene";
import { ProfileScene } from "../profile/ProfileScene";
import { LeaderboardScene } from "../leaderboard/LeaderboardScene";
import { InstructionsScene } from "../instructions/InstructionsScene";
import { ShopScene } from "../shop/ShopScene";
import { DailyRevealScene } from "../daily-reveal/DailyRevealScene";
import { GamingRoomScene } from "../gaming-room/GamingRoomScene";
import { MemoryFlipScene } from "../memory-flip/MemoryFlipScene";
import { TapeRiceScene } from "../tape-rice/TapeRiceScene";
import { DojoScene } from "../dojo/DojoScene";
import { DojoDetailScene } from "../dojo/DojoDetailScene";

export const scenes: SceneConfig[] = [
  {
    id: SceneType.DOJO,
    component: DojoScene,
    title: "Dojo",
    showHeader: true,
  },
  {
    id: SceneType.DOJO_DETAIL,
    component: DojoDetailScene,
    title: "Dojo Details",
    showHeader: true,
  },
  {
    id: SceneType.WELCOME,
    component: WelcomeScene,
    title: "Welcome",
    showHeader: false,
  },
  {
    id: SceneType.GAME,
    component: GameScene,
    title: "Game",
    showHeader: true,
  },
  {
    id: SceneType.PROFILE,
    component: ProfileScene,
    title: "Profile",
    showHeader: true,
  },
  {
    id: SceneType.LEADERBOARD,
    component: LeaderboardScene,
    title: "Leaderboard",
    showHeader: true,
  },
  {
    id: SceneType.INSTRUCTIONS,
    component: InstructionsScene,
    title: "Instructions",
    showHeader: true,
  },
  {
    id: SceneType.SHOP,
    component: ShopScene,
    title: "Shop",
    showHeader: true,
  },
  {
    id: SceneType.DAILY_REVEAL,
    component: DailyRevealScene,
    title: "Daily Reveal",
    showHeader: true,
  },
  {
    id: SceneType.GAMING_ROOM,
    component: GamingRoomScene,
    title: "Gaming Room",
    showHeader: true,
  },
  {
    id: SceneType.MEMORY_FLIP,
    component: MemoryFlipScene,
    title: "Memory Flip",
    showHeader: true,
  },
  {
    id: SceneType.TAPE_RICE,
    component: TapeRiceScene,
    title: "Mogu-Raisu",
    showHeader: true,
  },
];

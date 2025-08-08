import { SceneConfig, SceneType } from "@/shared/types/scenes";
import { WelcomeScene } from "../welcome/WelcomeScene";
import { GameScene } from "../game/GameScene";
import { ProfileScene } from "../profile/ProfileScene";
import { LeaderboardScene } from "../leaderboard/LeaderboardScene";
import { InstructionsScene } from "../instructions/InstructionsScene";
import { ShopScene } from "../shop/ShopScene";
import { DailyRevealScene } from "../daily-reveal/DailyRevealScene";

export const scenes: SceneConfig[] = [
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
];

import { Scene, SceneType } from "../../types/scenes";
import { WelcomeScene } from "./WelcomeScene";
import { GameScene } from "./GameScene";
import { ProfileScene } from "./ProfileScene";
import { LeaderboardScene } from "./LeaderboardScene";
import { InstructionsScene } from "./InstructionsScene";
import { ShopScene } from "./ShopScene";
import { DailyRevealScene } from "./DailyRevealScene";

export const scenes: Scene[] = [
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

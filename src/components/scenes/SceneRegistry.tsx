import { SceneType, Scene } from "@/types/scenes";
import { WelcomeScene } from "@/components/scenes/WelcomeScene";
import { GameScene } from "@/components/scenes/GameScene";
import { ProfileScene } from "@/components/scenes/ProfileScene";
import { LeaderboardScene } from "@/components/scenes/LeaderboardScene";
import { InstructionsScene } from "@/components/scenes/InstructionsScene";

export const SceneRegistry: Record<SceneType, Scene> = {
  welcome: {
    id: "welcome",
    component: WelcomeScene,
    title: "Welcome",
    showHeader: false,
  },
  game: {
    id: "game",
    component: GameScene,
    title: "Game",
    showHeader: true,
  },
  profile: {
    id: "profile",
    component: ProfileScene,
    title: "Profile",
    showHeader: true,
  },
  leaderboard: {
    id: "leaderboard",
    component: LeaderboardScene,
    title: "Leaderboard",
    showHeader: true,
  },
  instructions: {
    id: "instructions",
    component: InstructionsScene,
    title: "Instructions",
    showHeader: true,
  },
};

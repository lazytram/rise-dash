"use client";

import { memo, useMemo } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { Button } from "./Button";
import { AuthButton } from "@/features/auth/AuthButton";
import { LanguageSelector } from "./LanguageSelector";
import { RiceLogo } from "./RiceLogo";
import { cn } from "@/shared/utils/cn";

export const Navbar = memo(function Navbar() {
  const { isConnected } = useAccount();
  const { data: session, status } = useSession();
  const { currentScene, setScene } = useSceneStore();

  const isAuthenticated = useMemo(() => {
    return isConnected && session && status === "authenticated";
  }, [isConnected, session, status]);

  const handleNavigation = (scene: SceneType) => {
    setScene(scene);
  };

  const isActive = (scene: SceneType) => {
    return currentScene === scene;
  };

  // Groupes de navigation
  const gameGroup = [{ scene: SceneType.GAME, label: "Play" }];

  const profileGroup = [
    { scene: SceneType.PROFILE, label: "Profile" },
    { scene: SceneType.LEADERBOARD, label: "Leaderboard" },
  ];

  const featuresGroup = [
    { scene: SceneType.SHOP, label: "Shop" },
    { scene: SceneType.INSTRUCTIONS, label: "Help" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 glass-light backdrop-blur-2xl border-b border-primary/20 shadow-lg transition-all duration-300 h-16"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between h-16 transition-all duration-300"
          )}
        >
          {/* Logo - Always on the left */}
          <div className="flex items-center">
            <button
              onClick={() => setScene(SceneType.WELCOME)}
              className="flex items-center hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <RiceLogo
                className={cn("w-auto h-8 transition-all duration-300")}
              />
            </button>
          </div>

          {/* Navigation Links - Only show when authenticated */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              {/* Game Group */}
              <div className="flex items-center space-x-3">
                {gameGroup.map(({ scene, label }) => (
                  <Button
                    key={scene}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation(scene)}
                    className={cn(
                      "transition-all duration-200",
                      isActive(scene)
                        ? "text-primary bg-primary-light border border-primary/30 shadow-md opacity-100"
                        : "text-foreground hover:text-primary hover:bg-primary-light/50 opacity-80 hover:opacity-100"
                    )}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              {/* Separator */}
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

              {/* Profile Group */}
              <div className="flex items-center space-x-3">
                {profileGroup.map(({ scene, label }) => (
                  <Button
                    key={scene}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation(scene)}
                    className={cn(
                      "transition-all duration-200",
                      isActive(scene)
                        ? "text-primary bg-primary-light border border-primary/30 shadow-md opacity-100"
                        : "text-foreground hover:text-primary hover:bg-primary-light/50 opacity-80 hover:opacity-100"
                    )}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              {/* Separator */}
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

              {/* Features Group */}
              <div className="flex items-center space-x-3">
                {featuresGroup.map(({ scene, label }) => (
                  <Button
                    key={scene}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation(scene)}
                    className={cn(
                      "transition-all duration-200",
                      isActive(scene)
                        ? "text-primary bg-primary-light border border-primary/30 shadow-md opacity-100"
                        : "text-foreground hover:text-primary hover:bg-primary-light/50 opacity-80 hover:opacity-100"
                    )}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Right side - Auth and Language */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <AuthButton />
          </div>
        </div>
      </div>

      {/* Mobile menu - Only show when authenticated */}
      {isAuthenticated && (
        <div className="md:hidden glass-light backdrop-blur-2xl border-t border-primary/20 transition-all duration-300">
          <div className="px-4 py-3 space-y-3">
            {/* Game Group */}
            <div className="flex justify-center space-x-2">
              {gameGroup.map(({ scene, label }) => (
                <Button
                  key={scene}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(scene)}
                  className={cn(
                    "transition-all duration-200",
                    isActive(scene)
                      ? "text-primary bg-primary-light border border-primary/30 shadow-md opacity-100"
                      : "text-foreground opacity-70 hover:text-primary"
                  )}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Profile Group */}
            <div className="flex justify-center space-x-2">
              {profileGroup.map(({ scene, label }) => (
                <Button
                  key={scene}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(scene)}
                  className={cn(
                    "transition-all duration-200",
                    isActive(scene)
                      ? "text-primary bg-primary-light border border-primary/30 shadow-md opacity-100"
                      : "text-foreground opacity-70 hover:text-primary"
                  )}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Features Group */}
            <div className="flex justify-center space-x-2">
              {featuresGroup.map(({ scene, label }) => (
                <Button
                  key={scene}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(scene)}
                  className={cn(
                    "transition-all duration-200",
                    isActive(scene)
                      ? "text-primary bg-primary-light border border-primary/30 shadow-md opacity-100"
                      : "text-foreground opacity-70 hover:text-primary"
                  )}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
});

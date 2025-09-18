"use client";

import { memo, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useSceneStore } from "@/infrastructure/store/sceneStore";
import { SceneType } from "@/shared/types/scenes";
import { Button } from "./Button";
import { AuthButton } from "@/features/auth/AuthButton";
import { LanguageSelector } from "./LanguageSelector";
import { RiceLogo } from "./RiceLogo";
import { cn } from "@/shared/utils/cn";
import { useTranslations } from "@/shared/hooks/useTranslations";

export const Navbar = memo(function Navbar() {
  const { t } = useTranslations();
  const { isConnected } = useAccount();
  const { data: session, status } = useSession();
  const { currentScene, setScene } = useSceneStore();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const ENABLE_DOJO = false; // Feature flag to show/hide Dojo entry

  const isAuthenticated = useMemo(() => {
    return isConnected && session && status === "authenticated";
  }, [isConnected, session, status]);

  const handleNavigation = (scene: SceneType) => {
    setScene(scene);
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  };

  const isActive = (scene: SceneType) => {
    return currentScene === scene;
  };

  // Groupes de navigation
  const gameGroup = [{ scene: SceneType.GAME, label: t("nav.play") }];

  const profileGroup = [
    { scene: SceneType.PROFILE, label: t("nav.profile") },
    { scene: SceneType.LEADERBOARD, label: t("nav.leaderboard") },
  ];

  const featuresGroup = [
    { scene: SceneType.GAMING_ROOM, label: t("nav.gamingRoom") },
    { scene: SceneType.SHOP, label: t("nav.shop") },
    { scene: SceneType.INSTRUCTIONS, label: t("nav.help") },
    ...(ENABLE_DOJO ? [{ scene: SceneType.DOJO, label: t("nav.dojo") }] : []),
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
              onClick={() => {
                setScene(SceneType.WELCOME);
              }}
              className="flex items-center hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <RiceLogo
                className={cn("w-auto h-8 transition-all duration-300")}
              />
            </button>
          </div>

          {/* Navigation Links - Only show when authenticated */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {/* Game Group */}
              <div className="flex items-center space-x-2 xl:space-x-3">
                {gameGroup.map(({ scene, label }) => (
                  <Button
                    key={scene}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation(scene)}
                    className={cn(
                      "transition-all duration-200 whitespace-nowrap",
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
              <div className="flex items-center space-x-2 xl:space-x-3">
                {profileGroup.map(({ scene, label }) => (
                  <Button
                    key={scene}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation(scene)}
                    className={cn(
                      "transition-all duration-200 whitespace-nowrap",
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
              <div className="flex items-center space-x-2 xl:space-x-3">
                {featuresGroup.map(({ scene, label }) => (
                  <Button
                    key={scene}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation(scene)}
                    className={cn(
                      "transition-all duration-200 whitespace-nowrap",
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

          {/* Right side - Auth, Language, Burger (CSS-native) */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <AuthButton />
            {isAuthenticated && (
              <details ref={mobileMenuRef} className="lg:hidden relative">
                <summary className="list-none inline-flex items-center justify-center p-2 rounded-lg border border-primary/20 glass hover:scale-105 transition-all duration-200 cursor-pointer select-none">
                  <span className="relative block w-5 h-5">
                    <span className="absolute left-0 right-0 top-1 h-0.5 bg-foreground" />
                    <span className="absolute left-0 right-0 top-2.5 h-0.5 bg-foreground" />
                    <span className="absolute left-0 right-0 top-4 h-0.5 bg-foreground" />
                  </span>
                </summary>
                <div className="fixed top-16 left-0 right-0 z-40 glass-light backdrop-blur-2xl border-t border-primary/20">
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
                            "transition-all duration-200 whitespace-nowrap",
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
                            "transition-all duration-200 whitespace-nowrap",
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
                            "transition-all duration-200 whitespace-nowrap",
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
              </details>
            )}
          </div>
        </div>
      </div>

      {/* CSS-native details/summary handles the burger menu – no React state needed */}
    </nav>
  );
});

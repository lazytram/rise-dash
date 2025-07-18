import { useEffect, useRef, useCallback } from "react";
import {
  getPowerUpService,
  LocalPowerUpService,
} from "@/services/powerUpService";
import { Player } from "@/types/game";

export const usePowerUpSync = (
  player: Player,
  setPlayer: (player: Player) => void
) => {
  const setPlayerRef = useRef<(player: Player) => void>(setPlayer);
  const hasInitializedRef = useRef(false);

  // Update the ref whenever setPlayer changes
  useEffect(() => {
    setPlayerRef.current = setPlayer;
  }, [setPlayer]);

  // Only sync once on mount to avoid infinite loops
  useEffect(() => {
    if (hasInitializedRef.current) return;

    const service = getPowerUpService() as LocalPowerUpService;
    const serviceLevels = service.getLevels();

    // Update player's power-up levels from service
    setPlayerRef.current({
      ...player,
      powerUpLevels: serviceLevels,
      maxRiceRocketAmmo: service.getMaxAmmo(),
      riceRocketAmmo: Math.min(player.riceRocketAmmo, service.getMaxAmmo()),
    });

    hasInitializedRef.current = true;
  }, []); // Only run on mount

  // Function to sync player levels back to service (if needed)
  const syncToService = useCallback(() => {
    const service = getPowerUpService() as LocalPowerUpService;
    service.setLevels(player.powerUpLevels);
  }, [player.powerUpLevels]);

  // Function to manually sync from service (useful when service levels change externally)
  const syncFromService = useCallback(() => {
    const service = getPowerUpService() as LocalPowerUpService;
    const serviceLevels = service.getLevels();

    setPlayerRef.current({
      ...player,
      powerUpLevels: serviceLevels,
      maxRiceRocketAmmo: service.getMaxAmmo(),
      riceRocketAmmo: Math.min(player.riceRocketAmmo, service.getMaxAmmo()),
    });
  }, [player]);

  return { syncToService, syncFromService };
};

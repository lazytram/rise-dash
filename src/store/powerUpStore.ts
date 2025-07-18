import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PowerUpLevels } from "@/types/shop";
import {
  getPowerUpService,
  LocalPowerUpService,
} from "@/services/powerUpService";

interface PowerUpStore {
  powerUpLevels: PowerUpLevels;
  riceBalance: number;
  setPowerUpLevel: (type: keyof PowerUpLevels, level: number) => void;
  setRiceBalance: (balance: number) => void;
  resetPowerUpLevels: () => void;
  syncWithService: () => void;
}

const defaultPowerUpLevels: PowerUpLevels = {
  shield: 1,
  infiniteAmmo: 1,
  speedBoost: 1,
  multiShot: 1,
  riceRocketAmmo: 1,
};

export const usePowerUpStore = create<PowerUpStore>()(
  persist(
    (set, get) => ({
      powerUpLevels: defaultPowerUpLevels,
      riceBalance: 200,
      setPowerUpLevel: (type, level) => {
        set((state) => ({
          powerUpLevels: {
            ...state.powerUpLevels,
            [type]: level,
          },
        }));
        // Sync with service
        const service = getPowerUpService() as LocalPowerUpService;
        service.setLevels(get().powerUpLevels);
      },
      setRiceBalance: (balance) => {
        set({ riceBalance: balance });
        // Sync with service
        const service = getPowerUpService() as LocalPowerUpService;
        service.setRiceBalance(balance);
      },
      resetPowerUpLevels: () => {
        set({ powerUpLevels: defaultPowerUpLevels });
        // Sync with service
        const service = getPowerUpService() as LocalPowerUpService;
        service.resetLevels();
      },
      syncWithService: () => {
        const service = getPowerUpService() as LocalPowerUpService;
        set({
          powerUpLevels: service.getLevels(),
          riceBalance: service.getRiceBalance(),
        });
      },
    }),
    {
      name: "powerup-store",
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Sync service with restored state
          const service = getPowerUpService() as LocalPowerUpService;
          service.setLevels(state.powerUpLevels);
          service.setRiceBalance(state.riceBalance);
        }
      },
    }
  )
);

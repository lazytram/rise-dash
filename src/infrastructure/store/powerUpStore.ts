import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PowerUpLevels, PowerUpType } from "@/shared/types/powerUps";
import {
  getPowerUpService,
  LocalPowerUpService,
} from "@/shared/services/powerUpService";
import { StoreKeys } from "./storeKeys";

interface PowerUpStore {
  powerUpLevels: PowerUpLevels;
  riceBalance: number;
  setPowerUpLevel: (type: PowerUpType, level: number) => void;
  setRiceBalance: (balance: number) => void;
  resetPowerUpLevels: () => void;
  syncWithService: () => void;
}

const defaultPowerUpLevels: PowerUpLevels = {
  [PowerUpType.SHIELD]: 1,
  [PowerUpType.INFINITE_AMMO]: 1,
  [PowerUpType.JUMP_BOOST]: 1,
  [PowerUpType.SLOW_MOTION]: 1,
  [PowerUpType.MULTI_SHOT]: 1,
  [PowerUpType.RICE_ROCKET_AMMO]: 1,
  [PowerUpType.PHOENIX_PACT]: 1,
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
      name: StoreKeys.PowerUpStore,
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

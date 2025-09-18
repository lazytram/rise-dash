import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKeys } from "./storeKeys";

export type DojoHouse = "akaTora" | "aoiTsuru" | "midoriRyuu" | "koganeKitsune";

interface DojoState {
  selectedHouse?: DojoHouse;
  setHouse: (house: DojoHouse) => void;
  reset: () => void;
}

export const useDojoStore = create<DojoState>()(
  persist(
    (set) => ({
      selectedHouse: undefined,
      setHouse: (house: DojoHouse) => set({ selectedHouse: house }),
      reset: () => set({ selectedHouse: undefined }),
    }),
    { name: StoreKeys.DojoStore }
  )
);

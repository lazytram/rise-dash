import { blockchainService } from "@/infrastructure/blockchain/blockchainService";
import type { SeasonMeta } from "./types";

export const seasonsService = {
  async fetchAllMeta(): Promise<SeasonMeta[]> {
    const metas = await blockchainService.getAllSeasonsMeta();
    return metas.map((m) => ({
      id: m.id,
      startTimeMs: m.startTimeMs,
      endTimeMs: m.endTimeMs,
      uri: m.uri,
    }));
  },
};





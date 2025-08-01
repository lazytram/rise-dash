import { useDailyRevealStore } from "../store";
import { DailyRevealService } from "@/shared/services/dailyRevealService";
import { CardRarity, CardType } from "@/shared/types/dailyReveal";

// Mock the DailyRevealService
jest.mock("@/shared/services/dailyRevealService", () => ({
  DailyRevealService: {
    getRandomCard: jest.fn(),
  },
}));

const mockGetRandomCard =
  DailyRevealService.getRandomCard as jest.MockedFunction<
    typeof DailyRevealService.getRandomCard
  >;

describe("DailyReveal Store", () => {
  beforeEach(() => {
    // Clear all mocks and store state before each test
    jest.clearAllMocks();
    useDailyRevealStore.getState().dataByAddress = {};

    // Mock environment
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "test",
      writable: true,
    });

    return () => {
      Object.defineProperty(process.env, "NODE_ENV", {
        value: originalEnv,
        writable: true,
      });
    };
  });

  describe("getDataForAddress", () => {
    it("should create initial data for new address", () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      const data = store.getDataForAddress(address);

      expect(data).toBeDefined();
      expect(data.canReveal).toBe(true); // In test mode, cooldown is expired
      expect(data.cardState.isRevealing).toBe(false);
      expect(data.cardState.selectedCard).toBe(null);
      expect(data.cardState.isRevealed).toBe(false);
    });

    it("should return existing data for known address", () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      // Get data first time
      const data1 = store.getDataForAddress(address);
      data1.canReveal = false; // Modify the data

      // Get data second time
      const data2 = store.getDataForAddress(address);

      expect(data2).toBe(data1); // Should be the same object
      expect(data2.canReveal).toBe(false);
    });
  });

  describe("isCooldownExpired", () => {
    it("should return true for new address", () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      const result = store.isCooldownExpired(address);

      expect(result).toBe(true);
    });

    it("should return false when last reveal was recent", () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      // Set a recent reveal time
      store.setLastRevealTime(
        address,
        Date.now() - 12 * 60 * 60 * 1000,
        100,
        "test-hash"
      );

      const result = store.isCooldownExpired(address);

      expect(result).toBe(false);
    });

    it("should return true when last reveal was old", () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      // Set an old reveal time (25 hours ago)
      store.setLastRevealTime(
        address,
        Date.now() - 25 * 60 * 60 * 1000,
        100,
        "test-hash"
      );

      const result = store.isCooldownExpired(address);

      expect(result).toBe(true);
    });
  });

  describe("getTimeUntilNextReveal", () => {
    it("should return 0 for new address", () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      const result = store.getTimeUntilNextReveal(address);

      expect(result).toBe(0);
    });

    it("should return remaining time when cooldown is active", () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";
      const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000;

      // Set reveal time to 12 hours ago
      store.setLastRevealTime(address, twelveHoursAgo, 100, "test-hash");

      const result = store.getTimeUntilNextReveal(address);
      const expectedRemaining = 12 * 60 * 60 * 1000; // 12 hours remaining

      // Allow for small timing differences (within 1 second)
      expect(Math.abs(result - expectedRemaining)).toBeLessThan(1000);
    });

    it("should return 0 when cooldown is expired", () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";
      const twentyFiveHoursAgo = Date.now() - 25 * 60 * 60 * 1000;

      // Set reveal time to 25 hours ago
      store.setLastRevealTime(address, twentyFiveHoursAgo, 100, "test-hash");

      const result = store.getTimeUntilNextReveal(address);

      expect(result).toBe(0);
    });
  });

  describe("revealCard", () => {
    beforeEach(() => {
      mockGetRandomCard.mockReturnValue({
        id: "test-card",
        type: CardType.RICE_GRAIN,
        rarity: CardRarity.COMMON,
        emoji: "🌾",
        label: "Test Card",
        value: 100,
        probability: 0.5,
      });
    });

    it("should reveal card successfully", async () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      // Mock setTimeout to run immediately
      jest.useFakeTimers();

      const revealPromise = store.revealCard(address);

      // Fast-forward time to complete the reveal
      jest.advanceTimersByTime(1500);

      const result = await revealPromise;

      expect(result).toBeDefined();
      expect(result?.value).toBe(100);

      const data = store.getDataForAddress(address);
      expect(data.cardState.isRevealed).toBe(true);
      expect(data.cardState.selectedCard).toBe(result);

      jest.useRealTimers();
    });

    it("should not reveal if already revealing", async () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      // Set revealing state
      const data = store.getDataForAddress(address);
      data.cardState.isRevealing = true;

      const result = await store.revealCard(address);

      expect(result).toBeUndefined();
    });

    it("should not reveal if cooldown is not expired in production", async () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      // Initialize the store first
      store.initializeStore(address);

      // Set recent reveal time
      store.setLastRevealTime(
        address,
        Date.now() - 12 * 60 * 60 * 1000,
        100,
        "test-hash"
      );

      // Set NODE_ENV to production
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "production",
        writable: true,
      });

      // Update canReveal based on cooldown
      store.checkRevealAvailability(address);

      const result = await store.revealCard(address);

      expect(result).toBeUndefined();
    });
  });

  describe("checkRevealAvailability", () => {
    it("should set canReveal to true in development", () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      // Set NODE_ENV to development
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "development",
        writable: true,
      });

      store.checkRevealAvailability(address);

      const data = store.getDataForAddress(address);
      expect(data.canReveal).toBe(true);
    });

    it("should check cooldown in production", () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      // Set NODE_ENV to production
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "production",
        writable: true,
      });

      // Set recent reveal time
      store.setLastRevealTime(
        address,
        Date.now() - 12 * 60 * 60 * 1000,
        100,
        "test-hash"
      );

      store.checkRevealAvailability(address);

      const data = store.getDataForAddress(address);
      expect(data.canReveal).toBe(false);
    });
  });

  describe("clearReveal", () => {
    it("should clear reveal data", () => {
      const store = useDailyRevealStore.getState();
      const address = "0x123";

      // Set some reveal data
      store.setLastRevealTime(address, Date.now(), 100, "test-hash");

      store.clearReveal(address);

      const data = store.getDataForAddress(address);
      expect(data.lastRevealTime).toBeUndefined();
      expect(data.lastRevealAmount).toBeUndefined();
      expect(data.lastRevealHash).toBeUndefined();
      expect(data.canReveal).toBe(true);
    });
  });
});

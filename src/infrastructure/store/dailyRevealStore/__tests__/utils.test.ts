import {
  formatTimeRemaining,
  isCooldownExpired,
  getTimeUntilNextReveal,
  createInitialData,
} from "../utils";
import { DailyRevealData } from "../types";

describe("DailyReveal Utils", () => {
  describe("formatTimeRemaining", () => {
    it("should return 'Ready to reveal' when time is 0 or negative", () => {
      expect(formatTimeRemaining(0)).toBe("Ready to reveal");
      expect(formatTimeRemaining(-1000)).toBe("Ready to reveal");
    });

    it("should format seconds correctly", () => {
      expect(formatTimeRemaining(5000)).toBe("5s");
      expect(formatTimeRemaining(30000)).toBe("30s");
    });

    it("should format minutes and seconds correctly", () => {
      expect(formatTimeRemaining(65000)).toBe("1m 5s");
      expect(formatTimeRemaining(125000)).toBe("2m 5s");
    });

    it("should format hours, minutes and seconds correctly", () => {
      expect(formatTimeRemaining(3665000)).toBe("1h 1m 5s");
      expect(formatTimeRemaining(7325000)).toBe("2h 2m 5s");
    });
  });

  describe("isCooldownExpired", () => {
    it("should return true when no lastRevealTime", () => {
      const data: DailyRevealData = {
        canReveal: false,
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };
      expect(isCooldownExpired(data)).toBe(true);
    });

    it("should return false when last reveal was less than 24 hours ago", () => {
      const data: DailyRevealData = {
        canReveal: false,
        lastRevealTime: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
        lastRevealAmount: 100,
        lastRevealHash: "test-hash",
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };
      expect(isCooldownExpired(data)).toBe(false);
    });

    it("should return true when last reveal was more than 24 hours ago", () => {
      const data: DailyRevealData = {
        canReveal: false,
        lastRevealTime: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
        lastRevealAmount: 100,
        lastRevealHash: "test-hash",
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };
      expect(isCooldownExpired(data)).toBe(true);
    });

    it("should return true when last reveal was exactly 24 hours ago", () => {
      const data: DailyRevealData = {
        canReveal: false,
        lastRevealTime: Date.now() - 24 * 60 * 60 * 1000, // Exactly 24 hours ago
        lastRevealAmount: 100,
        lastRevealHash: "test-hash",
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };
      expect(isCooldownExpired(data)).toBe(true);
    });
  });

  describe("getTimeUntilNextReveal", () => {
    it("should return 0 when no lastRevealTime", () => {
      const data: DailyRevealData = {
        canReveal: false,
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };
      expect(getTimeUntilNextReveal(data)).toBe(0);
    });

    it("should return remaining time when last reveal was less than 24 hours ago", () => {
      const now = Date.now();
      const twelveHoursAgo = now - 12 * 60 * 60 * 1000; // 12 hours ago
      const expectedRemaining = 12 * 60 * 60 * 1000; // 12 hours remaining

      const data: DailyRevealData = {
        canReveal: false,
        lastRevealTime: twelveHoursAgo,
        lastRevealAmount: 100,
        lastRevealHash: "test-hash",
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };

      const result = getTimeUntilNextReveal(data);
      // Allow for small timing differences (within 1 second)
      expect(Math.abs(result - expectedRemaining)).toBeLessThan(1000);
    });

    it("should return 0 when last reveal was more than 24 hours ago", () => {
      const data: DailyRevealData = {
        canReveal: false,
        lastRevealTime: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
        lastRevealAmount: 100,
        lastRevealHash: "test-hash",
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };
      expect(getTimeUntilNextReveal(data)).toBe(0);
    });
  });

  describe("createInitialData", () => {
    it("should create initial data with correct structure", () => {
      const result = createInitialData(true);

      expect(result).toEqual({
        canReveal: true,
        lastRevealTime: undefined,
        lastRevealAmount: undefined,
        lastRevealHash: undefined,
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      });
    });

    it("should create initial data with canReveal set to false", () => {
      const result = createInitialData(false);

      expect(result.canReveal).toBe(false);
      expect(result.cardState.isRevealing).toBe(false);
      expect(result.cardState.selectedCard).toBe(null);
      expect(result.cardState.isRevealed).toBe(false);
    });
  });
});

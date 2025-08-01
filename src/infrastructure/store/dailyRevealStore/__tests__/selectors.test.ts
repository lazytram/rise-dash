import { useDailyRevealSelectors } from "../selectors";
import { useDailyRevealStore } from "../store";

// Mock the store
jest.mock("../store", () => ({
  useDailyRevealStore: jest.fn(),
}));

const mockUseDailyRevealStore = useDailyRevealStore as jest.MockedFunction<
  typeof useDailyRevealStore
>;

describe("DailyReveal Selectors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useDailyRevealSelectors", () => {
    it("should return default values when no address is provided", () => {
      const mockStore = {
        getDataForAddress: jest.fn(),
        getTimeUntilNextReveal: jest.fn(),
        revealCard: jest.fn(),
        resetCard: jest.fn(),
      };

      mockUseDailyRevealStore.mockReturnValue(mockStore);

      const result = useDailyRevealSelectors();

      expect(result).toEqual({
        canReveal: false,
        isSpinning: false,
        selectedCard: null,
        isRevealed: false,
        timeUntilNextReveal: 0,
        formattedTimeRemaining: "Ready to reveal",
        revealCard: expect.any(Function),
        resetCard: expect.any(Function),
      });
    });

    it("should return correct data for valid address", () => {
      const mockData = {
        canReveal: true,
        cardState: {
          isRevealing: false,
          selectedCard: {
            id: "test",
            name: "Test",
            value: 100,
            rarity: "common",
          },
          isRevealed: true,
        },
      };

      const mockStore = {
        getDataForAddress: jest.fn().mockReturnValue(mockData),
        getTimeUntilNextReveal: jest.fn().mockReturnValue(3600000), // 1 hour
        revealCard: jest.fn(),
        resetCard: jest.fn(),
      };

      mockUseDailyRevealStore.mockReturnValue(mockStore);

      const result = useDailyRevealSelectors("0x123");

      expect(result.canReveal).toBe(true);
      expect(result.isSpinning).toBe(false);
      expect(result.selectedCard).toEqual(mockData.cardState.selectedCard);
      expect(result.isRevealed).toBe(true);
      expect(result.timeUntilNextReveal).toBe(3600000);
      expect(result.formattedTimeRemaining).toBe("1h 0m 0s");
      expect(result.revealCard).toBeInstanceOf(Function);
      expect(result.resetCard).toBeInstanceOf(Function);
    });

    it("should format time correctly for different durations", () => {
      const mockData = {
        canReveal: false,
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };

      const mockStore = {
        getDataForAddress: jest.fn().mockReturnValue(mockData),
        getTimeUntilNextReveal: jest.fn().mockReturnValue(3665000), // 1h 1m 5s
        revealCard: jest.fn(),
        resetCard: jest.fn(),
      };

      mockUseDailyRevealStore.mockReturnValue(mockStore);

      const result = useDailyRevealSelectors("0x123");

      expect(result.formattedTimeRemaining).toBe("1h 1m 5s");
    });

    it("should format time correctly for seconds only", () => {
      const mockData = {
        canReveal: false,
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };

      const mockStore = {
        getDataForAddress: jest.fn().mockReturnValue(mockData),
        getTimeUntilNextReveal: jest.fn().mockReturnValue(30000), // 30 seconds
        revealCard: jest.fn(),
        resetCard: jest.fn(),
      };

      mockUseDailyRevealStore.mockReturnValue(mockStore);

      const result = useDailyRevealSelectors("0x123");

      expect(result.formattedTimeRemaining).toBe("30s");
    });

    it("should format time correctly for minutes and seconds", () => {
      const mockData = {
        canReveal: false,
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };

      const mockStore = {
        getDataForAddress: jest.fn().mockReturnValue(mockData),
        getTimeUntilNextReveal: jest.fn().mockReturnValue(125000), // 2m 5s
        revealCard: jest.fn(),
        resetCard: jest.fn(),
      };

      mockUseDailyRevealStore.mockReturnValue(mockStore);

      const result = useDailyRevealSelectors("0x123");

      expect(result.formattedTimeRemaining).toBe("2m 5s");
    });

    it("should return 'Ready to reveal' when time is 0", () => {
      const mockData = {
        canReveal: true,
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };

      const mockStore = {
        getDataForAddress: jest.fn().mockReturnValue(mockData),
        getTimeUntilNextReveal: jest.fn().mockReturnValue(0),
        revealCard: jest.fn(),
        resetCard: jest.fn(),
      };

      mockUseDailyRevealStore.mockReturnValue(mockStore);

      const result = useDailyRevealSelectors("0x123");

      expect(result.formattedTimeRemaining).toBe("Ready to reveal");
    });

    it("should call store methods when revealCard is called", async () => {
      const mockRevealCard = jest
        .fn()
        .mockResolvedValue({ id: "test", value: 100 });
      const mockResetCard = jest.fn();

      const mockData = {
        canReveal: true,
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };

      const mockStore = {
        getDataForAddress: jest.fn().mockReturnValue(mockData),
        getTimeUntilNextReveal: jest.fn(),
        revealCard: mockRevealCard,
        resetCard: mockResetCard,
      };

      mockUseDailyRevealStore.mockReturnValue(mockStore);

      const result = useDailyRevealSelectors("0x123");

      await result.revealCard();

      expect(mockRevealCard).toHaveBeenCalledWith("0x123");
    });

    it("should call store methods when resetCard is called", () => {
      const mockRevealCard = jest.fn();
      const mockResetCard = jest.fn();

      const mockData = {
        canReveal: true,
        cardState: {
          isRevealing: false,
          selectedCard: null,
          isRevealed: false,
        },
      };

      const mockStore = {
        getDataForAddress: jest.fn().mockReturnValue(mockData),
        getTimeUntilNextReveal: jest.fn(),
        revealCard: mockRevealCard,
        resetCard: mockResetCard,
      };

      mockUseDailyRevealStore.mockReturnValue(mockStore);

      const result = useDailyRevealSelectors("0x123");

      result.resetCard();

      expect(mockResetCard).toHaveBeenCalledWith("0x123");
    });
  });
});

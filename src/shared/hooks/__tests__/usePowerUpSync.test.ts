// Mock blockchain modules before imports
jest.mock("@/infrastructure/blockchain/blockchainService", () => ({
  blockchainService: {
    getPlayerBestScore: jest.fn(),
    getPlayerScores: jest.fn(),
    getLeaderboard: jest.fn(),
    getTotalScores: jest.fn(),
    getContractInfo: jest.fn(),
    getPowerUpLevels: jest.fn(),
    getPowerUpConfig: jest.fn(),
  },
}));

// Mock wagmi hooks
jest.mock("wagmi", () => ({
  useAccount: jest.fn(() => ({ address: "0x123" })),
  useWriteContract: jest.fn(() => ({
    writeContract: jest.fn(),
    data: null,
    isPending: false,
    error: null,
  })),
  useWaitForTransactionReceipt: jest.fn(() => ({
    isLoading: false,
    isSuccess: false,
  })),
}));

// Mock toast store
jest.mock("@/infrastructure/store/toastStore", () => ({
  useToastStore: jest.fn(() => ({
    showError: jest.fn(),
    showSuccess: jest.fn(),
    showPending: jest.fn(),
  })),
}));

// Mock translations
jest.mock("../useTranslations", () => ({
  useTranslations: jest.fn(() => ({
    t: jest.fn((key: string) => key),
  })),
}));

import { renderHook, act } from "@testing-library/react";
import { usePowerUpSync } from "../usePowerUpSync";
import { blockchainService } from "@/infrastructure/blockchain/blockchainService";

const mockBlockchainService = blockchainService as jest.Mocked<
  typeof blockchainService
>;

describe("usePowerUpSync", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBlockchainService.getPowerUpLevels.mockResolvedValue([
      1, 2, 3, 4, 5, 6,
    ]);
    mockBlockchainService.getPowerUpConfig.mockResolvedValue({
      cost: 100,
      maxLevel: 10,
    });
  });

  it("should initialize and load power-up levels", async () => {
    renderHook(() => usePowerUpSync());

    // Wait for the effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockBlockchainService.getPowerUpLevels).toHaveBeenCalled();
    expect(mockBlockchainService.getPowerUpConfig).toHaveBeenCalled();
  });

  it("should return power-up levels and configs", () => {
    const { result } = renderHook(() => usePowerUpSync());

    expect(result.current.powerUpLevels).toBeDefined();
    expect(result.current.powerUpConfigs).toBeDefined();
  });

  it("should return transaction states", () => {
    const { result } = renderHook(() => usePowerUpSync());

    expect(typeof result.current.isSuccess).toBe("boolean");
    expect(typeof result.current.error).toBe("object");
    expect(typeof result.current.hash).toBe("object"); // hash can be null or string
  });
});

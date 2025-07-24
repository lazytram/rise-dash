import { renderHook, act } from "@testing-library/react";
import { useBlockchainScore } from "../useBlockchainScore";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  blockchainService,
  SCOREBOARD_CONTRACT_ADDRESS,
  SCOREBOARD_ABI,
} from "@/infrastructure/blockchain/blockchainService";
import { useToastStore } from "@/infrastructure/store/toastStore";

// Mock all dependencies
jest.mock("wagmi", () => ({
  useAccount: jest.fn(),
  useWriteContract: jest.fn(),
  useWaitForTransactionReceipt: jest.fn(),
}));

jest.mock("@/infrastructure/blockchain/blockchainService", () => ({
  blockchainService: {
    getContractInfo: jest.fn(),
    generateGameHash: jest.fn(),
    isNewPersonalBest: jest.fn(),
    getLeaderboard: jest.fn(),
    getTotalScores: jest.fn(),
  },
}));

jest.mock("@/infrastructure/store/toastStore", () => ({
  useToastStore: jest.fn(),
}));

jest.mock("../useTranslations", () => ({
  useTranslations: () => ({
    t: (key: string) => key,
  }),
}));

// Mock fetch
global.fetch = jest.fn();

const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>;
const mockUseWriteContract = useWriteContract as jest.MockedFunction<
  typeof useWriteContract
>;
const mockUseWaitForTransactionReceipt =
  useWaitForTransactionReceipt as jest.MockedFunction<
    typeof useWaitForTransactionReceipt
  >;
const mockBlockchainService = blockchainService as jest.Mocked<
  typeof blockchainService
>;
const mockUseToastStore = useToastStore as jest.MockedFunction<
  typeof useToastStore
>;

describe("useBlockchainScore", () => {
  const mockAddress = "0x1234567890123456789012345678901234567890";
  const mockWriteContract = jest.fn();
  const mockShowError = jest.fn();
  const mockShowSuccess = jest.fn();
  const mockShowPending = jest.fn();
  const mockClearToasts = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAccount.mockReturnValue({
      address: mockAddress,
    } as unknown as ReturnType<typeof useAccount>);

    mockUseWriteContract.mockReturnValue({
      writeContract: mockWriteContract,
      data: undefined,
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useWriteContract>);

    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: false,
      isSuccess: false,
    } as unknown as ReturnType<typeof useWaitForTransactionReceipt>);

    mockUseToastStore.mockReturnValue({
      showError: mockShowError,
      showSuccess: mockShowSuccess,
      showPending: mockShowPending,
      clearToasts: mockClearToasts,
    } as unknown as ReturnType<typeof useToastStore>);

    mockBlockchainService.getContractInfo.mockResolvedValue({
      paused: false,
      securityKeySet: true,
      gameOwner: "0xowner",
      minTimeBetweenScores: BigInt(0),
    });

    mockBlockchainService.generateGameHash.mockReturnValue(
      "0xgamehash" as `0x${string}`
    );
  });

  describe("recordScore", () => {
    it("should return false when no address is connected", async () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
      } as unknown as ReturnType<typeof useAccount>);

      const { result } = renderHook(() => useBlockchainScore());

      const success = await act(async () => {
        return await result.current.recordScore(1000, "Player1");
      });

      expect(success).toBe(false);
      expect(mockShowError).toHaveBeenCalledWith(
        "common.error",
        "features.blockchain.connectWallet"
      );
    });

    it("should return false when contract is paused", async () => {
      mockBlockchainService.getContractInfo.mockResolvedValue({
        paused: true,
        securityKeySet: true,
        gameOwner: "0xowner",
        minTimeBetweenScores: BigInt(0),
      });

      const { result } = renderHook(() => useBlockchainScore());

      const success = await act(async () => {
        return await result.current.recordScore(1000, "Player1");
      });

      expect(success).toBe(false);
      expect(mockShowError).toHaveBeenCalledWith(
        "common.error",
        "features.blockchain.contractPaused"
      );
    });

    it("should return false when security key is not set", async () => {
      mockBlockchainService.getContractInfo.mockResolvedValue({
        paused: false,
        securityKeySet: false,
        gameOwner: "0xowner",
        minTimeBetweenScores: BigInt(0),
      });

      const { result } = renderHook(() => useBlockchainScore());

      const success = await act(async () => {
        return await result.current.recordScore(1000, "Player1");
      });

      expect(success).toBe(false);
      expect(mockShowError).toHaveBeenCalledWith(
        "common.error",
        "features.blockchain.securityKeyNotConfigured"
      );
    });

    it("should handle API signature error", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      const { result } = renderHook(() => useBlockchainScore());

      const success = await act(async () => {
        return await result.current.recordScore(1000, "Player1");
      });

      expect(success).toBe(false);
      expect(mockShowError).toHaveBeenCalledWith(
        "common.error",
        "features.blockchain.errorSaving (signature)"
      );
    });

    it("should handle successful score recording", async () => {
      const mockSignature = "0xsignature" as `0x${string}`;
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ signature: mockSignature }),
      });

      const { result } = renderHook(() => useBlockchainScore());

      const success = await act(async () => {
        return await result.current.recordScore(1000, "Player1");
      });

      expect(success).toBe(true);
      expect(mockWriteContract).toHaveBeenCalledWith({
        address: SCOREBOARD_CONTRACT_ADDRESS,
        abi: SCOREBOARD_ABI,
        functionName: "recordScore",
        args: [BigInt(1000), "Player1", "0xgamehash", mockSignature],
      });
    });

    it("should handle writeContract error", async () => {
      const mockSignature = "0xsignature" as `0x${string}`;
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ signature: mockSignature }),
      });

      mockWriteContract.mockImplementation(() => {
        throw new Error("Write contract error");
      });

      const { result } = renderHook(() => useBlockchainScore());

      const success = await act(async () => {
        return await result.current.recordScore(1000, "Player1");
      });

      expect(success).toBe(false);
      expect(mockShowError).toHaveBeenCalledWith(
        "common.error",
        "features.blockchain.errorSaving"
      );
    });
  });

  describe("checkNewPersonalBest", () => {
    it("should return false when no address is connected", async () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
      } as unknown as ReturnType<typeof useAccount>);

      const { result } = renderHook(() => useBlockchainScore());

      const isNewBest = await act(async () => {
        return await result.current.checkNewPersonalBest(1000);
      });

      expect(isNewBest).toBe(false);
    });

    it("should return true when it is a new personal best", async () => {
      mockBlockchainService.isNewPersonalBest.mockResolvedValue(true);

      const { result } = renderHook(() => useBlockchainScore());

      const isNewBest = await act(async () => {
        return await result.current.checkNewPersonalBest(1000);
      });

      expect(isNewBest).toBe(true);
      expect(mockBlockchainService.isNewPersonalBest).toHaveBeenCalledWith(
        mockAddress,
        1000
      );
    });

    it("should return false when it is not a new personal best", async () => {
      mockBlockchainService.isNewPersonalBest.mockResolvedValue(false);

      const { result } = renderHook(() => useBlockchainScore());

      const isNewBest = await act(async () => {
        return await result.current.checkNewPersonalBest(1000);
      });

      expect(isNewBest).toBe(false);
    });

    it("should handle errors and return false", async () => {
      mockBlockchainService.isNewPersonalBest.mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useBlockchainScore());

      const isNewBest = await act(async () => {
        return await result.current.checkNewPersonalBest(1000);
      });

      expect(isNewBest).toBe(false);
    });
  });

  describe("getLeaderboard", () => {
    it("should call blockchain service with correct parameters", async () => {
      const mockLeaderboard = [
        {
          score: BigInt(1000),
          playerName: "Player1",
          playerAddress: "0xplayer1" as `0x${string}`,
        },
      ];
      mockBlockchainService.getLeaderboard.mockResolvedValue(mockLeaderboard);

      const { result } = renderHook(() => useBlockchainScore());

      const leaderboard = await act(async () => {
        return await result.current.getLeaderboard(0, 10);
      });

      expect(leaderboard).toEqual(mockLeaderboard);
      expect(mockBlockchainService.getLeaderboard).toHaveBeenCalledWith(0, 10);
    });
  });

  describe("getTotalScores", () => {
    it("should call blockchain service", async () => {
      const mockTotalScores = BigInt(100);
      mockBlockchainService.getTotalScores.mockResolvedValue(mockTotalScores);

      const { result } = renderHook(() => useBlockchainScore());

      const totalScores = await act(async () => {
        return await result.current.getTotalScores();
      });

      expect(totalScores).toBe(mockTotalScores);
      expect(mockBlockchainService.getTotalScores).toHaveBeenCalled();
    });
  });

  describe("transaction status handling", () => {
    it("should show success toast when transaction is successful", () => {
      const mockHash = "0xtransactionhash" as `0x${string}`;

      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: mockHash,
        isPending: false,
        error: null,
      } as unknown as ReturnType<typeof useWriteContract>);

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isLoading: false,
        isSuccess: true,
      } as unknown as ReturnType<typeof useWaitForTransactionReceipt>);

      renderHook(() => useBlockchainScore());

      expect(mockShowSuccess).toHaveBeenCalledWith(
        "Transaction Successful",
        "Your score has been successfully saved!",
        mockHash,
        "View Transaction"
      );
    });

    it("should show error toast when transaction fails", () => {
      const mockError = new Error("Transaction failed");

      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: undefined,
        isPending: false,
        error: mockError,
      } as unknown as ReturnType<typeof useWriteContract>);

      renderHook(() => useBlockchainScore());

      expect(mockShowError).toHaveBeenCalledWith(
        "Error",
        `Failed to save your score. Please try again.: ${mockError.message}`
      );
    });
  });

  describe("loading states", () => {
    it("should return correct loading state when recording", () => {
      mockUseWriteContract.mockReturnValue({
        writeContract: mockWriteContract,
        data: undefined,
        isPending: true,
        error: null,
      } as unknown as ReturnType<typeof useWriteContract>);

      const { result } = renderHook(() => useBlockchainScore());

      expect(result.current.isRecording).toBe(true);
    });

    it("should return correct loading state when confirming", () => {
      mockUseWaitForTransactionReceipt.mockReturnValue({
        isLoading: true,
        isSuccess: false,
      } as unknown as ReturnType<typeof useWaitForTransactionReceipt>);

      const { result } = renderHook(() => useBlockchainScore());

      expect(result.current.isRecording).toBe(true);
    });
  });
});

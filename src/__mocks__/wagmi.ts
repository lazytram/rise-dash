// Mock for wagmi to prevent ES module issues in tests
export const useAccount = jest.fn(() => ({
  address: "0x1234567890123456789012345678901234567890",
  isConnected: true,
  isConnecting: false,
  isDisconnected: false,
}));

export const useWriteContract = jest.fn(() => ({
  writeContract: jest.fn(),
  isPending: false,
  isSuccess: false,
  isError: false,
}));

export const useReadContract = jest.fn(() => ({
  data: null,
  isLoading: false,
  isError: false,
}));

export const useWaitForTransactionReceipt = jest.fn(() => ({
  data: null,
  isLoading: false,
  isError: false,
}));

export const useBalance = jest.fn(() => ({
  data: { value: BigInt(0), formatted: "0" },
  isLoading: false,
  isError: false,
}));

export const useContractRead = jest.fn(() => ({
  data: null,
  isLoading: false,
  isError: false,
}));

export const useContractWrite = jest.fn(() => ({
  write: jest.fn(),
  isLoading: false,
  isSuccess: false,
  isError: false,
}));

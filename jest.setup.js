import "@testing-library/jest-dom";

// Mock blockchain-related modules to prevent ES module issues
jest.mock("wagmi", () => ({
  useAccount: jest.fn(() => ({ address: "0x1234567890123456789012345678901234567890" })),
  useWriteContract: jest.fn(() => ({ writeContract: jest.fn() })),
  useReadContract: jest.fn(() => ({ data: null, isLoading: false })),
  useWaitForTransactionReceipt: jest.fn(() => ({ data: null, isLoading: false })),
}));

jest.mock("viem", () => ({
  getAddress: jest.fn((address) => address),
  parseEther: jest.fn((value) => value),
  formatEther: jest.fn((value) => value),
  encodePacked: jest.fn((types, values) => "0xencoded"),
  keccak256: jest.fn((data) => "0xhash"),
}));

jest.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: jest.fn(() => null),
  getDefaultWallets: jest.fn(() => []),
  connectorsForWallets: jest.fn(() => []),
}));

// Mock localStorage globally for all tests
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Add missing global objects for blockchain libraries
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// Mock crypto for blockchain libraries
Object.defineProperty(global, "crypto", {
  value: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      generateKey: jest.fn(),
      sign: jest.fn(),
      verify: jest.fn(),
    },
  },
});

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

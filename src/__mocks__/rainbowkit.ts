// Mock for @rainbow-me/rainbowkit to prevent ES module issues in tests
export const ConnectButton = jest.fn(() => null);
export const getDefaultWallets = jest.fn(() => []);
export const connectorsForWallets = jest.fn(() => []);
export const RainbowKitProvider = jest.fn(({ children }) => children);
export const lightTheme = jest.fn(() => ({}));
export const darkTheme = jest.fn(() => ({}));

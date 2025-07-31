// Mock for viem to prevent ES module issues in tests
export const getAddress = jest.fn((address: string) => address);
export const parseEther = jest.fn((value: string) => BigInt(value));
export const formatEther = jest.fn((value: bigint) => value.toString());
export const encodePacked = jest.fn(() => "0xencoded");
export const keccak256 = jest.fn(() => "0xhash");
export const encodeFunctionData = jest.fn(() => "0xfunctiondata");
export const decodeFunctionResult = jest.fn(() => ({}));
export const parseAbiItem = jest.fn(() => ({}));
export const encodeAbiParameters = jest.fn(() => "0xencoded");
export const decodeAbiParameters = jest.fn(() => ({}));

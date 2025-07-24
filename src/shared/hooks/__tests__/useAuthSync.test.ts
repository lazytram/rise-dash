import { renderHook } from "@testing-library/react";
import { useAuthSync } from "../useAuthSync";
import { useAccount } from "wagmi";
import { useSession, signOut } from "next-auth/react";

// Mock wagmi and next-auth
jest.mock("wagmi", () => ({
  useAccount: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>;
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

describe("useAuthSync", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not sign out when wallet is connected and session exists with same address", () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: "0x1234567890123456789012345678901234567890",
    } as unknown as ReturnType<typeof useAccount>);

    mockUseSession.mockReturnValue({
      data: {
        address: "0x1234567890123456789012345678901234567890",
      },
      status: "authenticated",
    } as unknown as ReturnType<typeof useSession>);

    renderHook(() => useAuthSync());

    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("should sign out when wallet is disconnected but session exists", () => {
    mockUseAccount.mockReturnValue({
      isConnected: false,
      address: undefined,
    } as unknown as ReturnType<typeof useAccount>);

    mockUseSession.mockReturnValue({
      data: {
        address: "0x1234567890123456789012345678901234567890",
      },
      status: "authenticated",
    } as unknown as ReturnType<typeof useSession>);

    renderHook(() => useAuthSync());

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("should sign out when wallet is connected with different address than session", () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: "0x1234567890123456789012345678901234567890",
    } as unknown as ReturnType<typeof useAccount>);

    mockUseSession.mockReturnValue({
      data: {
        address: "0x0987654321098765432109876543210987654321",
      },
      status: "authenticated",
    } as unknown as ReturnType<typeof useSession>);

    renderHook(() => useAuthSync());

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("should handle case-insensitive address comparison", () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: "0x1234567890123456789012345678901234567890",
    } as unknown as ReturnType<typeof useAccount>);

    mockUseSession.mockReturnValue({
      data: {
        address: "0x1234567890123456789012345678901234567890".toUpperCase(),
      },
      status: "authenticated",
    } as unknown as ReturnType<typeof useSession>);

    renderHook(() => useAuthSync());

    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("should not sign out when wallet is connected but no session exists", () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: "0x1234567890123456789012345678901234567890",
    } as unknown as ReturnType<typeof useAccount>);

    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as unknown as ReturnType<typeof useSession>);

    renderHook(() => useAuthSync());

    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("should not sign out when wallet is disconnected and no session exists", () => {
    mockUseAccount.mockReturnValue({
      isConnected: false,
      address: undefined,
    } as unknown as ReturnType<typeof useAccount>);

    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as unknown as ReturnType<typeof useSession>);

    renderHook(() => useAuthSync());

    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("should not sign out when wallet is connected but session address is undefined", () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: "0x1234567890123456789012345678901234567890",
    } as unknown as ReturnType<typeof useAccount>);

    mockUseSession.mockReturnValue({
      data: {
        address: undefined,
      },
      status: "authenticated",
    } as unknown as ReturnType<typeof useSession>);

    renderHook(() => useAuthSync());

    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("should handle loading states", () => {
    mockUseAccount.mockReturnValue({
      isConnected: false,
      address: undefined,
    } as unknown as ReturnType<typeof useAccount>);

    mockUseSession.mockReturnValue({
      data: null,
      status: "loading",
    } as unknown as ReturnType<typeof useSession>);

    renderHook(() => useAuthSync());

    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("should handle wallet address being undefined", () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: undefined,
    } as unknown as ReturnType<typeof useAccount>);

    mockUseSession.mockReturnValue({
      data: {
        address: "0x1234567890123456789012345678901234567890",
      },
      status: "authenticated",
    } as unknown as ReturnType<typeof useSession>);

    renderHook(() => useAuthSync());

    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("should handle session data being null", () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: "0x1234567890123456789012345678901234567890",
    } as unknown as ReturnType<typeof useAccount>);

    mockUseSession.mockReturnValue({
      data: null,
      status: "authenticated",
    } as unknown as ReturnType<typeof useSession>);

    renderHook(() => useAuthSync());

    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("should handle multiple renders without side effects", () => {
    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: "0x1234567890123456789012345678901234567890",
    } as unknown as ReturnType<typeof useAccount>);

    mockUseSession.mockReturnValue({
      data: {
        address: "0x1234567890123456789012345678901234567890",
      },
      status: "authenticated",
    } as unknown as ReturnType<typeof useSession>);

    const { rerender } = renderHook(() => useAuthSync());

    expect(mockSignOut).not.toHaveBeenCalled();

    rerender();

    expect(mockSignOut).not.toHaveBeenCalled();
  });
});

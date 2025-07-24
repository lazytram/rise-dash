import { renderHook, act } from "@testing-library/react";
import { usePowerUpSync } from "../usePowerUpSync";
import { getPowerUpService } from "@/shared/services/powerUpService";
import { Player } from "@/shared/types/game";
import { PowerUpType } from "@/shared/types/powerUps";

// Mock the power up service
jest.mock("@/shared/services/powerUpService", () => ({
  getPowerUpService: jest.fn(),
}));

const mockGetPowerUpService = getPowerUpService as jest.MockedFunction<
  typeof getPowerUpService
>;

describe("usePowerUpSync", () => {
  const mockPlayer: Player = {
    x: 100,
    y: 300,
    width: 40,
    height: 60,
    velocityY: 0,
    isJumping: false,
    color: "#FF0000",
    riceRocketAmmo: 5,
    maxRiceRocketAmmo: 10,
    lastAmmoRechargeTime: 0,
    hasShield: false,
    hasInfiniteAmmo: false,
    hasJumpBoost: false,
    hasSlowMotion: false,
    hasMultiShot: false,
    powerUpEndTimes: {
      shield: 0,
      infiniteAmmo: 0,
      jumpBoost: 0,
      slowMotion: 0,
      multiShot: 0,
    },
    powerUpLevels: {
      [PowerUpType.SHIELD]: 1,
      [PowerUpType.INFINITE_AMMO]: 1,
      [PowerUpType.JUMP_BOOST]: 1,
      [PowerUpType.SLOW_MOTION]: 1,
      [PowerUpType.MULTI_SHOT]: 1,
      [PowerUpType.RICE_ROCKET_AMMO]: 1,
    },
  };

  const mockSetPlayer = jest.fn();

  const mockService = {
    getLevels: jest.fn(),
    getMaxAmmo: jest.fn(),
    setLevels: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPowerUpService.mockReturnValue(
      mockService as unknown as ReturnType<typeof getPowerUpService>
    );
    mockService.getLevels.mockReturnValue({
      [PowerUpType.SHIELD]: 2,
      [PowerUpType.INFINITE_AMMO]: 3,
      [PowerUpType.JUMP_BOOST]: 1,
      [PowerUpType.SLOW_MOTION]: 2,
      [PowerUpType.MULTI_SHOT]: 1,
      [PowerUpType.RICE_ROCKET_AMMO]: 5,
    });
    mockService.getMaxAmmo.mockReturnValue(15);
  });

  it("should initialize and sync player with service levels", () => {
    renderHook(() => usePowerUpSync(mockPlayer, mockSetPlayer));

    expect(mockGetPowerUpService).toHaveBeenCalled();
    expect(mockService.getLevels).toHaveBeenCalled();
    expect(mockService.getMaxAmmo).toHaveBeenCalled();
    expect(mockSetPlayer).toHaveBeenCalledWith({
      ...mockPlayer,
      powerUpLevels: mockService.getLevels(),
      maxRiceRocketAmmo: 15,
      riceRocketAmmo: 5, // Should be min of current ammo and max ammo
    });
  });

  it("should only sync once on mount", () => {
    const { rerender } = renderHook(() =>
      usePowerUpSync(mockPlayer, mockSetPlayer)
    );

    // Initial sync
    expect(mockSetPlayer).toHaveBeenCalledTimes(1);

    // Re-render should not trigger another sync
    rerender();
    expect(mockSetPlayer).toHaveBeenCalledTimes(1);
  });

  it("should provide syncToService function", () => {
    const { result } = renderHook(() =>
      usePowerUpSync(mockPlayer, mockSetPlayer)
    );

    expect(typeof result.current.syncToService).toBe("function");
  });

  it("should provide syncFromService function", () => {
    const { result } = renderHook(() =>
      usePowerUpSync(mockPlayer, mockSetPlayer)
    );

    expect(typeof result.current.syncFromService).toBe("function");
  });

  it("should sync player levels to service when syncToService is called", () => {
    const { result } = renderHook(() =>
      usePowerUpSync(mockPlayer, mockSetPlayer)
    );

    act(() => {
      result.current.syncToService();
    });

    expect(mockService.setLevels).toHaveBeenCalledWith(
      mockPlayer.powerUpLevels
    );
  });

  it("should sync from service when syncFromService is called", () => {
    const { result } = renderHook(() =>
      usePowerUpSync(mockPlayer, mockSetPlayer)
    );

    // Reset mock to check new call
    mockSetPlayer.mockClear();

    act(() => {
      result.current.syncFromService();
    });

    expect(mockService.getLevels).toHaveBeenCalled();
    expect(mockService.getMaxAmmo).toHaveBeenCalled();
    expect(mockSetPlayer).toHaveBeenCalledWith({
      ...mockPlayer,
      powerUpLevels: mockService.getLevels(),
      maxRiceRocketAmmo: 15,
      riceRocketAmmo: 5,
    });
  });

  it("should handle player with more ammo than max ammo", () => {
    const playerWithExcessAmmo = {
      ...mockPlayer,
      riceRocketAmmo: 20, // More than max ammo
    };

    renderHook(() => usePowerUpSync(playerWithExcessAmmo, mockSetPlayer));

    expect(mockSetPlayer).toHaveBeenCalledWith({
      ...playerWithExcessAmmo,
      powerUpLevels: mockService.getLevels(),
      maxRiceRocketAmmo: 15,
      riceRocketAmmo: 15, // Should be capped at max ammo
    });
  });

  it("should handle player with less ammo than max ammo", () => {
    const playerWithLessAmmo = {
      ...mockPlayer,
      riceRocketAmmo: 3, // Less than max ammo
    };

    renderHook(() => usePowerUpSync(playerWithLessAmmo, mockSetPlayer));

    expect(mockSetPlayer).toHaveBeenCalledWith({
      ...playerWithLessAmmo,
      powerUpLevels: mockService.getLevels(),
      maxRiceRocketAmmo: 15,
      riceRocketAmmo: 3, // Should keep current ammo
    });
  });

  it("should update setPlayer ref when setPlayer function changes", () => {
    const newSetPlayer = jest.fn();
    const { rerender } = renderHook(
      ({ setPlayer }) => usePowerUpSync(mockPlayer, setPlayer),
      { initialProps: { setPlayer: mockSetPlayer } }
    );

    // Initial sync
    expect(mockSetPlayer).toHaveBeenCalled();

    // Change setPlayer function
    rerender({ setPlayer: newSetPlayer });

    // Call syncFromService to test new setPlayer
    const { result: newResult } = renderHook(() =>
      usePowerUpSync(mockPlayer, newSetPlayer)
    );

    act(() => {
      newResult.current.syncFromService();
    });

    expect(newSetPlayer).toHaveBeenCalled();
  });

  it("should handle service returning different levels", () => {
    const newLevels = {
      shield: 5,
      infiniteAmmo: 1,
      jumpBoost: 3,
      slowMotion: 1,
      multiShot: 2,
      riceRocketAmmo: 10,
    };

    mockService.getLevels.mockReturnValue(newLevels);
    mockService.getMaxAmmo.mockReturnValue(20);

    const { result } = renderHook(() =>
      usePowerUpSync(mockPlayer, mockSetPlayer)
    );

    act(() => {
      result.current.syncFromService();
    });

    expect(mockSetPlayer).toHaveBeenCalledWith({
      ...mockPlayer,
      powerUpLevels: newLevels,
      maxRiceRocketAmmo: 20,
      riceRocketAmmo: 5, // Should be min of current ammo and new max ammo
    });
  });

  it("should handle multiple sync operations", () => {
    const { result } = renderHook(() =>
      usePowerUpSync(mockPlayer, mockSetPlayer)
    );

    // Initial sync
    expect(mockSetPlayer).toHaveBeenCalledTimes(1);

    // Multiple sync operations
    act(() => {
      result.current.syncToService();
      result.current.syncFromService();
      result.current.syncToService();
    });

    expect(mockService.setLevels).toHaveBeenCalledTimes(2);
    expect(mockSetPlayer).toHaveBeenCalledTimes(2); // Initial + syncFromService
  });
});

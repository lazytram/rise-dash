import { renderHook } from "@testing-library/react";
import { useGameLoop } from "../useGameLoop";

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = jest.fn();
const mockCancelAnimationFrame = jest.fn();

global.requestAnimationFrame = mockRequestAnimationFrame;
global.cancelAnimationFrame = mockCancelAnimationFrame;

// Mock performance.now
const mockPerformanceNow = jest.fn();
global.performance.now = mockPerformanceNow;

describe("useGameLoop", () => {
  const mockGameLoop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformanceNow.mockReturnValue(0);
  });

  it("should initialize with null animation frame ref", () => {
    const { result } = renderHook(() => useGameLoop(false, mockGameLoop));

    expect(result.current.current).toBe(null);
  });

  it("should start game loop when isGameRunning is true", () => {
    mockRequestAnimationFrame.mockReturnValue(123);

    renderHook(() => useGameLoop(true, mockGameLoop));

    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it("should not start game loop when isGameRunning is false", () => {
    renderHook(() => useGameLoop(false, mockGameLoop));

    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
  });

  it("should stop game loop when isGameRunning changes to false", () => {
    mockRequestAnimationFrame.mockReturnValue(123);

    const { rerender } = renderHook(
      ({ isRunning }) => useGameLoop(isRunning, mockGameLoop),
      { initialProps: { isRunning: true } }
    );

    expect(mockRequestAnimationFrame).toHaveBeenCalled();

    rerender({ isRunning: false });

    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(123);
  });

  it("should start new game loop when isGameRunning changes to true", () => {
    mockRequestAnimationFrame.mockReturnValue(456);

    const { rerender } = renderHook(
      ({ isRunning }) => useGameLoop(isRunning, mockGameLoop),
      { initialProps: { isRunning: false } }
    );

    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();

    rerender({ isRunning: true });

    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it("should clean up animation frame on unmount", () => {
    mockRequestAnimationFrame.mockReturnValue(123);

    const { unmount } = renderHook(() => useGameLoop(true, mockGameLoop));

    unmount();

    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(123);
  });
});

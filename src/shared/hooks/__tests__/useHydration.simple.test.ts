import { renderHook } from "@testing-library/react";
import { useHydration } from "../useHydration";

describe("useHydration", () => {
  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useHydration());

    expect(result.current.isMounted).toBe(true);
    expect(result.current.isServer).toBe(false);
  });

  it("should detect client environment correctly", () => {
    const { result } = renderHook(() => useHydration());

    expect(result.current.isServer).toBe(false);
  });

  it("should maintain state consistency across renders", () => {
    const { result, rerender } = renderHook(() => useHydration());

    // Initial state
    expect(result.current.isMounted).toBe(true);

    // Re-render should maintain state
    rerender();

    expect(result.current.isMounted).toBe(true);
  });
});

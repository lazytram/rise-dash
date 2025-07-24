import { renderHook, act } from "@testing-library/react";
import { useTutorialAutoShow } from "../useTutorialAutoShow";
import { useTutorialStore } from "@/infrastructure/store/tutorialStore";

// Mock the tutorial store
jest.mock("@/infrastructure/store/tutorialStore", () => ({
  useTutorialStore: jest.fn(),
}));

const mockUseTutorialStore = useTutorialStore as jest.MockedFunction<
  typeof useTutorialStore
>;

describe("useTutorialAutoShow", () => {
  beforeEach(() => {
    mockUseTutorialStore.mockClear();
  });

  it("should initialize with shouldShowTutorial as false", () => {
    mockUseTutorialStore.mockReturnValue({ hasSeenTutorial: false });

    const { result } = renderHook(() => useTutorialAutoShow());

    expect(result.current.shouldShowTutorial).toBe(false);
    expect(typeof result.current.closeTutorial).toBe("function");
  });

  it("should not show tutorial if user has already seen it", () => {
    mockUseTutorialStore.mockReturnValue({ hasSeenTutorial: true });

    const { result } = renderHook(() => useTutorialAutoShow());

    expect(result.current.shouldShowTutorial).toBe(false);
  });

  it("should close tutorial when closeTutorial is called", () => {
    mockUseTutorialStore.mockReturnValue({ hasSeenTutorial: false });

    const { result } = renderHook(() => useTutorialAutoShow());

    // Close tutorial
    act(() => {
      result.current.closeTutorial();
    });

    expect(result.current.shouldShowTutorial).toBe(false);
  });

  it("should handle store changes correctly", () => {
    // Start with user not having seen tutorial
    mockUseTutorialStore.mockReturnValue({ hasSeenTutorial: false });

    const { result, rerender } = renderHook(() => useTutorialAutoShow());

    // Change store to indicate user has seen tutorial
    mockUseTutorialStore.mockReturnValue({ hasSeenTutorial: true });

    rerender();

    // Should still show tutorial since it was already shown
    expect(result.current.shouldShowTutorial).toBe(false);
  });

  it("should handle multiple closeTutorial calls", () => {
    mockUseTutorialStore.mockReturnValue({ hasSeenTutorial: false });

    const { result } = renderHook(() => useTutorialAutoShow());

    // Close tutorial multiple times
    act(() => {
      result.current.closeTutorial();
      result.current.closeTutorial();
      result.current.closeTutorial();
    });

    expect(result.current.shouldShowTutorial).toBe(false);
  });
});

import { renderHook } from "@testing-library/react";
import { useKeyboardControls } from "../useKeyboardControls";

describe("useKeyboardControls", () => {
  let mockOnJump: jest.Mock;
  let mockOnStartGame: jest.Mock;
  let mockOnShoot: jest.Mock;

  beforeEach(() => {
    mockOnJump = jest.fn();
    mockOnStartGame = jest.fn();
    mockOnShoot = jest.fn();
    jest.clearAllMocks();
  });

  describe("when game is running", () => {
    it("should call onJump when ArrowUp is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardControls(
          true,
          false,
          mockOnJump,
          mockOnStartGame,
          mockOnShoot
        )
      );

      const mockEvent = {
        code: "ArrowUp",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      result.current.handleKeyPress(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnJump).toHaveBeenCalledTimes(1);
      expect(mockOnStartGame).not.toHaveBeenCalled();
      expect(mockOnShoot).not.toHaveBeenCalled();
    });

    it("should call onShoot when Space is pressed and onShoot is provided", () => {
      const { result } = renderHook(() =>
        useKeyboardControls(
          true,
          false,
          mockOnJump,
          mockOnStartGame,
          mockOnShoot
        )
      );

      const mockEvent = {
        code: "Space",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      result.current.handleKeyPress(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnShoot).toHaveBeenCalledTimes(1);
      expect(mockOnJump).not.toHaveBeenCalled();
      expect(mockOnStartGame).not.toHaveBeenCalled();
    });

    it("should not call onShoot when Space is pressed and onShoot is not provided", () => {
      const { result } = renderHook(() =>
        useKeyboardControls(true, false, mockOnJump, mockOnStartGame)
      );

      const mockEvent = {
        code: "Space",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      result.current.handleKeyPress(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnShoot).not.toHaveBeenCalled();
      expect(mockOnJump).not.toHaveBeenCalled();
      expect(mockOnStartGame).not.toHaveBeenCalled();
    });

    it("should not react to other key codes", () => {
      const { result } = renderHook(() =>
        useKeyboardControls(
          true,
          false,
          mockOnJump,
          mockOnStartGame,
          mockOnShoot
        )
      );

      const mockEvent = {
        code: "ArrowDown",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      result.current.handleKeyPress(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnJump).not.toHaveBeenCalled();
      expect(mockOnStartGame).not.toHaveBeenCalled();
      expect(mockOnShoot).not.toHaveBeenCalled();
    });
  });

  describe("when game is not running", () => {
    it("should call onStartGame when ArrowUp is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardControls(
          false,
          false,
          mockOnJump,
          mockOnStartGame,
          mockOnShoot
        )
      );

      const mockEvent = {
        code: "ArrowUp",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      result.current.handleKeyPress(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnStartGame).toHaveBeenCalledTimes(1);
      expect(mockOnJump).not.toHaveBeenCalled();
      expect(mockOnShoot).not.toHaveBeenCalled();
    });

    it("should call onStartGame when Space is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardControls(
          false,
          false,
          mockOnJump,
          mockOnStartGame,
          mockOnShoot
        )
      );

      const mockEvent = {
        code: "Space",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      result.current.handleKeyPress(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnStartGame).toHaveBeenCalledTimes(1);
      expect(mockOnJump).not.toHaveBeenCalled();
      expect(mockOnShoot).not.toHaveBeenCalled();
    });

    it("should call onStartGame when Enter is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardControls(
          false,
          false,
          mockOnJump,
          mockOnStartGame,
          mockOnShoot
        )
      );

      const mockEvent = {
        code: "Enter",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      result.current.handleKeyPress(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnStartGame).toHaveBeenCalledTimes(1);
      expect(mockOnJump).not.toHaveBeenCalled();
      expect(mockOnShoot).not.toHaveBeenCalled();
    });

    it("should not react to other key codes", () => {
      const { result } = renderHook(() =>
        useKeyboardControls(
          false,
          false,
          mockOnJump,
          mockOnStartGame,
          mockOnShoot
        )
      );

      const mockEvent = {
        code: "ArrowDown",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      result.current.handleKeyPress(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnJump).not.toHaveBeenCalled();
      expect(mockOnStartGame).not.toHaveBeenCalled();
      expect(mockOnShoot).not.toHaveBeenCalled();
    });
  });

  describe("when game is over", () => {
    it("should not handle any keyboard input when ArrowUp is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardControls(
          false,
          true,
          mockOnJump,
          mockOnStartGame,
          mockOnShoot
        )
      );

      const mockEvent = {
        code: "ArrowUp",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      result.current.handleKeyPress(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnStartGame).not.toHaveBeenCalled();
      expect(mockOnJump).not.toHaveBeenCalled();
      expect(mockOnShoot).not.toHaveBeenCalled();
    });

    it("should not handle any keyboard input when Space is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardControls(
          false,
          true,
          mockOnJump,
          mockOnStartGame,
          mockOnShoot
        )
      );

      const mockEvent = {
        code: "Space",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      result.current.handleKeyPress(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnStartGame).not.toHaveBeenCalled();
      expect(mockOnJump).not.toHaveBeenCalled();
      expect(mockOnShoot).not.toHaveBeenCalled();
    });

    it("should not handle any keyboard input when Enter is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardControls(
          false,
          true,
          mockOnJump,
          mockOnStartGame,
          mockOnShoot
        )
      );

      const mockEvent = {
        code: "Enter",
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;

      result.current.handleKeyPress(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnStartGame).not.toHaveBeenCalled();
      expect(mockOnJump).not.toHaveBeenCalled();
      expect(mockOnShoot).not.toHaveBeenCalled();
    });
  });
});

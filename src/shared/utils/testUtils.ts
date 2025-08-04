import { renderHook, RenderHookOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import React from "react";

/**
 * Custom renderHook wrapper that automatically includes QueryClientProvider
 * This is useful for testing hooks that use useQueryClient from @tanstack/react-query
 */
export const renderHookWithQueryClient = <TProps, TResult>(
  render: (initialProps: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, "wrapper">
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const TestWrapper = ({ children }: { children: ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };

  return renderHook(render, {
    ...options,
    wrapper: TestWrapper,
  });
};

/**
 * Create a mock QueryClient for testing
 */
export const createMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

/**
 * Test wrapper component that provides QueryClientProvider
 */
export const TestQueryClientProvider = ({
  children,
  queryClient = createMockQueryClient(),
}: {
  children: ReactNode;
  queryClient?: QueryClient;
}) => {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  );
};

/**
 * Utility to wait for async operations in tests
 */
export const waitForAsync = (ms: number = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock console methods to avoid noise in tests
 */
export const mockConsole = {
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

/**
 * Setup console mocks before tests
 */
export const setupConsoleMocks = () => {
  jest.spyOn(console, "error").mockImplementation(mockConsole.error);
  jest.spyOn(console, "warn").mockImplementation(mockConsole.warn);
  jest.spyOn(console, "log").mockImplementation(mockConsole.log);
};

/**
 * Restore console mocks after tests
 */
export const restoreConsoleMocks = () => {
  jest.restoreAllMocks();
};

// Re-export commonly used testing utilities
export { act, renderHook } from "@testing-library/react";

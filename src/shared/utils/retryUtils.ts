/**
 * Retry utility with exponential backoff
 * Used for blockchain operations that may fail due to network issues
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Check if it's a rate limit error or CORS error
      if (
        error instanceof Error &&
        (error.message.includes("429") ||
          error.message.includes("CORS") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("HTTP request failed"))
      ) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(
          `⚠️ Retrying after ${delay}ms (attempt ${attempt + 1}/${
            maxRetries + 1
          })`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // For other errors, don't retry
        throw lastError;
      }
    }
  }

  throw lastError!;
};

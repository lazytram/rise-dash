import { SignatureResponse, SignatureRequest } from "./signature";

// API Response Types

export interface ApiErrorResponse {
  error: string;
  timeRemaining?: number;
  nextRevealIn?: string;
}
// Daily Reveal specific types (using type aliases for clarity)
export type SignDailyRevealResponse = SignatureResponse;
export type SignDailyRevealRequest = SignatureRequest;

// Daily Reveal specific error types
export interface DailyRevealCooldownError extends ApiErrorResponse {
  error: "Daily reveal already claimed today";
  timeRemaining: number;
  nextRevealIn: string;
}

// Type guard to check if it's a cooldown error
export const isDailyRevealCooldownError = (
  response: ApiErrorResponse
): response is DailyRevealCooldownError => {
  return response.error === "Daily reveal already claimed today";
};

"use client";

import React, { ReactNode, Component, ErrorInfo } from "react";
import { useTranslations } from "@/shared/hooks/useTranslations";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Main ErrorBoundary component using class component
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    return this.props.children;
  }
}

// Separate component for the error UI
function ErrorFallback({
  error,
  errorInfo,
}: {
  error?: Error;
  errorInfo?: ErrorInfo;
}) {
  const { t } = useTranslations();

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#3a1344] via-[#7967e5] to-[#99eafc] relative">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#7967e5]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#99eafc]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-40 left-40 w-80 h-80 bg-[#3a1344]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "4s" }}
        />
        {/* Additional floating elements */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-white/20 rounded-full animate-bounce"></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-white/15 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="w-full max-w-lg mx-auto relative z-10 flex flex-col items-center justify-center">
        {/* Enhanced Main Card */}
        <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-8 w-full">
          {/* Enhanced Error Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#7967e5] to-[#3a1344] rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-110">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 w-24 h-24 bg-[#7967e5] rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 w-24 h-24 bg-[#7967e5] rounded-full animate-pulse opacity-10"></div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-[#7967e5] to-[#3a1344] bg-clip-text text-transparent">
              {t("errorBoundary.title")}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg max-w-md mx-auto">
              {t("errorBoundary.message")}
            </p>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-[#7967e5] to-[#3a1344] hover:from-[#3a1344] hover:to-[#7967e5] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#7967e5] transform transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {t("errorBoundary.refreshPage")}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-4 border-2 border-[#7967e5] text-base font-semibold rounded-2xl text-[#7967e5] bg-white hover:bg-[#7967e5]/5 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#7967e5] transform transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {t("errorBoundary.tryAgain")}
              </button>
            </div>

            {/* Enhanced Error Details */}
            {(error || errorInfo) && (
              <details className="mt-8 text-left group">
                <summary className="cursor-pointer text-base font-medium text-[#7967e5] hover:text-[#3a1344] flex items-center transition-all duration-300 group-open:text-[#3a1344] mb-2">
                  <svg
                    className="w-5 h-5 mr-3 transform transition-transform duration-300 group-open:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t("errorBoundary.errorDetails")}
                </summary>
                <div className="mt-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-[#7967e5]/20">
                  <div className="space-y-3 text-sm">
                    {error?.message && (
                      <div className="space-y-2">
                        <div className="text-[#7967e5] font-semibold text-xs uppercase tracking-wide">
                          {t("errorBoundary.message")}
                        </div>
                        <div className="text-gray-800 font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-sm">
                          {error.message}
                        </div>
                      </div>
                    )}
                    {error?.stack && (
                      <div className="space-y-2">
                        <div className="text-[#7967e5] font-semibold text-xs uppercase tracking-wide">
                          {t("errorBoundary.stack")}
                        </div>
                        <div className="text-gray-800 font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-xs max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                          <pre className="whitespace-pre-wrap break-all">
                            {error.stack}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

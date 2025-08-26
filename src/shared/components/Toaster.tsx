"use client";

import { useState, useEffect } from "react";
import { Text } from "./Text";
import { Button } from "./Button";
import { useToastStore, ToastData } from "@/infrastructure/store/toastStore";

export const Toaster: React.FC = () => {
  const { toasts, removeToast, clearToasts } = useToastStore();
  const [exitingToasts, setExitingToasts] = useState<Set<string>>(new Set());

  // Clear any existing toasts when component mounts
  useEffect(() => {
    clearToasts();
  }, [clearToasts]);

  const getToastStyles = (type: ToastData["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-600 text-green-900 shadow-xl";
      case "error":
        return "bg-red-50 border-red-600 text-red-900 shadow-xl";
      case "pending":
        return "bg-blue-50 border-blue-600 text-blue-900 shadow-xl";
      case "info":
        return "bg-purple-50 border-purple-600 text-purple-900 shadow-xl";
      default:
        return "bg-white border-gray-300 text-gray-900 shadow-xl";
    }
  };

  const getActionButtonStyles = (type: ToastData["type"]) => {
    switch (type) {
      case "success":
        return "text-xs p-1 h-auto bg-green-100 hover:bg-green-200 text-green-800 border border-green-300";
      case "error":
        return "text-xs p-1 h-auto bg-red-100 hover:bg-red-200 text-red-800 border border-red-300";
      case "pending":
        return "text-xs p-1 h-auto bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300";
      case "info":
        return "text-xs p-1 h-auto bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300";
      default:
        return "text-xs p-1 h-auto bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300";
    }
  };

  const getCloseButtonStyles = (type: ToastData["type"]) => {
    switch (type) {
      case "success":
        return "ml-2 text-green-700 hover:text-green-900 transition-colors p-2 rounded-full hover:bg-green-100 cursor-pointer flex items-center justify-center w-8 h-8 font-bold text-lg";
      case "error":
        return "ml-2 text-red-700 hover:text-red-900 transition-colors p-2 rounded-full hover:bg-red-100 cursor-pointer flex items-center justify-center w-8 h-8 font-bold text-lg";
      case "pending":
        return "ml-2 text-blue-700 hover:text-blue-900 transition-colors p-2 rounded-full hover:bg-blue-100 cursor-pointer flex items-center justify-center w-8 h-8 font-bold text-lg";
      case "info":
        return "ml-2 text-purple-700 hover:text-purple-900 transition-colors p-2 rounded-full hover:bg-purple-100 cursor-pointer flex items-center justify-center w-8 h-8 font-bold text-lg";
      default:
        return "ml-2 text-gray-700 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer flex items-center justify-center w-8 h-8 font-bold text-lg";
    }
  };

  const getIcon = (type: ToastData["type"]) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "pending":
        return "⏳";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  const handleViewTransaction = (hash: string) => {
    const explorerUrl = `https://explorer.testnet.riselabs.xyz/tx/${hash}`;
    window.open(explorerUrl, "_blank");
  };

  const handleRemoveToast = (id: string) => {
    setExitingToasts((prev) => new Set(prev).add(id));
    setTimeout(() => {
      removeToast(id);
      setExitingToasts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300); // Animation duration
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-4 flex flex-col-reverse">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-80 max-w-md p-4 rounded-lg border transform transition-all duration-300 ease-in-out my-1 ${
            exitingToasts.has(toast.id)
              ? "opacity-0 translate-x-full scale-95"
              : "opacity-100 translate-x-0 scale-100"
          } ${getToastStyles(toast.type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <span className="text-lg">{getIcon(toast.type)}</span>
              <div className="flex-1">
                <Text className="font-bold mb-1 text-base">{toast.title}</Text>
                <Text className="text-sm font-medium">{toast.message}</Text>
                {toast.transactionHash && (
                  <div className="mt-2">
                    <Button
                      onClick={() =>
                        handleViewTransaction(toast.transactionHash!)
                      }
                      variant="ghost"
                      size="sm"
                      className={getActionButtonStyles(toast.type)}
                    >
                      {toast.viewTransactionText || "View Transaction"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => handleRemoveToast(toast.id)}
              className={getCloseButtonStyles(toast.type)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

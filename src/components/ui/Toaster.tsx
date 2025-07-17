"use client";

import { Text } from "./Text";
import { Button } from "./Button";
import { useToastStore, Toast } from "@/store/toastStore";

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const getToastStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "backdrop-blur-sm bg-green-500/20 border border-green-400/30 text-white shadow-2xl";
      case "error":
        return "backdrop-blur-sm bg-red-500/20 border border-red-400/30 text-white shadow-2xl";
      case "pending":
        return "backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 text-white shadow-2xl";
      case "info":
        return "backdrop-blur-sm bg-purple-500/20 border border-purple-400/30 text-white shadow-2xl";
      default:
        return "backdrop-blur-sm bg-white/5 border border-white/20 text-white shadow-2xl";
    }
  };

  const getIcon = (type: Toast["type"]) => {
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

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 flex flex-col-reverse">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-80 max-w-md p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out ${getToastStyles(
            toast.type
          )}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <span className="text-lg">{getIcon(toast.type)}</span>
              <div className="flex-1">
                <Text className="font-semibold mb-1">{toast.title}</Text>
                <Text className="text-sm opacity-90">{toast.message}</Text>
                {toast.transactionHash && (
                  <div className="mt-2">
                    <Button
                      onClick={() =>
                        handleViewTransaction(toast.transactionHash!)
                      }
                      variant="ghost"
                      size="sm"
                      className="text-xs p-1 h-auto bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
                    >
                      {toast.viewTransactionText || "View Transaction"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

import React from "react";
import { Text } from "./Text";

interface StatusIndicatorProps {
  status: "pending" | "success" | "error" | "info" | "warning" | "calculating";
  message: string;
  showPulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  showPulse = true,
  className = "",
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          color: "bg-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-400/20",
          textColor: "text-blue-200/90",
        };
      case "success":
        return {
          color: "bg-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-400/20",
          textColor: "text-green-200/90",
        };
      case "error":
        return {
          color: "bg-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-400/20",
          textColor: "text-red-200/90",
        };
      case "info":
        return {
          color: "bg-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-400/20",
          textColor: "text-purple-200/90",
        };
      case "warning":
        return {
          color: "bg-orange-400",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-400/20",
          textColor: "text-orange-200/90",
        };
      case "calculating":
        return {
          color: "bg-emerald-400",
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-400/20",
          textColor: "text-emerald-200/90",
        };
      default:
        return {
          color: "bg-white/60",
          bgColor: "bg-white/10",
          borderColor: "border-white/20",
          textColor: "text-white/70",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`inline-flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border backdrop-blur-sm ${config.bgColor} ${config.borderColor} ${className}`}
    >
      <div
        className={`w-1 h-1 rounded-full ${config.color} ${
          showPulse ? "animate-pulse" : ""
        }`}
      ></div>
      <Text
        variant="body"
        className={`font-medium text-xs tracking-wide ${config.textColor}`}
      >
        {message}
      </Text>
    </div>
  );
};

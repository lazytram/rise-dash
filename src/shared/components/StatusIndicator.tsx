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
          color: "bg-blue-500",
          bgColor: "bg-blue-500/15",
          borderColor: "border-blue-500/40",
          textColor: "text-blue-700",
        };
      case "success":
        return {
          color: "bg-green-500",
          bgColor: "bg-green-500/15",
          borderColor: "border-green-500/40",
          textColor: "text-green-700",
        };
      case "error":
        return {
          color: "bg-red-500",
          bgColor: "bg-red-500/15",
          borderColor: "border-red-500/40",
          textColor: "text-red-700",
        };
      case "info":
        return {
          color: "bg-purple-500",
          bgColor: "bg-purple-500/15",
          borderColor: "border-purple-500/40",
          textColor: "text-purple-700",
        };
      case "warning":
        return {
          color: "bg-orange-500",
          bgColor: "bg-orange-500/15",
          borderColor: "border-orange-500/40",
          textColor: "text-orange-700",
        };
      case "calculating":
        return {
          color: "bg-emerald-500",
          bgColor: "bg-emerald-500/15",
          borderColor: "border-emerald-500/40",
          textColor: "text-emerald-700",
        };
      default:
        return {
          color: "bg-gray-500",
          bgColor: "bg-gray-500/15",
          borderColor: "border-gray-500/40",
          textColor: "text-gray-700",
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

import React from "react";
import { cn } from "@/shared/utils/cn";

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200/50 mb-6 bg-gray-100/50 rounded-t-lg p-1 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer relative overflow-hidden",
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#7967e5]/20 to-[#99eafc]/20 text-gray-900 shadow-lg border border-[#7967e5]/30"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 border border-transparent hover:border-gray-300/50"
            )}
          >
            <span className="relative z-10">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#7967e5]/10 to-[#99eafc]/10 rounded-lg" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

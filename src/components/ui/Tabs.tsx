import React from "react";
import { cn } from "@/utils/cn";

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
      <div className="flex border-b border-white/20 mb-6 bg-white/5 rounded-t-lg p-1 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer relative overflow-hidden",
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white shadow-lg border border-white/20"
                : "text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
            )}
          >
            <span className="relative z-10">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg" />
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

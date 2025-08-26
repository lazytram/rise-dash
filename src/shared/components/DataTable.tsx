import React from "react";
import { cn } from "@/shared/utils/cn";
import { Text } from "./Text";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  animationDelay?: number;
  rowDelay?: number;
  onRowClick?: (item: T, index: number) => void;
  highlightRow?: (item: T, index: number) => boolean;
}

export function DataTable<T>({
  data,
  columns,
  className,
  animationDelay = 400,
  rowDelay = 50,
  onRowClick,
  highlightRow,
}: DataTableProps<T>) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Enhanced Table with modern styling */}
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7967e5]/10 via-[#99eafc]/5 to-[#7967e5]/10 rounded-xl blur-lg"></div>

        {/* Main table container */}
        <div className="relative bg-white/80 rounded-xl border border-gray-200/50 backdrop-blur-sm overflow-hidden shadow-lg">
          {/* Table header with enhanced styling */}
          <div className="bg-gradient-to-r from-[#7967e5]/20 via-[#7967e5]/15 to-[#7967e5]/20 border-b border-gray-200/50">
            <div className="flex gap-4 px-4 py-3">
              {columns.map((column) => (
                <div key={column.key} className="flex-1 text-center">
                  <Text
                    variant="subtitle"
                    className="text-gray-800 font-semibold text-sm"
                  >
                    {column.header}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {/* Table body with enhanced rows */}
          <div className="divide-y divide-gray-200/50">
            {data.map((item, index) => {
              const isHighlighted = highlightRow ? highlightRow(item, index) : false;
              const animationDelayValue = animationDelay + index * rowDelay;

              return (
                <div
                  key={index}
                  className={cn(
                    "group cursor-pointer transition-all duration-300 hover:bg-[#7967e5]/5",
                    isHighlighted && "bg-[#7967e5]/10 border-l-4 border-[#7967e5]",
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${animationDelayValue}ms` }}
                  onClick={() => onRowClick?.(item, index)}
                >
                  <div className="flex gap-4 px-4 py-3">
                    {columns.map((column) => (
                      <div key={column.key} className="flex-1 text-center">
                        {column.render(item, index)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Text } from "@/shared/components/Text";
import { AnimatedContainer } from "@/shared/components/AnimatedContainer";
import { cn } from "@/shared/utils/cn";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
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
    <div className={cn("space-y-4", className)}>
      {/* Enhanced Table with modern styling */}
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-cyan-500/20 rounded-2xl blur-xl"></div>

        {/* Main table container */}
        <div className="relative bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-blue-900/40 rounded-2xl border border-white/20 backdrop-blur-sm overflow-hidden shadow-2xl">
          {/* Table header with enhanced styling */}
          <div className="bg-gradient-to-r from-purple-600/30 via-purple-500/20 to-blue-600/30 border-b border-white/20">
            <div
              className={cn(
                "grid gap-4 px-8 py-6",
                `grid-cols-${columns.length}`
              )}
            >
              {columns.map((column) => (
                <div key={column.key} className="text-center">
                  <Text
                    variant="subtitle"
                    className="text-white/90 font-semibold"
                  >
                    {column.header}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {/* Table body with enhanced rows */}
          <div className="divide-y divide-white/10">
            {data.map((item, index) => {
              const isHighlighted = highlightRow
                ? highlightRow(item, index)
                : false;

              return (
                <AnimatedContainer
                  key={index}
                  animation="fadeIn"
                  delay={animationDelay + index * rowDelay}
                >
                  <div
                    className={cn(
                      "group transition-all duration-300 ease-out hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg cursor-pointer",
                      isHighlighted &&
                        "bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-blue-500/20 border-l-4 border-blue-400"
                    )}
                    onClick={() => onRowClick?.(item, index)}
                  >
                    <div
                      className={cn(
                        "grid gap-4 px-8 py-6",
                        `grid-cols-${columns.length}`
                      )}
                    >
                      {columns.map((column) => (
                        <div
                          key={column.key}
                          className={cn(
                            "flex items-center justify-center",
                            column.className
                          )}
                        >
                          {column.render(item, index)}
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedContainer>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Button } from "./Button";
import { cn } from "@/shared/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
      >
        <span className="text-lg">←</span>
      </Button>

      {getVisiblePages().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-3 py-2 text-white/50 font-medium">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={cn(
                "w-10 h-10 rounded-full transition-all duration-200 hover:scale-110",
                currentPage === page
                  ? "bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40"
                  : "hover:bg-white/20"
              )}
            >
              <span className="font-semibold">{page}</span>
            </Button>
          )}
        </React.Fragment>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
      >
        <span className="text-lg">→</span>
      </Button>
    </div>
  );
};

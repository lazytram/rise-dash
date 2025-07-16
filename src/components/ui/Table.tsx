import React from "react";
import { cn } from "@/utils/cn";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <table className={cn("w-full border-collapse", className)}>
      {children}
    </table>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <th
      className={cn(
        "text-left p-3 border-b border-gray-200 font-semibold text-gray-700",
        className
      )}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className,
}) => {
  return (
    <td className={cn("p-3 border-b border-gray-100", className)}>
      {children}
    </td>
  );
};

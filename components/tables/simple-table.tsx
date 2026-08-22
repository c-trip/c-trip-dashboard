import type { ReactNode } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { cn } from "@/lib/utils";

export interface SimpleTableColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface SimpleTableProps<T> {
  columns: SimpleTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyTitle: string;
  emptyDescription?: string;
}

export function SimpleTable<T>({ columns, rows, rowKey, emptyTitle, emptyDescription }: SimpleTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/70">
            {columns.map((column) => (
              <th
                key={column.header}
                className={cn(
                  "px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={rowKey(row)}
              className={cn(
                "border-b border-border/60 transition-colors duration-150 last:border-0 hover:bg-muted/40",
                index % 2 === 1 && "bg-muted/20"
              )}
            >
              {columns.map((column) => (
                <td key={column.header} className={cn("px-5 py-3.5", column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

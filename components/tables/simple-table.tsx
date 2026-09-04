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

export function SimpleTable<T>({
  columns,
  rows,
  rowKey,
  emptyTitle,
  emptyDescription,
}: SimpleTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column.header}
                className={cn(
                  "px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
            >
              {columns.map((column) => (
                <td
                  key={column.header}
                  className={cn("px-4 py-3 align-middle", column.className)}
                >
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

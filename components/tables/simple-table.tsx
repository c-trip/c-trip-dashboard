import type { ReactNode } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { cn } from "@/lib/utils";

// Versão leve da <DataTable> (TanStack Table) prevista no roadmap da arquitectura.
// Sem paginação por total de registos de propósito — a API não devolve contagem
// total em nenhuma listagem (ver Docs/ARQUITETURA_FRONTEND.md, secção 6).

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
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left">
            {columns.map((column) => (
              <th key={column.header} className={cn("px-3.5 py-2.5 font-medium text-muted-foreground", column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-border last:border-0 hover:bg-muted/30">
              {columns.map((column) => (
                <td key={column.header} className={cn("px-3.5 py-2.5", column.className)}>
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

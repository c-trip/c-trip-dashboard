import { cn } from "@/lib/utils";

interface SeatMapProps {
  totalSeats: number;
  available: number[];
  occupied: number[];
  /** Quando true, os lugares livres viram radios `name` para escolha dentro de um form. */
  selectable?: boolean;
  name?: string;
  className?: string;
}

/**
 * Grelha de lugares de uma viagem. Verde = livre, esbatido = ocupado.
 * Em modo `selectable`, cada lugar livre é um `<input type="radio">` — a selecção
 * visual é puramente CSS (`peer-checked`), sem JavaScript.
 */
export function SeatMap({
  totalSeats,
  available,
  occupied,
  selectable = false,
  name = "seat_number",
  className,
}: SeatMapProps) {
  const availableSet = new Set(available);
  const occupiedSet = new Set(occupied);
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
        {seats.map((seat) => {
          const isOccupied = occupiedSet.has(seat);
          const isAvailable = availableSet.has(seat);
          const base =
            "flex h-10 items-center justify-center rounded-lg border text-sm font-medium tabular-nums transition-colors";

          if (selectable && isAvailable) {
            return (
              <label
                key={seat}
                className={cn(
                  base,
                  "cursor-pointer border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400",
                  "has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-600 has-[:checked]:text-white",
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={seat}
                  className="sr-only"
                  required
                />
                {seat}
              </label>
            );
          }

          return (
            <div
              key={seat}
              className={cn(
                base,
                isOccupied
                  ? "border-border bg-muted text-muted-foreground/60 line-through"
                  : isAvailable
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "border-border bg-card text-muted-foreground",
              )}
            >
              {seat}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded border border-emerald-500/30 bg-emerald-500/10" />
          Livre ({available.length})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded border border-border bg-muted" />
          Ocupado ({occupied.length})
        </span>
      </div>
    </div>
  );
}

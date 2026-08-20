import { LogoutButton } from "@/components/dashboard/logout-button";
import type { Session } from "@/lib/auth/session";

interface TopbarProps {
  session: Session;
  title?: string;
}

export function Topbar({ session, title }: TopbarProps) {
  const initials = session.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-5 md:px-8">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end leading-tight">
            <p className="text-sm font-medium text-foreground">{session.name}</p>
            <p className="text-xs text-muted-foreground">{session.email}</p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </div>
        </div>
        <div className="h-6 w-px bg-border" />
        <LogoutButton />
      </div>
    </header>
  );
}

import { LogoutButton } from "@/components/dashboard/logout-button";
import type { Session } from "@/lib/auth/session";

interface TopbarProps {
  session: Session;
  title?: string;
}

export function Topbar({ session, title }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-5 md:px-8">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-foreground">{session.name}</p>
          <p className="text-xs text-muted-foreground">{session.email}</p>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

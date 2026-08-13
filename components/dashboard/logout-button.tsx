"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconLogout } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          router.push("/login");
          router.refresh();
        });
      }}
    >
      <IconLogout size={16} data-icon="inline-start" />
      Sair
    </Button>
  );
}

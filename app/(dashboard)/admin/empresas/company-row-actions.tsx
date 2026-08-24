"use client";

import { useTransition } from "react";
import { IconBan, IconCircleCheck, IconCircleX, IconDotsVertical } from "@tabler/icons-react";
import toast from "react-hot-toast";

import { moderateCompanyAction } from "./actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { CompanyModerationAction } from "@/lib/api/admin";
import type { CompanyStatus } from "@/lib/api/types";

interface CompanyRowActionsProps {
  companyId: string;
  companyName: string;
  status: CompanyStatus;
}

const SUCCESS_TOASTS: Record<CompanyModerationAction, string> = {
  approve: "Empresa aprovada.",
  reject: "Empresa rejeitada.",
  suspend: "Empresa suspensa.",
};

export function CompanyRowActions({ companyId, companyName, status }: CompanyRowActionsProps) {
  const [isPending, startTransition] = useTransition();

  function runAction(action: CompanyModerationAction) {
    if (isPending) return;
    startTransition(async () => {
      try {
        await moderateCompanyAction(companyId, action);
        toast.success(SUCCESS_TOASTS[action]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Não foi possível concluir a acção.");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            title="Acções"
            aria-label={`Acções para ${companyName}`}
            disabled={isPending}
          >
            <IconDotsVertical size={16} />
          </Button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={6} className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">{companyName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={status === "verified"} onClick={() => runAction("approve")}>
            <IconCircleCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span className="flex flex-col">
              <span>{status === "suspended" ? "Reactivar (aprovar de novo)" : "Aprovar"}</span>
              <span className="text-xs font-normal text-muted-foreground">passa a operar na plataforma</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={status === "rejected"} onClick={() => runAction("reject")}>
            <IconCircleX size={16} className="text-amber-600 dark:text-amber-400" />
            <span className="flex flex-col">
              <span>Rejeitar</span>
              <span className="text-xs font-normal text-muted-foreground">o registo fica rejeitado</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" disabled={status === "suspended"} onClick={() => runAction("suspend")}>
            <IconBan size={16} />
            <span className="flex flex-col">
              <span>Suspender</span>
              <span className="text-xs font-normal opacity-70">deixa de poder operar</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import Link from "next/link";
import { IconShieldLock, IconTrash } from "@tabler/icons-react";

import { removeCollaboratorAction } from "./actions";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CollaboratorRowActionsProps {
  userId: string;
  name: string;
}

export function CollaboratorRowActions({ userId, name }: CollaboratorRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={`/empresa/colaboradores/${userId}/permissoes`}
        title="Definir permissões"
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
      >
        <IconShieldLock size={16} />
      </Link>
      <ConfirmDialog
        trigger={
          <Button type="button" variant="ghost" size="icon-sm" title="Remover colaborador">
            <IconTrash size={16} />
          </Button>
        }
        title={`Remover ${name}?`}
        description="A conta fica desactivada (soft-delete) — o histórico de vendas e embarques mantém-se."
        onConfirm={() => removeCollaboratorAction(userId)}
      />
    </div>
  );
}

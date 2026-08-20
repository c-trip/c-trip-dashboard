"use client";

import Link from "next/link";
import { IconEdit, IconTrash } from "@tabler/icons-react";

import { deleteRoleAction } from "./actions";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoleRowActionsProps {
  roleId: string;
  roleName: string;
  isSystem: boolean;
}

export function RoleRowActions({ roleId, roleName, isSystem }: RoleRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={`/admin/configuracoes/roles/${roleId}`}
        title="Editar permissões"
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
      >
        <IconEdit size={16} />
      </Link>
      {!isSystem ? (
        <ConfirmDialog
          trigger={
            <Button type="button" variant="ghost" size="icon-sm" title="Eliminar role">
              <IconTrash size={16} />
            </Button>
          }
          title={`Eliminar a role "${roleName}"?`}
          description="Esta acção é irreversível. Todos os utilizadores com esta role perderão as permissões associadas."
          onConfirm={() => deleteRoleAction(roleId)}
        />
      ) : null}
    </div>
  );
}

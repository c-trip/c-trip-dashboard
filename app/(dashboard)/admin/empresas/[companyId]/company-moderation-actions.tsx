"use client";

import { moderateCompanyAction } from "../actions";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button } from "@/components/ui/button";
import type { CompanyStatus } from "@/lib/api/types";

interface CompanyModerationActionsProps {
  companyId: string;
  status: CompanyStatus;
}

export function CompanyModerationActions({ companyId, status }: CompanyModerationActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <ConfirmDialog
        trigger={
          <Button type="button" variant="default">
            {status === "suspended" ? "Reactivar (aprovar de novo)" : "Aprovar"}
          </Button>
        }
        title="Aprovar empresa?"
        description="A empresa passa a poder operar publicamente na plataforma."
        variant="default"
        confirmLabel="Aprovar"
        onConfirm={() => moderateCompanyAction(companyId, "approve")}
      />
      <ConfirmDialog
        trigger={
          <Button type="button" variant="outline">
            Rejeitar
          </Button>
        }
        title="Rejeitar empresa?"
        description="O registo fica marcado como rejeitado. Não há 'desfazer' directo para esta acção."
        confirmLabel="Rejeitar"
        onConfirm={() => moderateCompanyAction(companyId, "reject")}
      />
      <ConfirmDialog
        trigger={
          <Button type="button" variant="outline">
            Suspender
          </Button>
        }
        title="Suspender empresa?"
        description="A empresa deixa de dever poder operar. Não existe endpoint de 'reverter suspensão' — só voltar a aprovar."
        confirmLabel="Suspender"
        onConfirm={() => moderateCompanyAction(companyId, "suspend")}
      />
    </div>
  );
}

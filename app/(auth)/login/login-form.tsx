"use client";

import { useActionState } from "react";
import Link from "next/link";

import { loginAction } from "./actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialActionState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.formError} />
      <FormField htmlFor="email" label="Email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </FormField>
      <FormField htmlFor="password" label="Password" error={state.fieldErrors?.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </FormField>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "A entrar…" : "Entrar"}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled
        className="w-full"
        title="Por ligar: precisa de GOOGLE_CLIENT_ID configurado no backend"
      >
        Continuar com Google
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        A tua empresa ainda não está na plataforma?{" "}
        <Link href="/registo-empresa" className="font-medium text-foreground underline underline-offset-4">
          Regista a transportadora
        </Link>
      </p>
    </form>
  );
}

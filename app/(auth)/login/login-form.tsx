"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { loginAction } from "./actions";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";

export function LoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(loginAction, initialActionState);

  useEffect(() => {
    if (state.formError) {
      toast.error(state.formError);
      return;
    }
    if (state.success) {
      toast.success("Login efetuado com sucesso.");
      router.replace("/");
    }
  }, [state.formError, state.success, router]);

  return (
    <form action={action} className="flex flex-col gap-4">
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

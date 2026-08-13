"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { IconEye, IconEyeOff, IconMail } from "@tabler/icons-react";

import { loginAction } from "./actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";

export function LoginForm() {
  const [state, action, pending] = useActionState(
    loginAction,
    initialActionState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={state.formError} />
      <FormField htmlFor="email" label="Email" error={state.fieldErrors?.email}>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Digite o seu gmail"
            className="pr-10"
          />
          <IconMail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </FormField>
      <FormField
        htmlFor="password"
        label="Password"
        error={state.fieldErrors?.password}
      >
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Digite a sua palavra passe"
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={showPassword ? "Ocultar password" : "Mostrar password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <IconEyeOff /> : <IconEye />}
          </Button>
        </div>
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
        <Link
          href="/registo-empresa"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Regista a transportadora
        </Link>
      </p>
    </form>
  );
}

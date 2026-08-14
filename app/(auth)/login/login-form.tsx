"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "gooey-toast";
import { IconEye, IconEyeOff, IconMail } from "@tabler/icons-react";

import { loginAction } from "./actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/forms/action-state";
import {
  collectInvalidFields,
  invalidFieldsMessage,
} from "@/lib/forms/client-validation";

const FIELD_LABELS: Record<string, string> = {
  email: "Email",
  password: "Password",
};

export function LoginForm() {
  const [state, action, pending] = useActionState(
    loginAction,
    initialActionState,
  );
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const prevState = useRef(state);

  useEffect(() => {
    const prev = prevState.current;
    prevState.current = state;
    if (state === prev) return;

    if (state.success) {
      toast.success({
        title: "Login bem-sucedido!",
        description: "A entrar na tua conta…",
      });
      const timeout = setTimeout(() => {
        router.push(state.redirectTo ?? "/");
      }, 800);
      return () => clearTimeout(timeout);
    }

    if (state.formError) {
      toast.error({
        title: "Erro no login",
        description: state.formError,
      });
    }
  }, [state, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const invalid = collectInvalidFields(
      e.currentTarget,
      (name) => FIELD_LABELS[name],
    );
    if (invalid.empty.length > 0 || invalid.invalid.length > 0) {
      e.preventDefault();
      toast.error({
        title: "Formulário incompleto",
        description: invalidFieldsMessage(invalid),
      });
    }
  }

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4"
    >
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

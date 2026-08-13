import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const expired = params?.expired === "1";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar no C-Trip</CardTitle>
        <CardDescription>Painel do Gestor da Empresa e do Administrador da Plataforma.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {expired ? (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
            A tua sessão expirou — entra novamente.
          </p>
        ) : null}
        <LoginForm />
      </CardContent>
    </Card>
  );
}

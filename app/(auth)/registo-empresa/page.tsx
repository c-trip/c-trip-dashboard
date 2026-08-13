import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyRegisterForm } from "./company-register-form";

export default function RegistoEmpresaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registar transportadora</CardTitle>
        <CardDescription>
          Cria a empresa e a tua conta de gestor num único passo. A empresa fica &quot;pendente&quot; até a C-Trip
          aprovar — já podes entrar entretanto para preparar rotas e frota.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CompanyRegisterForm />
      </CardContent>
    </Card>
  );
}

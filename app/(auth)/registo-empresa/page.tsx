import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyRegisterForm } from "./company-register-form";

export default function RegistoEmpresaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registar transportadora</CardTitle>
        <CardDescription>
          Cria a empresa e a tua conta de gestor num único passo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CompanyRegisterForm />
      </CardContent>
    </Card>
  );
}

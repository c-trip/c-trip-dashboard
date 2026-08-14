"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  IconEye,
  IconEyeOff,
  IconId,
  IconMail,
  IconMapPin,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";

import { registerCompanyAction } from "./actions";
import { FormError, FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PHONE_COUNTRIES,
  formatPhoneNumber,
  validatePhoneNumber,
} from "@/lib/forms/phone-countries";
import { initialActionState } from "@/lib/forms/action-state";

export function CompanyRegisterForm() {
  const [state, action, pending] = useActionState(
    registerCompanyAction,
    initialActionState,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [dialCode, setDialCode] = useState("+244");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const validation = validatePhoneNumber(
      phoneNumber.replace(/\D/g, ""),
      dialCode,
    );
    if (!validation.ok) {
      e.preventDefault();
      setPhoneError(validation.message ?? "Número de telefone inválido.");
    }
  }

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <FormError message={state.formError} />

      <div className="grid grid-cols-2 gap-5">
        <FormField
          htmlFor="name"
          label="Nome da empresa"
          error={state.fieldErrors?.name}
          className="col-span-2"
        >
          <Input
            id="name"
            name="name"
            required
            placeholder="Digite o nome da empresa"
          />
        </FormField>
        <FormField
          htmlFor="email"
          label="Email"
          error={state.fieldErrors?.email}
          className="col-span-2"
        >
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Digite o email do responsável"
              className="pr-10"
            />
            <IconMail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </FormField>
        <FormField
          htmlFor="password"
          label="Password"
          error={state.fieldErrors?.password}
          className="col-span-2"
        >
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Digite a password"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={
                showPassword ? "Ocultar password" : "Mostrar password"
              }
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </Button>
          </div>
        </FormField>
        <FormField
          htmlFor="phone"
          label="Telefone"
          error={phoneError ? [phoneError] : state.fieldErrors?.phone}
          className="col-span-2"
        >
          <div className="flex">
            <select
              aria-label="Código do país"
              value={dialCode}
              onChange={(e) => {
                setDialCode(e.target.value);
                setPhoneError(null);
              }}
              className="h-10 w-40 shrink-0 truncate rounded-l-lg border border-input border-r-0 bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {PHONE_COUNTRIES.map((country) => (
                <option
                  key={`${country.dialCode}-${country.name}`}
                  value={country.dialCode}
                >
                  {country.flag} {country.name} {country.dialCode}
                </option>
              ))}
            </select>
            <Input
              id="phone"
              inputMode="tel"
              required
              placeholder="Número de telefone"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(formatPhoneNumber(e.target.value, dialCode));
                setPhoneError(null);
              }}
              className="rounded-l-none"
            />
          </div>
          <input
            type="hidden"
            name="phone"
            value={`${dialCode} ${phoneNumber}`.trim()}
          />
        </FormField>
        <FormField
          htmlFor="nif"
          label="NIF"
          error={state.fieldErrors?.nif}
          className="col-span-2"
        >
          <div className="relative">
            <Input
              id="nif"
              name="nif"
              required
              placeholder="Digite o NIF"
              className="pr-10"
            />
            <IconId className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </FormField>
        <FormField
          htmlFor="address"
          label="Morada"
          error={state.fieldErrors?.address}
          className="col-span-2"
        >
          <div className="relative">
            <Input
              id="address"
              name="address"
              required
              placeholder="Digite a morada"
              className="pr-10"
            />
            <IconMapPin className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </FormField>
        <FormField
          htmlFor="responsible_name"
          label="Nome do responsável"
          error={state.fieldErrors?.responsible_name}
          className="col-span-2"
        >
          <div className="relative">
            <Input
              id="responsible_name"
              name="responsible_name"
              required
              placeholder="Digite o nome do responsável"
              className="pr-10"
            />
            <IconUser className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </FormField>
        <FormField
          htmlFor="responsible_id_document"
          label="Documento de identificação do responsável"
          error={state.fieldErrors?.responsible_id_document}
          className="col-span-2"
        >
          <div className="relative">
            <Input
              id="responsible_id_document"
              type="file"
              multiple
              required
              onChange={(e) =>
                setDocumentFiles(Array.from(e.target.files ?? []))
              }
              className="cursor-pointer pr-10 file:me-3 file:h-full file:border-0 file:bg-muted file:px-3 file:text-sm file:font-medium"
            />
            <IconUpload className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {documentFiles.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {documentFiles.map((file) => (
                <li
                  key={file.name}
                  className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {file.name}
                </li>
              ))}
            </ul>
          )}
          <input
            type="hidden"
            name="responsible_id_document"
            value={documentFiles.map((file) => file.name).join(", ")}
          />
        </FormField>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "A criar…" : "Registar empresa"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Já tens conta?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}

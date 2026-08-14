"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import {
  IconAlertCircle,
  IconChevronDown,
  IconCircleCheck,
} from "@tabler/icons-react";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  validatePhoneNumberLength,
} from "libphonenumber-js";

import { cn } from "@/lib/utils";

type CountryCode = ReturnType<typeof getCountries>[number];

interface CountryEntry {
  code: string;
  dial: string;
  name: string;
  flag: string;
}

/**
 * Lista completa de países (metadata do libphonenumber-js) com bandeira emoji
 * e código de chamada. O `Intl.DisplayNames` dá o nome em português; cai para o
 * código ISO se o runtime não o suportar.
 */
function buildCountries(): CountryEntry[] {
  const names = new Intl.DisplayNames(["pt"], { type: "region" });
  return getCountries()
    .map((code) => ({
      code,
      dial: getCountryCallingCode(code),
      name: (() => {
        try {
          return names.of(code) ?? code;
        } catch {
          return code;
        }
      })(),
      flag: flagEmoji(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt"));
}

function flagEmoji(code: string): string {
  return String.fromCodePoint(
    ...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

function formatNational(countryCode: string, digits: string): string {
  if (!digits) return "";
  return new AsYouType(countryCode as CountryCode).input(digits);
}

interface CountrySelectProps {
  countries: CountryEntry[];
  value: string;
  onSelect: (code: string) => void;
}

/**
 * Dropdown de países. Fechado mostra apenas a bandeira + código de chamada
 * (ex.: "🇦🇴 +244") para o input ficar compacto; a lista aberta mostra
 * bandeira + nome + código.
 */
function CountrySelect({ countries, value, onSelect }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(value);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = countries.find((c) => c.code === value) ?? countries[0];

  useEffect(() => {
    if (!open) return;
    function close(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node))
        setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  function openList() {
    setHighlight(value);
    setOpen(true);
  }

  function move(dir: 1 | -1) {
    const idx = countries.findIndex((c) => c.code === highlight);
    const next =
      countries[Math.min(Math.max(idx + dir, 0), countries.length - 1)];
    setHighlight(next.code);
    document
      .querySelector(`[data-country-option="${next.code}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (
      !open &&
      (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      openList();
      return;
    }
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(highlight);
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative h-full">
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="País do telefone"
        title={selected ? `${selected.name} (+${selected.dial})` : undefined}
        className="flex h-full cursor-pointer items-center gap-1 pr-1.5 pl-3 outline-none"
      >
        <span className="text-base leading-none">
          {selected ? selected.flag : "…"}
        </span>
        {selected ? (
          <span className="text-xs font-medium tabular-nums">
            +{selected.dial}
          </span>
        ) : null}
        <IconChevronDown
          size={14}
          className="text-muted-foreground"
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Escolher o país"
          className="absolute top-full left-0 z-50 mt-1 max-h-64 w-72 overflow-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {countries.map((entry) => (
            <button
              key={entry.code}
              type="button"
              role="option"
              data-country-option={entry.code}
              aria-selected={entry.code === value}
              onClick={() => {
                onSelect(entry.code);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlight(entry.code)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm",
                entry.code === highlight
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground",
              )}
            >
              <span className="text-base leading-none">{entry.flag}</span>
              <span className="flex-1 truncate">{entry.name}</span>
              <span className="text-xs text-muted-foreground">
                +{entry.dial}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface PhoneInputProps extends Omit<
  ComponentProps<"input">,
  "name" | "type" | "value" | "onChange"
> {
  /** ISO do país seleccionado por omissão (ex.: "AO"). */
  defaultCountry?: string;
  /**
   * Nome do campo escondido enviado à Server Action — o valor completo vai no
   * formato escolhido: código do país primeiro e depois o número com o
   * espaçamento do país, ex.: "+244 951-611-197".
   */
  name?: string;
}

export function PhoneInput({
  defaultCountry = "AO",
  name = "phone",
  className,
  ...props
}: PhoneInputProps) {
  const countries = useMemo(() => buildCountries(), []);
  const [country, setCountry] = useState(defaultCountry);
  const [national, setNational] = useState("");

  const dial = getCountryCallingCode(country as CountryCode);
  const formatted = formatNational(country, national);
  const fullNumber = national ? `+${dial} ${formatted.replace(/ /g, "-")}` : "";
  const valid = Boolean(fullNumber) && isValidPhoneNumber(fullNumber);
  const invalid = Boolean(fullNumber) && !valid;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let digits = event.target.value.replace(/\D/g, "");
    if (digits.startsWith(dial)) digits = digits.slice(dial.length);
    const nextFull = `+${dial} ${formatNational(country, digits).replace(/ /g, "-")}`;
    if (
      validatePhoneNumberLength(nextFull, country as CountryCode) === "TOO_LONG"
    )
      return;
    setNational(digits);
  }

  return (
    <div
      className={cn(
        "flex h-10 w-full min-w-0 items-center rounded-lg border border-input bg-background shadow-xs transition-[color,box-shadow]",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        invalid && "border-destructive",
        className,
      )}
    >
      <CountrySelect
        countries={countries}
        value={country}
        onSelect={(code) => {
          setCountry(code);
          setNational("");
        }}
      />
      <div aria-hidden className="mx-1 h-5 w-px bg-border" />
      <input
        type="tel"
        inputMode="tel"
        value={formatted}
        onChange={handleChange}
        aria-invalid={invalid || undefined}
        className="h-full w-full min-w-0 border-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
        {...props}
      />
      {fullNumber ? (
        valid ? (
          <IconCircleCheck
            aria-hidden
            title="Número válido"
            className="mr-3 size-5 shrink-0 text-emerald-500"
          />
        ) : (
          <IconAlertCircle
            aria-hidden
            title="Número inválido para o país seleccionado"
            className="mr-3 size-5 shrink-0 text-destructive"
          />
        )
      ) : null}
      <input type="hidden" name={name} value={fullNumber} />
    </div>
  );
}

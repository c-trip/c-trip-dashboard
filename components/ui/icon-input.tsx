"use client";

import { useState, type ComponentProps } from "react";
import { IconEye, IconEyeOff, type TablerIcon } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface IconInputProps extends ComponentProps<"input"> {
  /** Ícone à esquerda (ícones do @tabler/icons-react). */
  icon?: TablerIcon;
  /** Campo de password com botão de olho para mostrar/ocultar. */
  isPassword?: boolean;
}

export function IconInput({
  icon: Icon,
  isPassword,
  type,
  className,
  ...props
}: IconInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      {Icon ? (
        <Icon
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      ) : null}
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        data-slot="input"
        className={cn(
          "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow]",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          Icon && "pl-10",
          isPassword && "pr-10",
          className,
        )}
        {...props}
      />
      {isPassword ? (
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "Ocultar password" : "Mostrar password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </button>
      ) : null}
    </div>
  );
}

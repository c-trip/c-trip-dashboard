"use client";

import {
  Children,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconCheck } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/**
 * Assistente de passos com indicador e transição deslizante (baseado no Stepper
 * do React Bits, adaptado às cores e componentes da app). `step` é controlado
 * pelo pai — o rodapé (Voltar / avançar) é responsabilidade de quem usa, para
 * poder validar cada passo ou submeter um form no último.
 */
export function Stepper({
  step,
  labels,
  children,
}: {
  /** Índice 0-based do passo actual. */
  step: number;
  labels: string[];
  children: ReactNode;
}) {
  const items = Children.toArray(children);
  const total = items.length;
  const [height, setHeight] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        {labels.slice(0, total).map((label, index) => {
          const status =
            index === step ? "active" : index < step ? "done" : "todo";
          return (
            <div
              key={label}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    status === "todo" && "bg-muted text-muted-foreground",
                    status === "active" && "bg-primary text-primary-foreground",
                    status === "done" && "bg-primary/15 text-primary",
                  )}
                >
                  {status === "done" ? <IconCheck size={15} /> : index + 1}
                </span>
                <span
                  className={cn(
                    "text-sm whitespace-nowrap",
                    status === "active"
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
              {index < total - 1 ? (
                <span
                  className={cn(
                    "mx-3 h-px flex-1 transition-colors",
                    index < step ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <motion.div
        className="relative overflow-hidden"
        animate={{ height: height || "auto" }}
        transition={{ type: "spring", duration: 0.35, bounce: 0 }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <SlideIn key={step} onHeight={setHeight}>
            {items[step]}
          </SlideIn>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function SlideIn({
  children,
  onHeight,
}: {
  children: ReactNode;
  onHeight: (h: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) onHeight(ref.current.offsetHeight);
  }, [children, onHeight]);

  return (
    <motion.div
      ref={ref}
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0, position: "absolute" }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="inset-x-0 top-0"
    >
      {children}
    </motion.div>
  );
}

/** Envolve o conteúdo de um passo. */
export function Step({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Carrossel de destinos do painel de autenticação. Funciona com qualquer número
 * de slides (>= 1). Imagens em `public/imgs/` — troca aqui os `src` se precisares.
 */
const SLIDES = [
  {
    src: "/imgs/img2.png",
    alt: "Motorista a preparar a partida do autocarro",
    title: "Gere rotas, frota e bilhetes num só painel",
    subtitle:
      "Acompanha viagens, motoristas e pagamentos de forma simples e organizada.",
  },
  {
    src: "/imgs/image4.jpeg",
    alt: "Passageiros a embarcar numa viagem interprovincial",
    title: "Vende bilhetes sem filas nem papelada",
    subtitle:
      "Emite, valida e reembolsa bilhetes a partir de qualquer terminal.",
  },
  {
    src: "/imgs/image5.jpeg",
    alt: "Autocarro em estrada ao final da tarde",
    title: "Sabe onde está cada viagem, em tempo real",
    subtitle: "Ocupação, atrasos e receitas actualizados a cada partida.",
  },
  {
    src: "/imgs/image6.jpeg",
    alt: "Motorista na porta do autocarro com um tablet",
    title: "Valida bilhetes e embarques num toque",
    subtitle:
      "O operador confere o manifesto no tablet, mesmo sem internet na estrada.",
  },
];

const INTERVAL = 3000;

export function AuthCarousel() {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = SLIDES.length;

  const start = useCallback(() => {
    if (timer.current || total < 2) return;
    timer.current = setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, INTERVAL);
  }, [total]);

  const stop = useCallback(() => {
    if (!timer.current) return;
    clearInterval(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  const goTo = (index: number) => {
    stop();
    setActive(index);
    start();
  };

  return (
    <section
      aria-label="Destaques da plataforma"
      aria-roledescription="carrossel"
      onMouseEnter={stop}
      onMouseLeave={start}
      onFocus={stop}
      onBlur={start}
      className="relative hidden w-1/2 overflow-hidden rounded-2xl border-2 lg:block"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} de ${total}`}
          aria-hidden={i !== active || undefined}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="50vw"
            priority={i === 0}
            className={`object-cover transition-transform duration-[6000ms] ease-out motion-reduce:transition-none ${
              i === active ? "scale-105" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Véu para o texto ficar legível sobre qualquer foto */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 p-10">
        <div className="relative min-h-28">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              aria-hidden={i !== active || undefined}
              className={`absolute inset-x-0 bottom-0 space-y-2 text-white transition-all duration-700 ease-out motion-reduce:transition-none ${
                i === active
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              <h2 className="text-3xl font-bold leading-tight text-balance">
                {slide.title}
              </h2>
              <p className="text-sm text-white/80 text-balance">
                {slide.subtitle}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-1.5">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ver destaque ${i + 1}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                  i === active
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-medium text-white/80" aria-hidden>
            {active + 1} / {total}
          </span>
        </div>
      </div>

      {/* Anúncio do slide activo a leitores de ecrã (título muda, a imagem não) */}
      <p className="sr-only" aria-live="polite">
        {SLIDES[active].title}
      </p>
    </section>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Troca os `src` pelas tuas imagens (public/images/auth/...).
 * O carrossel funciona com qualquer número de slides (>= 1).
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
    src: "/imgs/img2.png",
    alt: "Passageiros a embarcar numa viagem interprovincial",
    title: "Vende bilhetes sem filas nem papelada",
    subtitle:
      "Emite, valida e reembolsa bilhetes a partir de qualquer terminal.",
  },
  {
    src: "/imgs/img3.png",
    alt: "Autocarro em estrada ao final da tarde",
    title: "Sabe onde está cada viagem, em tempo real",
    subtitle: "Ocupação, atrasos e receitas actualizados a cada partida.",
  },
];

const INTERVAL = 3000;

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (timer.current || SLIDES.length < 2) return;
    timer.current = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
  }, []);

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
    <div className="flex min-h-svh bg-muted/40 p-2 lg:gap-2 lg:p-3">
      {/* Painel do formulário */}
      <div className="relative flex w-full flex-col rounded-2xl px-4 py-6 sm:px-10 lg:w-1/2 border-2 bg-card text-card-foreground shadow-xs">
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            {/* Card, inputs e botões das páginas entram aqui sem alterações. */}
            {children}
          </div>
        </main>

        <footer className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()}. Todos os direitos reservados.
          </span>
          <span>Portal v1.2.15</span>
        </footer>
      </div>

      {/* Carrossel */}
      <section
        aria-label="Destaques da plataforma"
        aria-roledescription="carrossel"
        onMouseEnter={stop}
        onMouseLeave={start}
        className="relative hidden w-1/2 overflow-hidden rounded-2xl lg:block border-2"
      >
        {SLIDES.map((slide, i) => (
          <div
            key={`${slide.src}-${i}`}
            aria-hidden={i !== active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              loading={i === 0 ? "eager" : "lazy"}
              className={`size-full object-cover transition-transform duration-[6000ms] ease-out motion-reduce:transition-none ${
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
                key={`${slide.src}-${i}`}
                aria-hidden={i !== active}
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

          <div className="mt-8 flex gap-1.5">
            {SLIDES.map((slide, i) => (
              <button
                key={`${slide.src}-${i}`}
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
        </div>
      </section>
    </div>
  );
}

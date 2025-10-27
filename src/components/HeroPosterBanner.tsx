import { useEffect, useState } from "react";

type Poster = { src: string; alt: string };

type Props = {
  logoSrc: string;           // /logo/casartigiani_logo.png
  title: string;             // "FINANZIAMENTI, CONTRIBUTI E SERVIZI PER LE IMPRESE ARTIGIANE"
  posters: Poster[];         // locandine da mostrare nel modal
  bg?: string;               // opzionale: classe tailwind per lo sfondo (es. "from-rose-50 to-white")
};

export default function HeroPosterBanner({ logoSrc, title, posters, bg = "from-gray-50 to-white" }: Props) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % posters.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + posters.length) % posters.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, posters.length]);

  return (
    <>
      {/* BANNER */}
      <button
        onClick={() => { setIdx(0); setOpen(true); }}
        className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border bg-gradient-to-r p-5 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/60"
        aria-label={`Apri locandine: ${title}`}
      >
        <img
          src={logoSrc}
          alt="Casartigiani Palermo"
          className="h-12 w-auto md:h-14"
          loading="lazy"
          decoding="async"
        />
        <h2 className="text-center text-base font-extrabold tracking-tight text-rose-700 md:text-xl">
          {title}
        </h2>
        <span className="ml-auto hidden rounded-full bg-rose-700 px-3 py-1 text-xs font-semibold text-white md:block">
          Clicca per visualizzare
        </span>
        <div className={`absolute inset-0 -z-10 bg-gradient-to-r ${bg}`} />
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/80" aria-modal="true" role="dialog">
          <button className="absolute inset-0 h-full w-full" onClick={() => setOpen(false)} aria-label="Chiudi" />
          <div className="pointer-events-none absolute inset-4 flex items-center justify-center">
            <figure className="pointer-events-auto max-h-full max-w-5xl overflow-hidden rounded-2xl bg-white">
              <img
                src={posters[idx].src}
                alt={posters[idx].alt}
                className="h-full w-full object-contain"
              />
            </figure>

            {posters.length > 1 && (
              <>
                <button
                  onClick={() => setIdx((i) => (i - 1 + posters.length) % posters.length)}
                  className="pointer-events-auto absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg shadow"
                  aria-label="Precedente"
                >‹</button>
                <button
                  onClick={() => setIdx((i) => (i + 1) % posters.length)}
                  className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg shadow"
                  aria-label="Successiva"
                >›</button>
              </>
            )}

            <button
              onClick={() => setOpen(false)}
              className="pointer-events-auto absolute right-5 top-5 rounded-full bg-white/90 px-3 py-1 text-sm shadow"
              aria-label="Chiudi"
            >
              Chiudi ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Only scrolling controls run on the client; movie cards arrive rendered by the server.
export default function MovieCarousel({ children }: { children: ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => setEdges({ start: element.scrollLeft <= 2, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); element.removeEventListener("scroll", update); };
  }, []);

  function move(direction: number) {
    const element = rail.current;
    if (!element) return;
    const card = element.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap) : element.clientWidth;
    element.scrollBy({ left: direction * step, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  const button = "grid size-10 place-items-center rounded-full border border-violet-300/30 bg-violet-500/15 text-lg text-slate-100 transition hover:border-teal-200/60 hover:bg-violet-500/30 focus-visible:ring-2 focus-visible:ring-teal-200 disabled:cursor-default disabled:opacity-30";
  return <div>
    <div className="mb-2 flex items-center justify-between gap-3"><p id="carousel-help" className="text-[11px] text-slate-300">Desliza, usa los botones o las teclas ← →</p><div className="flex gap-2"><button type="button" className={button} aria-label="Película anterior" aria-controls="featured-carousel" disabled={edges.start} onClick={() => move(-1)}>←</button><button type="button" className={button} aria-label="Película siguiente" aria-controls="featured-carousel" disabled={edges.end} onClick={() => move(1)}>→</button></div></div>
    <div ref={rail} id="featured-carousel" role="region" aria-label="Películas destacadas, desplazamiento horizontal" aria-describedby="carousel-help" tabIndex={0} onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }} className="grid auto-cols-[150px] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain rounded-xl px-1 pb-5 pt-3 [scrollbar-color:#8b5cf6_#1e293b] sm:auto-cols-[175px] lg:auto-cols-[190px] [&>article]:snap-start snap-x snap-mandatory">{children}</div>
  </div>;
}

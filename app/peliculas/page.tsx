import Link from "next/link";
import { CineFooter, CineHeader } from "./components/CineSections";

export default function WelcomePage() {
  return (
    <div id="inicio" className="cine-explorer min-h-screen font-sans text-slate-50">
      <a href="#contenido" className="fixed -top-20 left-4 z-[100] rounded-lg bg-teal-200 p-3 text-slate-950 focus:top-4">Saltar al contenido</a>
      <CineHeader />
      <main id="contenido" className="relative isolate flex min-h-[78svh] items-center overflow-hidden bg-[#111827]">
        {/* Original panoramic vector artwork, created for this project; no third-party movie imagery. */}
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[url('/cine-universe.svg')] bg-cover bg-[68%_center] sm:bg-center" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#111827]/95 via-[#111827]/65 to-[#111827]/10" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#111827] via-transparent to-violet-950/20" />
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200/25 bg-slate-900/35 px-3 py-2 text-[10px] font-semibold tracking-[.2em] text-teal-100 backdrop-blur-sm"><span className="size-1.5 rounded-full bg-teal-200" />BIENVENIDO A CINE EXPLORER</p>
          <h1 className="max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">Cada película es un <span className="bg-gradient-to-r from-violet-300 via-sky-200 to-teal-200 bg-clip-text text-transparent">nuevo universo</span></h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-slate-200">Hay historias que te llevan más lejos. Descubre películas y series, encuentra tu próxima gran historia y déjate sorprender.</p>
          <div className="mt-9 flex flex-col gap-3 min-[400px]:flex-row"><Link prefetch={false} href="/peliculas/explorar" className="rounded-xl bg-violet-600 px-6 py-4 text-center text-sm font-semibold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:bg-violet-500 motion-reduce:transform-none">Explorar cartelera <span aria-hidden="true">↗</span></Link><Link prefetch={false} href="/peliculas/explorar#buscar" className="rounded-xl border border-white/25 bg-slate-900/40 px-6 py-4 text-center text-sm font-semibold text-white backdrop-blur-sm transition hover:border-cyan-200/60 hover:bg-slate-800/70">Buscar películas</Link></div>
          <p className="mt-8 text-xs text-slate-400">Películas y series · Información de OMDb · Sin registro</p>
        </div>
      </main>
      <CineFooter />
    </div>
  );
}

import Link from "next/link";
import MoviePoster from "./MoviePoster";
import { available, type FeaturedMovie } from "./movie";

const container = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";
const navLink = "rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-teal-200 active:bg-violet-500/20";

export function CineHeader() {
  return (
    <header className="border-b border-white/10 bg-[#111827]/90">
      <div className={`${container} flex flex-wrap items-center justify-between gap-4 py-5`}>
        <a href="/peliculas" aria-label="Cine Explorer, inicio" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 shadow-lg shadow-violet-500/20" aria-hidden="true"><svg width="23" height="23" viewBox="0 0 24 24" fill="none"><path d="m9 5 11 7-11 7V5Z" fill="white"/><path d="M4 5v14" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg></span>
          <span className="text-lg font-bold tracking-tight text-slate-50">Cine<span className="text-violet-300">Explorer</span><span className="mt-0.5 block text-[9px] font-medium tracking-[.22em] text-slate-400">DESCUBRE TU PRÓXIMA HISTORIA</span></span>
        </a>
        <nav aria-label="Navegación de Cine Explorer" className="flex w-full items-center justify-between gap-1 sm:w-auto sm:gap-3">
          <a className={navLink} href="/peliculas/explorar#destacadas">Destacadas</a><a className={navLink} href="/peliculas/explorar#seleccion">Selección</a><a className="rounded-lg border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:border-cyan-300/50 hover:bg-violet-500/25 active:scale-95" href="/peliculas/explorar#buscar">Explorar ↗</a>
        </nav>
      </div>
    </header>
  );
}

function MosaicTile({ movie, compact = false }: { movie: FeaturedMovie; compact?: boolean }) {
  return (
    <a href={`#movie-${movie.imdbID}`} aria-label={`Ver ${movie.Title} en destacadas`} className={`group relative isolate block h-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#252044] to-[#153348] transition duration-300 hover:-translate-y-1 hover:border-teal-200/50 hover:shadow-xl hover:shadow-cyan-950/40 focus-visible:ring-2 focus-visible:ring-teal-200 ${compact ? "min-h-36" : "min-h-64"}`}>
      <MoviePoster src={movie.Poster} title={movie.Title} fill contain />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4"><p className="mb-1 text-[10px] text-teal-200">{movie.Year}{available(movie.imdbRating) ? ` · ★ ${movie.imdbRating}` : ""}</p><h3 className="text-sm font-bold leading-5 text-white">{movie.Title}<span aria-hidden="true" className="ml-2 inline-block text-cyan-200 transition group-hover:translate-x-1">↗</span></h3>{available(movie.Genre) && <p className="ce-reveal mt-2 text-[10px] leading-4 text-slate-200">{movie.Genre}</p>}</div>
    </a>
  );
}

export function MovieHero({ movies }: { movies: FeaturedMovie[] }) {
  const movie = movies[0];
  return (
    <section className={`${container} py-7 sm:py-9`} aria-labelledby="hero-title">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-2 text-[10px] font-semibold tracking-[.23em] text-teal-200">TU PORTAL A OTRAS HISTORIAS</p><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Un universo. <span className="bg-gradient-to-r from-violet-300 via-sky-200 to-teal-200 bg-clip-text text-transparent">Infinitas historias.</span></h2></div><a href="/peliculas/explorar#buscar" className="text-xs font-medium text-violet-200 hover:text-teal-200">Encuentra la tuya ↗</a></div>
      <div className="grid min-w-0 grid-cols-2 gap-4 md:grid-cols-12 md:items-end lg:gap-5">
        <article className="group relative isolate col-span-2 min-w-0 overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-br from-[#252044] via-[#172d48] to-[#143c43] shadow-xl shadow-indigo-950/30 transition duration-300 hover:-translate-y-1 hover:border-violet-300/50 hover:shadow-2xl hover:shadow-violet-950/40 focus-within:border-teal-200/50 md:col-span-6">
          <div className="relative h-[470px] sm:h-[460px]">
            {movie && <MoviePoster src={movie.Poster} title={movie.Title} priority fill contain />}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/65 to-transparent" />
            <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-slate-950/65 px-3 py-1.5 text-[9px] font-semibold tracking-[.18em] text-teal-200 backdrop-blur-md">EN EL FOCO · CINE EXPLORER</span>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <h1 id="hero-title" className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{movie?.Title ?? "Tu próxima gran historia"}</h1>
              {movie && <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-200"><span>{movie.Year}</span>{available(movie.Runtime) && <span>{movie.Runtime}</span>}{available(movie.imdbRating) && <span className="rounded-md bg-teal-300/15 px-2 py-1 font-semibold text-teal-100">★ {movie.imdbRating} IMDb</span>}</div>}
              {available(movie?.Genre) && <p className="mt-2 text-[11px] text-cyan-200">{movie.Genre}</p>}
              <p className="mt-3 max-w-xl text-xs leading-5 text-slate-100 sm:text-sm">{available(movie?.Plot) ? movie.Plot : "La selección no está disponible en este momento. Explora películas y series con el buscador."}</p>
              <div className="mt-5 flex flex-wrap gap-2"><a href="/peliculas/explorar#buscar" className="rounded-xl bg-violet-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 active:scale-95">Explorar películas ↗</a><a href="#destacadas" className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">Ver destacadas ↓</a></div>
            </div>
          </div>
        </article>
        {movies[1] && <div className="h-[332px] min-w-0 md:col-span-3 md:h-[410px]"><MosaicTile movie={movies[1]} /></div>}
        <div className="grid h-[332px] min-w-0 grid-cols-1 grid-rows-2 gap-3 md:col-span-3 md:h-[440px] md:grid-rows-[1.15fr_1fr] lg:gap-4">{movies.slice(2,4).map((item) => <MosaicTile key={item.imdbID} movie={item} compact />)}</div>
        {movies.slice(4,6).map((item, index) => <a key={item.imdbID} href={`#movie-${item.imdbID}`} className={`group col-span-2 flex min-w-0 items-center gap-4 overflow-hidden rounded-2xl border border-white/10 p-3 transition hover:border-cyan-200/40 md:col-span-6 ${index === 0 ? "bg-gradient-to-r from-violet-900/25 to-slate-800/20" : "bg-gradient-to-r from-cyan-900/25 to-slate-800/20"}`}><div className="w-12 shrink-0 overflow-hidden rounded-md"><MoviePoster src={item.Poster} title={item.Title} /></div><div className="min-w-0"><p className="text-[9px] tracking-widest text-teal-200">TAMBIÉN EN TU UNIVERSO</p><h3 className="mt-1 text-sm font-semibold text-slate-100">{item.Title}</h3><p className="mt-1 text-[10px] text-slate-400">{item.Year}{available(item.Genre) ? ` · ${item.Genre}` : ""}</p></div><span aria-hidden="true" className="ml-auto pr-2 text-cyan-200 transition group-hover:translate-x-1">↗</span></a>)}
      </div>
      <p className="mt-3 text-[10px] text-slate-400">Una selección de Cine Explorer · Datos reales de OMDb · SSR</p>
    </section>
  );
}

export function MovieCard({ movie, index }: { movie: FeaturedMovie; index: number }) {
  return (
    <article id={`movie-${movie.imdbID}`} tabIndex={0} className="group min-w-0 scroll-mt-6 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-200">
      <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg shadow-slate-950/20 transition duration-300 group-hover:-translate-y-1 group-hover:border-violet-400/50 group-focus-visible:border-teal-200/50 group-focus-within:border-teal-200/50 group-hover:shadow-xl group-hover:shadow-violet-950/40">
        <MoviePoster src={movie.Poster} title={movie.Title} />
        <span className="absolute left-2 top-2 rounded-md border border-white/15 bg-slate-950/75 px-2 py-1 text-[10px] text-slate-200 backdrop-blur-sm">{String(index + 1).padStart(2, "0")}</span>
        {available(movie.imdbRating) && <span className="absolute right-2 top-2 z-10 rounded-md bg-slate-950/90 px-2 py-1 text-[11px] font-semibold text-teal-200">★ {movie.imdbRating}</span>}
        <div className="ce-reveal absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent px-3 pb-3 pt-10"><p className="mb-2 line-clamp-3 text-[11px] leading-5 text-slate-200">{available(movie.Plot) ? movie.Plot : movie.Title}</p><a href="/peliculas/explorar#buscar" className="inline-flex rounded-md border border-teal-200/30 bg-slate-900/90 px-2 py-1 text-[10px] text-teal-100">Ir al buscador ↗</a></div>
      </div>
      <h3 className="mt-3 text-sm font-semibold leading-5 text-slate-100">{movie.Title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-400">{movie.Year}{available(movie.Genre) ? ` · ${movie.Genre.split(",")[0]}` : ""}</p>
    </article>
  );
}

export function EditorialSelection({ movies }: { movies: FeaturedMovie[] }) {
  return (
    <section id="seleccion" className="scroll-mt-6 py-8 sm:py-10" aria-labelledby="selection-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-1 text-[10px] font-semibold tracking-[.2em] text-teal-300">SIGUE EXPLORANDO</p><h2 id="selection-title" className="text-2xl font-bold tracking-tight text-slate-50">Más universos por descubrir</h2></div><span className="text-xs text-slate-400">Selección editorial, sin rankings</span></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{movies.slice(1, 4).map((movie) => <article key={movie.imdbID} className="group flex overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#252044]/70 to-slate-800/40 transition hover:border-teal-300/30"><div className="w-28 shrink-0 sm:w-32"><MoviePoster src={movie.Poster} title={movie.Title} /></div><div className="flex min-w-0 flex-col justify-center p-4"><p className="text-[10px] text-cyan-300">{movie.Year}{available(movie.imdbRating) ? ` · ★ ${movie.imdbRating}` : ""}</p><h3 className="mt-1 text-base font-bold leading-5 text-slate-100">{movie.Title}</h3>{available(movie.Genre) && <p className="mt-2 text-[10px] text-violet-300">{movie.Genre}</p>}{available(movie.Plot) && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{movie.Plot}</p>}</div></article>)}</div>
    </section>
  );
}

export function CineFooter() {
  return <footer className="border-t border-white/10 bg-slate-950/25"><div className={`${container} flex flex-col justify-between gap-6 py-7 sm:flex-row sm:items-center`}><div><a href="/peliculas" className="text-base font-bold text-slate-100">Cine<span className="text-violet-300">Explorer</span><span className="ml-2 text-teal-300">↗</span></a><p className="mt-1 text-[10px] text-slate-400">Laboratorio 09 · Información de OMDb</p></div><nav aria-label="Prácticas del laboratorio" className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-400"><Link className="transition hover:text-cyan-200" href="/">Laboratorio</Link><Link className="transition hover:text-cyan-200" href="/pokemon-csr">Pokémon CSR</Link><Link className="transition hover:text-cyan-200" href="/pokemon-ssr">Pokémon SSR</Link><Link className="transition hover:text-cyan-200" href="/weather">Weather</Link><a className="text-teal-200 hover:text-teal-100" href="#inicio">Volver arriba ↑</a></nav></div></footer>;
}


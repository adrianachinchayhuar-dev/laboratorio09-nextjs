import MovieCarousel from "../components/MovieCarousel";
import MovieSearch from "../MovieSearch";
import { CineFooter, CineHeader, EditorialSelection, MovieCard, MovieHero } from "../components/CineSections";
import { getFeaturedMovies } from "../lib/featured";
// Keep the cinematic homepage rendered on the server for each request.
export const dynamic = "force-dynamic";
export default async function ExplorarPage() {
    const movies = await getFeaturedMovies();
    return (
      <div className="cine-explorer min-h-screen bg-[#111827] font-sans text-[#F8FAFC]" id="inicio">
        <a href="#contenido" className="fixed -top-20 left-4 z-[100] rounded-lg bg-teal-200 p-3 text-slate-950 focus:top-4">Saltar al contenido</a>
        <CineHeader />
        <main id="contenido">
          <div className="mx-auto max-w-7xl px-5 pt-7 sm:px-8 lg:px-12"><div id="buscar" className="scroll-mt-6"><MovieSearch /></div></div>
          <MovieHero movies={movies} />
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <section id="destacadas" className="scroll-mt-6 border-b border-white/10 pb-8 pt-3 sm:pb-10" aria-labelledby="featured-title">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div><p className="mb-1 text-[10px] font-semibold tracking-[.2em] text-violet-300">ELIGE TU PRÓXIMA PELÍCULA</p><h2 id="featured-title" className="text-2xl font-bold tracking-tight">Películas destacadas<span className="text-teal-300">.</span></h2></div>
                <p className="text-xs text-slate-400">Tu selección, a tu ritmo</p>
              </div>
              {movies.length > 0 ? <MovieCarousel>{movies.map((movie, index) => <MovieCard key={movie.imdbID} movie={movie} index={index} />)}</MovieCarousel> : <p role="status" className="rounded-xl border border-dashed border-violet-400/30 bg-violet-400/5 p-6 text-sm text-slate-300">No pudimos cargar la selección de OMDb. El buscador continúa disponible más abajo.</p>}
            </section>
            <EditorialSelection movies={movies} />

          </div>
        </main>
        <CineFooter />
      </div>
    );
}

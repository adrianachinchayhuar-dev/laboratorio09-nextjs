
"use client";

import { useEffect, useState } from "react";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

interface MovieDetails extends Movie {
  Plot: string;
  Genre: string;
  Director: string;
  Actors: string;
  Runtime: string;
  imdbRating: string;
  Released: string;
  Writer: string;
  Language: string;
  Country: string;
  Awards: string;
  Rated: string;
  BoxOffice: string;
  Ratings?: { Source: string; Value: string }[];
  totalSeasons?: string;
  Metascore?: string;
  imdbVotes?: string;
  DVD?: string;
  Production?: string;
  Website?: string;
}

export default function MovieSearch() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"" | "movie" | "series">("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] =
    useState<MovieDetails | null>(null);
  const [loadingDetails, setLoadingDetails] =
    useState(false);

  // CSR: debounce, type filtering and paging share one cancellable request.
  useEffect(() => {
    if (search.trim().length < 3) {
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/movies?${new URLSearchParams({ s: search.trim(), page: String(page), ...(type ? { type } : {}) })}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Error al realizar la búsqueda");
        }

        const data = await response.json();
        if (controller.signal.aborted) return;

        if (data.Response === "True") {
          setMovies(data.Search ?? []);
          setTotal(Number(data.totalResults) || 0);
        } else {
          setMovies([]);
          setTotal(0);
          setError(data.Error || "No se encontraron resultados");
        }
      } catch (err) {
        if (
          err instanceof Error &&
          err.name !== "AbortError"
        ) {
          setError("No se pudo realizar la búsqueda");
          setMovies([]);
          setTotal(0);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, type, page]);

  function resetResults(value: string, nextType = type) {
    setSearch(value);
    setType(nextType);
    setPage(1);
    setMovies([]);
    setTotal(0);
    setError("");
    setLoading(value.trim().length >= 3);
  }

  const totalPages = Math.min(100, Math.ceil(total / 10));
  function changePage(nextPage: number) {
    setPage(nextPage);
    setLoading(true);
    setMovies([]);
    setError("");
  }

  // Consultar detalles de una película o serie
  async function showDetails(id: string) {
    setSelectedMovie(null);
    setLoadingDetails(true);

    try {
      const response = await fetch(
        `/api/movies?i=${encodeURIComponent(id)}`
      );

      if (!response.ok) {
        throw new Error("Error al consultar detalles");
      }

      const data = await response.json();

      if (data.Response === "True") {
        setSelectedMovie(data);
      } else {
        setError(data.Error || "No se encontraron detalles");
      }
    } catch {
      setError("No se pudieron cargar los detalles");
    } finally {
      setLoadingDetails(false);
    }
  }

  return (
    <section className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-[#252044]/70 to-slate-800/30 p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Encuentra tu próxima historia
        </h2>

        <p className="text-slate-300 text-sm leading-6 mb-3">
          Escribe el nombre de una película o serie.
          Los resultados se actualizarán sin recargar la página.
        </p>

        <label htmlFor="movie-search" className="mb-2 block text-xs font-medium text-violet-200">Buscar películas y series</label>
        <div className="relative"><svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>
        <input
          id="movie-search"
          type="text"
          value={search}
          onChange={(e) => resetResults(e.target.value)}
          placeholder="Ejemplo: Batman, Marvel, Stranger Things..."
          className="w-full rounded-xl border border-violet-300/25 bg-slate-950/60 py-4 pl-12 pr-4 text-sm text-slate-50 placeholder:text-slate-400 transition focus:border-cyan-300/70 focus:outline-none focus:ring-4 focus:ring-violet-500/10"
        /></div>

        <p className="text-xs text-slate-400 mt-3">
          Escribe al menos 3 caracteres para buscar.
        </p>
      </div>

      <div role="group" aria-label="Tipo de contenido" className="mb-4 flex flex-wrap gap-2">{([{ value: "", label: "Todas" }, { value: "movie", label: "Películas" }, { value: "series", label: "Series" }] as const).map((filter) => <button key={filter.label} type="button" aria-pressed={type === filter.value} onClick={() => resetResults(search, filter.value)} className={`rounded-full border px-4 py-2 text-xs font-medium transition ${type === filter.value ? "border-violet-300/60 bg-violet-600 text-white" : "border-white/15 bg-white/5 text-slate-300 hover:border-teal-200/50"}`}>{filter.label}</button>)}</div>
      {!loading && total > 0 && <p role="status" className="mb-3 text-xs text-slate-300">{total} resultados · Página {page} de {totalPages}</p>}

      {loading && (
        <div role="status" aria-live="polite" className="mb-4"><p className="mb-3 flex items-center gap-2 text-xs text-cyan-200"><span aria-hidden="true" className="size-3 animate-spin rounded-full border-2 border-cyan-200/25 border-t-cyan-200" />Buscando películas...</p><div aria-hidden="true" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{Array.from({length:5}, (_, index) => <div key={index} className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-3"><div className="aspect-[2/3] rounded-lg bg-violet-300/10"/><div className="mt-3 h-2 w-3/4 rounded bg-cyan-200/15"/><div className="mt-2 h-2 w-1/2 rounded bg-white/10"/></div>)}</div></div>
      )}

      {error && (
        <p className="bg-red-950 text-red-200 p-4 rounded-xl mb-6">
          {error}
        </p>
      )}

      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {movies.map((movie) => (
            <article
              key={movie.imdbID}
              className="bg-[#252044]/70 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 hover:border-violet-400/40 transition duration-300"
            >
              {movie.Poster !== "N/A" ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full aspect-[2/3] object-cover"
                />
              ) : (
                <div className="aspect-[2/3] bg-[#252044] text-slate-300 flex items-center justify-center">
                  Sin póster
                </div>
              )}

              <div className="p-4">
                <h3 className="font-bold mb-2">
                  {movie.Title}
                </h3>

                <p className="text-slate-400 text-sm">
                  {movie.Year} · {movie.Type}
                </p>

                <button
                  onClick={() => showDetails(movie.imdbID)}
                  className="mt-4 w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-medium py-2.5 rounded-lg cursor-pointer transition"
                >
                  Ver detalles
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {!error && totalPages > 1 && <nav aria-label="Paginación de resultados" className="mt-5 flex flex-wrap items-center justify-center gap-3"><button type="button" disabled={loading || page <= 1} onClick={() => changePage(page - 1)} className="rounded-lg border border-violet-300/30 px-4 py-2 text-sm hover:bg-violet-500/20 disabled:opacity-40">← Anterior</button><span aria-live="polite" className="text-xs text-slate-300">{page} / {totalPages}</span><button type="button" disabled={loading || page >= totalPages} onClick={() => changePage(page + 1)} className="rounded-lg border border-violet-300/30 px-4 py-2 text-sm hover:bg-violet-500/20 disabled:opacity-40">Siguiente →</button></nav>}

      {loadingDetails && (
        <p className="mt-6 text-cyan-200">
          Cargando detalles...
        </p>
      )}

      {selectedMovie && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalles de ${selectedMovie.Title}`}
            className="bg-[#111827] border border-violet-400/30 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 bg-violet-600 hover:bg-violet-500 px-3 py-1 rounded-lg cursor-pointer transition"
              aria-label="Cerrar detalles"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                {selectedMovie.Poster !== "N/A" && (
                  <img
                    src={selectedMovie.Poster}
                    alt={selectedMovie.Title}
                    className="w-full rounded-xl"
                  />
                )}
              </div>

              <div className="md:col-span-2 space-y-3">
                <h2 className="text-3xl font-bold pr-8">
                  {selectedMovie.Title}
                </h2>

                <p className="text-teal-200 font-semibold">
                  ⭐ IMDb: {selectedMovie.imdbRating}
                </p>

                <p className="text-slate-300">
                  {selectedMovie.Plot}
                </p>

                <p><strong>Año:</strong> {selectedMovie.Year}</p>
                <p><strong>Estreno:</strong> {selectedMovie.Released}</p>
                <p><strong>Clasificación:</strong> {selectedMovie.Rated}</p>
                <p><strong>Duración:</strong> {selectedMovie.Runtime}</p>
                <p><strong>Género:</strong> {selectedMovie.Genre}</p>
                <p><strong>Director:</strong> {selectedMovie.Director}</p>
                <p><strong>Guion:</strong> {selectedMovie.Writer}</p>
                <p><strong>Actores:</strong> {selectedMovie.Actors}</p>
                <p><strong>Idioma:</strong> {selectedMovie.Language}</p>
                <p><strong>País:</strong> {selectedMovie.Country}</p>
                <p><strong>Premios:</strong> {selectedMovie.Awards}</p>
                <p><strong>Taquilla:</strong> {selectedMovie.BoxOffice}</p>
                {([ ["Temporadas", selectedMovie.totalSeasons], ["Metascore", selectedMovie.Metascore], ["Votos IMDb", selectedMovie.imdbVotes], ["DVD", selectedMovie.DVD], ["Producción", selectedMovie.Production], ["Sitio web", selectedMovie.Website] ]).map(([label, value]) => value && value !== "N/A" ? <p key={label}><strong>{label}:</strong> {value}</p> : null)}
                {selectedMovie.Ratings?.map((rating) => <p key={rating.Source}><strong>{rating.Source}:</strong> {rating.Value}</p>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

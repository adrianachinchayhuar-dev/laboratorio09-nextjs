
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
}

export default function MovieSearch() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] =
    useState<MovieDetails | null>(null);
  const [loadingDetails, setLoadingDetails] =
    useState(false);

  // CSR: buscar películas al escribir
  useEffect(() => {
    if (search.trim().length < 3) {
      setMovies([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/movies?s=${encodeURIComponent(search.trim())}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Error al realizar la búsqueda");
        }

        const data = await response.json();

        if (data.Response === "True") {
          setMovies(data.Search ?? []);
        } else {
          setMovies([]);
          setError(data.Error || "No se encontraron resultados");
        }
      } catch (err) {
        if (
          err instanceof Error &&
          err.name !== "AbortError"
        ) {
          setError("No se pudo realizar la búsqueda");
          setMovies([]);
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
  }, [search]);

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
    <section className="mt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">
          🔎 Buscar películas y series - CSR
        </h2>

        <p className="text-slate-400 mb-5">
          Escribe el nombre de una película o serie.
          Los resultados se actualizarán sin recargar la página.
        </p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ejemplo: Batman, Marvel, Stranger Things..."
          className="w-full p-4 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
        />

        <p className="text-sm text-slate-400 mt-2">
          Escribe al menos 3 caracteres para buscar.
        </p>
      </div>

      {loading && (
        <p className="text-blue-300 mb-6">
          Buscando películas...
        </p>
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
              className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition"
            >
              {movie.Poster !== "N/A" ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="h-64 bg-slate-700 flex items-center justify-center">
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
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg cursor-pointer"
                >
                  Ver detalles
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {loadingDetails && (
        <p className="mt-6 text-blue-300">
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
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-lg cursor-pointer"
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

                <p className="text-yellow-400 font-semibold">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

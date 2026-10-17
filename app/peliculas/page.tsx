
import MovieSearch from "./MovieSearch";

interface Movie {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
  Type: string;
}

async function getPopularMovies(): Promise<Movie[]> {
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    throw new Error("Falta configurar OMDB_API_KEY");
  }

  const titles = [
    "Interstellar",
    "Titanic",
    "Inception",
    "The Avengers",
    "The Dark Knight",
    "Avatar",
  ];

  const movies = await Promise.all(
    titles.map(async (title) => {
      const params = new URLSearchParams({
        apikey: apiKey,
        t: title,
      });

      const response = await fetch(
        `https://www.omdbapi.com/?${params}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        return null;
      }

      const movie = await response.json();

      if (movie.Response === "False") {
        return null;
      }

      return movie as Movie;
    })
  );

  return movies.filter(
    (movie): movie is Movie => movie !== null
  );
}

export default async function PeliculasPage() {
  const movies = await getPopularMovies();

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">
            🎬 Cine Explorer
          </h1>
          <p className="text-slate-400 mt-3">
            Explora películas y series utilizando OMDb API
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Películas destacadas - SSR
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {movies.map((movie) => (
              <article
                key={movie.imdbID}
                className="bg-slate-800 rounded-xl overflow-hidden shadow-lg"
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

                <div className="p-3">
                  <h3 className="font-bold text-sm">
                    {movie.Title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    {movie.Year}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <MovieSearch />
      </div>
    </main>
  );
}

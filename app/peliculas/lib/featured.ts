import type { FeaturedMovie } from "../components/movie";

export async function getFeaturedMovies(): Promise<FeaturedMovie[]> {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey)
        return [];
    const titles = ["Interstellar", "Titanic", "Inception", "The Avengers", "The Dark Knight", "Avatar"];
    const movies = await Promise.all(titles.map(async (title): Promise<FeaturedMovie | null> => {
        try {
            const params = new URLSearchParams({ apikey: apiKey, t: title });
            const response = await fetch(`https://www.omdbapi.com/?${params}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
            if (!response.ok)
                return null;
            const movie = await response.json();
            if (movie.Response !== "True" || typeof movie.imdbID !== "string" || typeof movie.Title !== "string")
                return null;
            return movie as FeaturedMovie;
        }
        catch {
            // One unavailable title should not take down the homepage or CSR search.
            return null;
        }
    }));
    return movies.filter((movie): movie is FeaturedMovie => movie !== null);
}

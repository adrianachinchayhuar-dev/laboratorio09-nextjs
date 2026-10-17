export interface FeaturedMovie {
    Title: string;
    Year: string;
    Poster: string;
    imdbID: string;
    Genre?: string;
    Runtime?: string;
    Plot?: string;
    Director?: string;
    imdbRating?: string;
}
export function available(value?: string): value is string {
    return Boolean(value && value !== "N/A");
}

import { GenresCarousel } from "@/components/Genres/GenresCarousel";
import { RecentlyMoviesCarousel } from "@/components/Movies/RecentlyMoviesCarousel";
import { RecommendedMoviesCarousel } from "@/components/Movies/RecommendedMoviesCarousel";
export const metadata = { title: "Movies | MenFouTix" };
export default async function MoviesPage() {
  return (
    <div className="relative min-h-screen bg-black pt-20">
      <RecommendedMoviesCarousel />
      <div className="py-6 px-3 md:px-6 flex flex-col gap-10">
        <GenresCarousel />
        <RecentlyMoviesCarousel />
      </div>
    </div>
  );
}

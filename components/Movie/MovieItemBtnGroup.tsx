import { Play } from "lucide-react";
import type { MovieResponse } from "@/types/movies/movies";
import Link from "@/components/Catalogue/CatalogueLink";
import { YoutubeIcon } from "../Icon/YouTube";
export const MovieItemBtnGroup = ({ movie, }: {
    movie: MovieResponse;
}) => {
    const video = movie.videos[0];
    if (!video) {
        return (<div role="status" className="w-full rounded-lg border border-white/10 bg-zinc-900/80 px-4 py-5 text-center text-sm text-zinc-400">
        {"This movie is not available in this version yet."}
      </div>);
    }
    return (<div className="flex flex-wrap gap-3 w-full min-w-0">
      <Link href={`/watch/movie/${movie.tmdbId}`} className="flex flex-col items-center gap-1 px-4 sm:px-6 py-4 sm:py-5 bg-red-600 hover:bg-red-700 rounded-lg flex-1 min-w-0 justify-center text-xs sm:text-sm cursor-pointer">
        <Play size={24}/>
        {"Watch"}
      </Link>
      <Link href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.videoId)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 px-4 sm:px-6 py-4 sm:py-5 bg-green-600 hover:bg-green-700 rounded-lg flex-1 min-w-0 justify-center text-xs sm:text-sm cursor-pointer">
        <YoutubeIcon size={30}/>
        {"Watch on YouTube"}
      </Link>
    </div>);
};

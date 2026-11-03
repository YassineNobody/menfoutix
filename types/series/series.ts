import type { WorkListItemResponse } from "@/types/work/work";
import type {
  ActorResponse, GenreResponse, MetadataItem, Rating, VideoResponse,
} from "@/types/movies/movies";

export type SeriesSort = "recentlyAdded" | "releaseDate" | "tmdbRating" | "title";

export interface SeriesFilters {
  genreId?: number;
  releaseYear?: number;
  minTmdbRating?: number;
}

export interface SeriesListItem extends WorkListItemResponse {
  type: "série";
  seasonCount: number;
  episodeCount: number;
  availableEpisodeCount: number;
}

export interface SeasonSummary {
  id: number; // ID interne SQLite
  workId: number;
  tmdbSeasonId: number | null;
  seasonNumber: number; // 0 = épisodes spéciaux
  name: string;
  synopsis: string | null;
  airDate: string | null;
  posterUrl: string | null;
  episodeCount: number;
  availableEpisodeCount: number;
  available: boolean;
}

export interface EpisodeSummary {
  id: number; // ID interne SQLite, distinct de tmdbEpisodeId
  seasonId: number;
  tmdbEpisodeId: number;
  episodeNumber: number;
  title: string;
  synopsis: string | null;
  airDate: string | null;
  runtimeMinutes: number | null;
  stillUrl: string | null;
  tmdbVoteAverage: number | null;
  tmdbVoteCount: number | null;
  directors: MetadataItem[];
  available: boolean;
  videos: VideoResponse[]; // VO uniquement, [] si absent
}

export interface SeasonResponse extends SeasonSummary {
  episodes: EpisodeSummary[];
}

export interface EpisodeResponse extends EpisodeSummary {
  actors: ActorResponse[];
}

export interface SeriesResponse {
  id: number;
  tmdbId: number;
  type: "série";
  displayTitle: string;
  titleFr: string;
  titleEn: string | null;
  originalTitle: string | null;
  localTitle: string | null;
  synopsis: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  logoUrl: string | null;
  trailerUrl: string | null;
  tmdbVoteAverage: number | null;
  tmdbVoteCount: number | null;
  note: Rating | null;
  recommendation: string | null;
  certificationFr: string | null;
  creators: MetadataItem[];
  productionCompanies: MetadataItem[];
  genres: GenreResponse[];
  actors: ActorResponse[];
  seasons: SeasonSummary[];
}

// Résultats SQLite avant conversion des booléens et des champs JSON.
export type SeriesListRow = Omit<SeriesListItem, "genres"> & { genresJson: string };
export type SeasonRow = Omit<SeasonSummary, "available"> & { available: 0 | 1 };
export type EpisodeRow = Omit<EpisodeSummary, "directors" | "available" | "videos"> & {
  directorsJson: string | null;
};
export type SeriesRow = Omit<SeriesResponse,
  "creators" | "productionCompanies" | "genres" | "actors" | "seasons"
> & { creatorsJson: string | null; productionCompaniesJson: string | null };

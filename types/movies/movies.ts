
export type VideoVersion = "VO";
export type Rating = 1 | 2 | 3 | 4 | 5;



// Résultat brut de sqlWork
export interface MovieRow {
  id: number;

  tmdbId: number;
  type: "film";

  localTitle: string | null;
  titleFr: string;
  titleEn: string | null;
  originalTitle: string | null;

  synopsis: string | null;
  synopsisEn: string | null;
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

  runtimeMinutes: number | null;
  certificationFr: string | null;

  directorsJson: string | null;
  productionCompaniesJson: string | null;
  creatorsJson: string | null;
}

export interface GenreResponse {
  id: number | null;
  name: string;
}

export interface ActorResponse {
  id: number | null;
  name: string;
  profileUrl: string | null;
  character: string | null;
}

export interface VideoResponse {
  videoId: string;
  version: VideoVersion;
  sourceTitle: string;
  description: string | null;
  thumbnailUrl: string | null;
  definition: string | null;
  privacyStatus: string | null;
  embeddable: boolean;
  publishedAt: string | null;
  channelId: string | null;
  channelTitle: string | null;
}

// Résultat brut de sqlVideos
export type VideoRow = Omit<VideoResponse, "embeddable"> & {
  embeddable: 0 | 1;
};

export interface MetadataItem {
  name: string;
  [key: string]: unknown;
}

export interface MovieResponse extends Omit<
  MovieRow,
  "directorsJson" | "productionCompaniesJson" | "creatorsJson"
> {

  directors: MetadataItem[];
  productionCompanies: MetadataItem[];
  creators: MetadataItem[];

  genres: GenreResponse[];
  actors: ActorResponse[];
  videos: VideoResponse[];
}
 
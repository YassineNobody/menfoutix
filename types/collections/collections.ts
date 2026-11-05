export interface PreviewCollection {
  id: number;
  nameFr: string;
  nameEn: string | null;
  tmdbId: number;
  backdropUrl: string | null;
  posterUrl: string | null;
}

export interface CollectionMovie {
  id: number;
  tmdbId: number;
  position: number;
  titleFr: string;
  titleEn: string | null;
  originalTitle: string | null;
  synopsisFr: string | null;
  synopsisEn: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  logoUrl: string | null;
  tmdbRating: number | null;
  vf: boolean;
  vo: boolean;
}

export type CollectionMovieRow = Omit<CollectionMovie, "vf" | "vo"> & {
  vf: 0 | 1;
  vo: 0 | 1;
};

export interface CollectionDetails extends PreviewCollection {
  synopsisFr: string | null;
  synopsisEn: string | null;
  movies: CollectionMovie[];
}

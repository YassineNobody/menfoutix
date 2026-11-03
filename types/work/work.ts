export interface WorkListItemResponse {
  tmdbId: number;
  displayTitle: string;
  type: "film" | "série";

  titleFr: string;
  titleEn: string | null;
  originalTitle: string | null;
  localTitle: string | null;

  releaseDate: string | null;
  synopsis: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  logoUrl: string | null;
  genres: string[];

  tmdbRating: number | null;
  ourRating: 1 | 2 | 3 | 4 | 5 | null;
}



export type WorkRow = Omit<WorkListItemResponse, "genres"> & {
  genresJson: string;
};



export type WorkType = "film" | "série";

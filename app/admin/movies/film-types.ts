export type WorkVersion = "VF" | "VO";

export type VersionCount = {
  version: WorkVersion;
  total: number;
};

export type FilmPlaylist = {
  version: WorkVersion;
  titleFr: string;
  id: number;
};

export interface FilmRow {
  id: number;
  titleFr: string;
  version: WorkVersion | null;
  videoId: string | null;
  playlistId: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

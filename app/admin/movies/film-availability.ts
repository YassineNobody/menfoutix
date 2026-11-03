import type { FilmRow, WorkVersion } from "./film-types";

export type FilmAvailability = {
  id: number;
  titleFr: string;
  versions: Record<WorkVersion, { video: boolean; playlist: boolean }>;
};

export function groupFilmAvailability(rows: FilmRow[]): FilmAvailability[] {
  const films = new Map<number, FilmAvailability>();
  for (const row of rows) {
    let film = films.get(row.id);
    if (!film) {
      film = { id: row.id, titleFr: row.titleFr, versions: {
        VF: { video: false, playlist: false },
        VO: { video: false, playlist: false },
      } };
      films.set(row.id, film);
    }
    if (row.version === "VF" || row.version === "VO") {
      const version = film.versions[row.version];
      version.video ||= row.videoId !== null;
      version.playlist ||= row.playlistId !== null;
    }
  }
  return [...films.values()];
}

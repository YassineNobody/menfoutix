import { getEnglishMovieImages } from "@/lib/server/tmdb-images";
import "server-only";

import { db } from "../server/database";
import type { PaginatedResult } from "@/types/commons";
import type { WorkListItemResponse, WorkRow } from "@/types/work/work";

import "server-only";
import { MetadataItem, MovieResponse, MovieRow, GenreResponse, ActorResponse, VideoRow, VideoResponse } from "@/types/movies/movies";


export type MovieSort = "releaseDate" | "recentlyAdded";

const MOVIE_SORT_SQL: Record<MovieSort, string> = {
  releaseDate: "w.release_date DESC, w.id DESC",

  recentlyAdded: `
    (
      SELECT MAX(v.published_at)
      FROM videos AS v
      WHERE v.work_id = w.id AND v.version = 'VO'
    ) DESC, w.id DESC
  `,
};

export function getMovies(
  sort: MovieSort = "recentlyAdded",
  page: number = 1,
  limit: number = 10,
): PaginatedResult<WorkListItemResponse> {
  if (!Object.hasOwn(MOVIE_SORT_SQL, sort)) {
    throw new Error("Tri invalide.");
  }

  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error("page doit être un entier positif.");
  }

  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error("limit doit être un entier positif.");
  }

  const { total } = db
    .prepare(
      `
      SELECT COUNT(*) AS total
      FROM works AS w
      WHERE w.type = 'film'
        AND EXISTS (
          SELECT 1
          FROM videos AS v
          WHERE v.work_id = w.id AND v.version = 'VO'
        );
    `,
    )
    .get() as { total: number };

  const totalPages = Math.ceil(total / limit);

  page = Math.min(page, Math.max(1, totalPages));

  const offset = (page - 1) * limit;

  const rows = db
    .prepare(
      `
      SELECT

        w.tmdb_id AS tmdbId,
        w.type,
        w.title_fr AS titleFr,
        COALESCE(NULLIF(w.title_en,''),NULLIF(w.original_title,''),w.title_fr) AS displayTitle,
        w.title_en AS titleEn,
        w.original_title AS originalTitle,
        w.local_title AS localTitle,
        w.release_date AS releaseDate,
        COALESCE(NULLIF(w.synopsis_en,''),w.synopsis_fr) AS synopsis,
        w.poster_url AS posterUrl,
        w.backdrop_url AS backdropUrl,
        w.logo_url AS logoUrl,
        w.tmdb_vote_average AS tmdbRating,
        w.note AS ourRating,

        (
          SELECT json_group_array(name)
          FROM (
            SELECT DISTINCT g.name AS name
            FROM work_genres AS wg
            JOIN genres AS g ON g.id = wg.genre_id
            WHERE wg.work_id = w.id
              AND g.name IS NOT NULL
            ORDER BY g.name
          )
        ) AS genresJson

      FROM works AS w

      WHERE w.type = 'film'
        AND EXISTS (
          SELECT 1
          FROM videos AS v
          WHERE v.work_id = w.id AND v.version = 'VO'
        )

      ORDER BY ${MOVIE_SORT_SQL[sort]}
      LIMIT ? OFFSET ?;
    `,
    )
    .all(limit, offset) as WorkRow[];

  const data: WorkListItemResponse[] = rows.map(
    ({ genresJson, ...work }) => ({
      ...work,
      genres: JSON.parse(genresJson) as string[],
    }),
  );

  return {
    data,
    page,
    limit,
    total,
    totalPages,
  };
}
function parseMetadata(
  value: string | null,
  field: string,
): MetadataItem[] {
  if (value === null) return [];

  const parsed: unknown = JSON.parse(value);
  if (parsed === null) return [];
  if (!Array.isArray(parsed)) {
    throw new Error(`Métadonnées invalides pour ${field}.`);
  }

  return parsed.map((item: unknown): MetadataItem => {
    if (typeof item === "string" && item.trim()) {
      return { name: item.trim() };
    }
    if (
      typeof item === "object" && item !== null && !Array.isArray(item) &&
      "name" in item && typeof item.name === "string" && item.name.trim()
    ) {
      return { ...item, name: item.name.trim() };
    }
    throw new Error(`Métadonnées invalides pour ${field}.`);
  });
}

export async function getOneMovie(tmdbId: number): Promise<MovieResponse | null> {
  if (!Number.isSafeInteger(tmdbId) || tmdbId < 1) {
    throw new Error("tmdbId doit être un entier positif.");
  }

  const sqlWork = `
    SELECT
      id,

      tmdb_id AS tmdbId,
      type,
      local_title AS localTitle,
      title_fr AS titleFr,
      title_en AS titleEn,
      original_title AS originalTitle,
      synopsis_fr AS synopsis,
      synopsis_en AS synopsisEn,
      release_date AS releaseDate,
      release_year AS releaseYear,
      poster_url AS posterUrl,
      backdrop_url AS backdropUrl,
      logo_url AS logoUrl,
      trailer_url AS trailerUrl,
      tmdb_vote_average AS tmdbVoteAverage,
      tmdb_vote_count AS tmdbVoteCount,
      note,
      recommendation,
      runtime_minutes AS runtimeMinutes,
      certification_fr AS certificationFr,
      directors_json AS directorsJson,
      production_companies_json AS productionCompaniesJson,
      creators_json AS creatorsJson

    FROM works
    WHERE type = ?
      AND tmdb_id = ?
      AND EXISTS (SELECT 1 FROM videos v WHERE v.work_id = works.id AND v.version = 'VO');
  `;

  const sqlGenres = `
    SELECT
      g.tmdb_genre_id AS id,
      g.name
    FROM genres AS g
    JOIN work_genres AS wg ON wg.genre_id = g.id
    WHERE wg.work_id = ?
    ORDER BY g.name COLLATE NOCASE;
  `;

  const sqlActors = `
    SELECT
      a.tmdb_person_id AS id,
      a.name,
      a.profile_url AS profileUrl,
      wa.character
    FROM actors AS a
    JOIN work_actors AS wa ON wa.actor_id = a.id
    WHERE wa.work_id = ?
    ORDER BY wa.billing_order, a.id
    LIMIT 30;
  `;

  const sqlVideos = `
    SELECT
      video_id AS videoId,
      version,
      source_title AS sourceTitle,
      description,
      thumbnail_url AS thumbnailUrl,
      definition,
      privacy_status AS privacyStatus,
      embeddable,
      published_at AS publishedAt,
      channel_id AS channelId,
      channel_title AS channelTitle
    FROM videos
    WHERE work_id = ? AND version = 'VO'
    ORDER BY published_at DESC, video_id;
  `;

  const work = db.prepare(sqlWork).get("film", tmdbId) as
    | MovieRow
    | undefined;

  if (!work) return null;

  const englishImages = await getEnglishMovieImages(tmdbId);

  const genres = db
    .prepare(sqlGenres)
    .all(work.id) as GenreResponse[];

  const actors = db
    .prepare(sqlActors)
    .all(work.id) as ActorResponse[];

  const videoRows = db
    .prepare(sqlVideos)
    .all(work.id) as VideoRow[];

  const videos: VideoResponse[] = videoRows.map(
    ({ embeddable, ...video }) => ({
      ...video,
      embeddable: Boolean(embeddable),
    }),
  );

  const {
    directorsJson,
    productionCompaniesJson,
    creatorsJson,
    ...movie
  } = work;

  return {
    ...movie,
    posterUrl: englishImages?.posterUrl || movie.posterUrl,
    logoUrl: englishImages?.logoUrl || movie.logoUrl,
    synopsis: movie.synopsisEn || movie.synopsis,

    directors: parseMetadata(directorsJson, "directors"),
    productionCompanies: parseMetadata(
      productionCompaniesJson,
      "productionCompanies",
    ),
    creators: parseMetadata(creatorsJson, "creators"),

    genres,
    actors,
    videos,
  };
}
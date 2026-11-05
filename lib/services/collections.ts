import {
  CollectionDetails,
  CollectionMovieRow,
  PreviewCollection,
} from "@/types/collections/collections";
import { PaginatedResult } from "@/types/commons";
import { db } from "../server/database";

export function getPreviewCollections(
  page: number = 1,
  limit: number = 12,
  query: string = "",
): PaginatedResult<PreviewCollection> {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new RangeError("La page doit être un entier supérieur ou égal à 1.");
  }

  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new RangeError(
      "La limite doit être un entier supérieur ou égal à 1.",
    );
  }

  const offset = (page - 1) * limit;

  if (!Number.isSafeInteger(offset)) {
    throw new RangeError("La pagination demandée est trop grande.");
  }

  const search = query.trim();
  const filter = `
    (? = ''
      OR instr(normalize_search(name_fr), normalize_search(?)) > 0
      OR instr(normalize_search(COALESCE(name_en, '')), normalize_search(?)) > 0)
  `;

  return db.transaction(() => {
    const { total } = db
      .prepare(`SELECT COUNT(*) AS total FROM collections WHERE ${filter}`)
      .get(search, search, search) as { total: number };

    const data = db
      .prepare(
        `
        SELECT
          id,
          name_fr AS nameFr,
          name_en AS nameEn,
          tmdb_id AS tmdbId,
          poster_url AS posterUrl,
          backdrop_url AS backdropUrl
        FROM collections
        WHERE ${filter}
        ORDER BY name_fr, id
        LIMIT ? OFFSET ?
      `,
      )
      .all(search, search, search, limit, offset) as PreviewCollection[];

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  })();
}

export function getPreviewCollectionsVo(
  page: number = 1,
  limit: number = 12,
  query: string = "",
): PaginatedResult<PreviewCollection> {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new RangeError("La page doit être un entier supérieur ou égal à 1.");
  }

  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new RangeError(
      "La limite doit être un entier supérieur ou égal à 1.",
    );
  }

  const offset = (page - 1) * limit;

  if (!Number.isSafeInteger(offset)) {
    throw new RangeError("La pagination demandée est trop grande.");
  }

  return db.transaction(() => {
    const search = query.trim();
    const filter = `
      EXISTS (
        SELECT 1
        FROM collection_movies cm
        JOIN videos v ON v.work_id = cm.work_id
        WHERE cm.collection_id = c.id
          AND v.version = 'VO'
      )
      AND (? = ''
        OR instr(normalize_search(c.name_fr), normalize_search(?)) > 0
        OR instr(normalize_search(COALESCE(c.name_en, '')), normalize_search(?)) > 0)
    `;

    const { total } = db
      .prepare(
        `
        SELECT COUNT(*) AS total
        FROM collections c
        WHERE ${filter}
      `,
      )
      .get(search, search, search) as { total: number };

    const data = db
      .prepare(
        `
        SELECT
          c.id,
          c.name_fr AS nameFr,
          c.name_en AS nameEn,
          c.tmdb_id AS tmdbId,
          c.poster_url AS posterUrl,
          c.backdrop_url AS backdropUrl
        FROM collections c
        WHERE ${filter}
        ORDER BY c.name_fr, c.id
        LIMIT ? OFFSET ?
      `,
      )
      .all(search, search, search, limit, offset) as PreviewCollection[];

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  })();
}

export function getCollection(collectionTmdbId: number): CollectionDetails | null {
  if (!Number.isSafeInteger(collectionTmdbId) || collectionTmdbId < 1) {
    throw new RangeError("L’identifiant TMDB doit être un entier positif.");
  }

  return db.transaction(() => {
    const collection = db
      .prepare<[number], Omit<CollectionDetails, "movies">>(`
        SELECT
          id,
          tmdb_id AS tmdbId,
          name_fr AS nameFr,
          name_en AS nameEn,
          synopsis_fr AS synopsisFr,
          synopsis_en AS synopsisEn,
          poster_url AS posterUrl,
          backdrop_url AS backdropUrl
        FROM collections
        WHERE tmdb_id = ?
      `)
      .get(collectionTmdbId);

    if (!collection) return null;

    const rows = db
      .prepare<[number], CollectionMovieRow>(
        `
        SELECT
          w.id,
          cm.tmdb_id AS tmdbId,
          cm.position,
          w.title_fr AS titleFr,
          w.title_en AS titleEn,
          w.original_title AS originalTitle,
          w.synopsis_fr AS synopsisFr,
          w.synopsis_en AS synopsisEn,
          w.release_date AS releaseDate,
          w.release_year AS releaseYear,
          w.poster_url AS posterUrl,
          w.backdrop_url AS backdropUrl,
          w.logo_url AS logoUrl,
          w.tmdb_vote_average AS tmdbRating,
          wa.vf,
          wa.vo
        FROM collection_movies AS cm
        JOIN collections AS c ON c.id = cm.collection_id
        JOIN works AS w ON w.id = cm.work_id
        JOIN work_availability AS wa ON wa.work_id = w.id
        WHERE c.tmdb_id = ?
        ORDER BY cm.position ASC
      `,
      )
      .all(collectionTmdbId);

    return {
      ...collection,
      movies: rows.map(({ vf, vo, ...movie }) => ({
        ...movie,
        vf: Boolean(vf),
        vo: Boolean(vo),
      })),
    };
  })();
}

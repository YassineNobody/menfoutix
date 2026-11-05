import "server-only";
import { db } from "@/lib/server/database";

export interface AdminCollection {
  id: number;
  tmdbId: number;
  nameFr: string;
  nameEn: string | null;
  total: number;
  vf: number;
  vo: number;
}

export function getAdminCollections(): AdminCollection[] {
  return db.prepare<[], AdminCollection>(`
    SELECT
      c.id,
      c.tmdb_id AS tmdbId,
      c.name_fr AS nameFr,
      c.name_en AS nameEn,
      COUNT(cm.tmdb_id) AS total,
      COALESCE(SUM(wa.vf), 0) AS vf,
      COALESCE(SUM(wa.vo), 0) AS vo
    FROM collections c
    LEFT JOIN collection_movies cm ON cm.collection_id = c.id
    LEFT JOIN work_availability wa ON wa.work_id = cm.work_id
    GROUP BY c.id
    ORDER BY c.name_fr, c.id
  `).all();
}

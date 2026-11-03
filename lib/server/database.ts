import "server-only";
import Database from "better-sqlite3";
import path from "node:path";

export function normalizeSearch(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}


const dbPath = path.join(process.cwd(), "menfoutixDB.db");

export const db = new Database(dbPath, {
  readonly: true,
  fileMustExist: true,
});

db.function("normalize_search", { deterministic: true }, normalizeSearch);

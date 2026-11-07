export type CatalogueVersion = "VO" | "VF";

export function versionSql(version: CatalogueVersion): string {
  if (version === "VF") return "'VF'";
  if (version === "VO") return "'VO'";
  throw new Error("Invalid catalogue version.");
}

export function catalogueHref(path: string, version: CatalogueVersion): string {
  if (version !== "VF" || !path.startsWith("/") || path.startsWith("//")
    || /^\/(vf|admin|api)(?:[/?#]|$)/.test(path)) return path;
  return path === "/" ? "/vf" : `/vf${path}`;
}

export function versionFromPath(path: string): CatalogueVersion {
  return path === "/vf" || path.startsWith("/vf/") ? "VF" : "VO";
}

/** Column expressions are fixed by the calling query, never supplied by a request. */
export function localizedTextSql(
  version: CatalogueVersion,
  frenchColumn: string,
  englishColumn: string,
  fallback = "NULL",
): string {
  const [first, second] = version === "VF"
    ? [frenchColumn, englishColumn]
    : [englishColumn, frenchColumn];
  return `COALESCE(NULLIF(TRIM(${first}), ''), NULLIF(TRIM(${second}), ''), ${fallback})`;
}

export function catalogueText(
  version: CatalogueVersion,
  french: string | null,
  english: string | null,
  fallback = "",
): string {
  const [first, second] = version === "VF" ? [french, english] : [english, french];
  return first?.trim() || second?.trim() || fallback;
}

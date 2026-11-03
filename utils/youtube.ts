export function getYouTubeId(trailerUrl: string): string | null {
  try {
    const url = new URL(trailerUrl);
    const host = url.hostname.toLowerCase();

    let id: string | null = null;

    if (host === "youtu.be" || host === "www.youtu.be") {
      id = url.pathname.split("/")[1] ?? null;
    } else if (
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com"
    ) {
      id = url.searchParams.get("v");
    }

    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

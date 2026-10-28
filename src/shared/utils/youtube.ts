/** Accepts a bare id (optionally with "?query"), or a watch / youtu.be / shorts / embed URL. */
export function parseYouTubeId(
  input?: string | null
): { key: string; query: string } | null {
  if (!input) return null;
  const value = input.trim();
  if (!value) return null;

  const fromUrl = (() => {
    try {
      const url = new URL(value);
      if (url.hostname.includes("youtu.be")) {
        return { key: url.pathname.slice(1), query: url.search.slice(1) };
      }
      const v = url.searchParams.get("v");
      if (v) {
        url.searchParams.delete("v");
        return { key: v, query: url.searchParams.toString() };
      }
      const match = url.pathname.match(/\/(?:embed|shorts|live)\/([^/?#]+)/);
      if (match) return { key: match[1], query: url.search.slice(1) };
    } catch {
      /* not a URL — treat as id */
    }
    return null;
  })();

  const [key, query = ""] = fromUrl
    ? [fromUrl.key, fromUrl.query]
    : value.split("?");
  return /^[\w-]{6,20}$/.test(key) ? { key, query } : null;
}

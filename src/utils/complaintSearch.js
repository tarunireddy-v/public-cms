/**
 * Returns true if query matches complaint title, id, or description (case-insensitive).
 */
export function matchesComplaintSearch(complaint, rawQuery) {
  const q = (rawQuery || "").trim().toLowerCase();
  if (!q) return true;
  const id = String(complaint?.id ?? "").toLowerCase();
  const title = String(complaint?.title ?? "").toLowerCase();
  const description = String(complaint?.description ?? "").toLowerCase();
  return id.includes(q) || title.includes(q) || description.includes(q);
}

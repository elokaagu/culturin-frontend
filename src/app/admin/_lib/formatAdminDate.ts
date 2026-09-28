/**
 * Short date for admin lists and headers ("Sep 28, 2026"). Lives in a plain module (no
 * "use client") so server components can call it too; a function exported from a client
 * module throws at runtime when called on the server.
 */
export function formatAdminDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

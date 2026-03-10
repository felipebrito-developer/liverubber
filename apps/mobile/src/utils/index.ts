// ─── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Formats an ISO date string to a compact, readable form.
 * e.g. "2026-03-05T18:43:18-03:00" → "Mar 5, 2026"
 */
export function formatDate(iso: string | null | undefined): string {
	if (!iso) return "—";
	const d = new Date(iso);
	return d.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

/**
 * Formats an ISO date string relative to now.
 * e.g. "2 days ago", "in 3 days", "today"
 */
export function formatRelative(iso: string | null | undefined): string {
	if (!iso) return "—";
	const now = new Date();
	const then = new Date(iso);
	const diffMs = then.getTime() - now.getTime();
	const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "today";
	if (diffDays === 1) return "tomorrow";
	if (diffDays === -1) return "yesterday";
	if (diffDays > 1) return `in ${diffDays} days`;
	return `${Math.abs(diffDays)} days ago`;
}

// ─── String helpers ───────────────────────────────────────────────────────────

/** Capitalizes the first letter of a string. */
export function capitalize(s: string): string {
	if (!s) return s;
	return s.charAt(0).toUpperCase() + s.slice(1);
}

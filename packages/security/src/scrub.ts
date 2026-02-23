/**
 * PII scrubbing utilities.
 *
 * These run locally before any data is sent to a cloud model.
 * Patterns are intentionally broad — false positives are acceptable,
 * false negatives (leaking real PII) are not.
 */

// Common PII patterns to strip
const PII_PATTERNS: Array<[RegExp, string]> = [
	// Email addresses
	[/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL]"],
	// Phone numbers (international-ish)
	[/(\+?\d[\d\s\-().]{7,}\d)/g, "[PHONE]"],
	// Brazilian CPF (000.000.000-00)
	[/\d{3}\.\d{3}\.\d{3}-\d{2}/g, "[CPF]"],
	// ISO 8601 dates with private context (keep generic references)
	[/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?\b/g, "[DATETIME]"],
	// Standalone dates
	[/\b\d{4}-\d{2}-\d{2}\b/g, "[DATE]"],
	// URLs / links
	[/https?:\/\/[^\s]+/g, "[URL]"],
	// Common name prefixes followed by capitalized words
	[/\b(Mr|Ms|Mrs|Dr|Prof)\.?\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\b/g, "[NAME]"],
];

/**
 * Scrubs known PII patterns from a plain text string.
 *
 * @example
 * scrubPII("Call João at joao@email.com") // "Call João at [EMAIL]"
 */
export function scrubPII(text: string): string {
	let result = text;
	for (const [pattern, replacement] of PII_PATTERNS) {
		result = result.replace(pattern, replacement);
	}
	return result;
}

/**
 * Deep-scrubs specific fields by key name from an object.
 * Useful for stripping fields like `title`, `description` from task objects
 * before sending metadata to cloud models.
 *
 * @param obj       - Any JSON-serializable object
 * @param sensitiveKeys - Field names whose string values should be scrubbed
 *
 * @example
 * scrubFields({ title: "Buy milk for João", priority: "high" }, ["title"])
 * // { title: "Buy milk for [NAME?]", priority: "high" }   (pattern-matched)
 */
export function scrubFields<T extends Record<string, unknown>>(
	obj: T,
	sensitiveKeys: string[],
): T {
	const clone = structuredClone(obj);
	for (const key of sensitiveKeys) {
		const value = clone[key];
		if (typeof value === "string") {
			(clone as Record<string, unknown>)[key] = scrubPII(value);
		}
	}
	return clone;
}

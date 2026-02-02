#!/usr/bin/env bun

import { readFileSync, writeFileSync } from "node:fs";

/**
 * Post-processes generated Go types to remove wrapper types
 * Keeps only the actual types defined in the schema definitions section
 */
export class GoDefinitionExtractor {
	/**
	 * Process Go file to remove wrapper type and keep only definitions
	 */
	processFile(filePath: string): void {
		let content = readFileSync(filePath, "utf-8");

		// List of wrapper types to remove (CommonData, CommonAPI, etc.)
		const wrappersToRemove = ["CommonData", "CommonAPI"];

		for (const wrapper of wrappersToRemove) {
			// Remove the wrapper struct and its content
			const wrapperRegex = new RegExp(
				`type ${wrapper} struct \\{[^}]*\\}\\s*\\n?`,
				"g",
			);
			content = content.replace(wrapperRegex, "");
		}

		// Clean up multiple blank lines
		content = content.replace(/\n\n\n+/g, "\n\n");

		writeFileSync(filePath, content, "utf-8");
	}
}

export default GoDefinitionExtractor;

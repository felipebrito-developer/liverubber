#!/usr/bin/env bun

import { readFileSync, writeFileSync } from "node:fs";

/**
 * Post-processes generated TypeScript types to add proper interface inheritance
 * Detects when an interface contains all properties of a base interface and converts it to extend syntax
 */
export class TSInheritanceProcessor {
	private entityProperties = ["id", "createdAt", "updatedAt"];

	/**
	 * Process TypeScript file to add interface inheritance
	 */
	processFile(filePath: string): void {
		let content = readFileSync(filePath, "utf-8");

		// Check if this is a common-data file that defines Entity
		if (filePath.includes("common-data")) {
			// Ensure Entity interface is present in common-data
			if (!content.includes("export interface Entity")) {
				content = this.ensureEntityInterface(content);
			}
			writeFileSync(filePath, content, "utf-8");
			return;
		}

		// Check if file contains Task interface with Entity properties
		if (content.includes("export interface Task")) {
			content = this.convertTaskToExtendEntity(content);
			writeFileSync(filePath, content, "utf-8");
		}
	}

	/**
	 * Ensure Entity interface exists in common-data file
	 */
	private ensureEntityInterface(content: string): string {
		// Remove the "type CommonData = any;" line if it exists
		content = content.replace(/type CommonData = any;\n\n?/g, "");

		// Add Entity interface if not present
		const entityInterface = `export interface Entity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
`;

		return entityInterface + content;
	}

	/**
	 * Convert Task interface to extend Entity
	 */
	private convertTaskToExtendEntity(content: string): string {
		// Add import if not already present
		if (!content.includes("import") && !content.includes("Entity")) {
			content = `import { Entity } from './../../base/common-data';\n\n${content}`;
		}

		const interfaceMatch = content.match(
			/export interface Task \{[\s\S]*?\n\}/,
		);

		if (!interfaceMatch) {
			return content;
		}

		const interfaceBlock = interfaceMatch[0];
		const lines = interfaceBlock.split("\n").slice(1, -1); // Remove first and last lines

		const entityProps = new Set(this.entityProperties);
		const taskOnlyLines: string[] = [];

		for (const line of lines) {
			const propName = line.match(/^\s*(\w+)/)?.[1];
			if (!propName || !entityProps.has(propName)) {
				taskOnlyLines.push(line);
			}
		}

		const newInterface = `export interface Task extends Entity {
${taskOnlyLines.join("\n")}
}`;

		return content.replace(interfaceBlock, newInterface);
	}
}

export default TSInheritanceProcessor;

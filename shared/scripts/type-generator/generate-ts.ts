#!/usr/bin/env bun

import { execSync } from "node:child_process";
import { basename, join, relative } from "node:path";
import {
	existsSync,
	mkdirSync,
	readdirSync,
	statSync,
	writeFileSync,
} from "fs";
import { mobileGenDir, schemasDir } from "../constants";
import SchemaResolver from "./schema-resolver.ts";
import TSDefinitionExtractor from "./ts-definition-extractor.ts";
import TSInheritanceProcessor from "./ts-inheritance-processor.ts";

export default class TSTypeGenerator {
	private schemasPath: string;
	private schemaResolver: SchemaResolver;
	private inheritanceProcessor: TSInheritanceProcessor;
	private definitionExtractor: TSDefinitionExtractor;
	private tempDir: string;

	constructor() {
		this.schemasPath = schemasDir;
		this.schemaResolver = new SchemaResolver(schemasDir);
		this.inheritanceProcessor = new TSInheritanceProcessor();
		this.definitionExtractor = new TSDefinitionExtractor();
		this.tempDir = join(import.meta.dirname, ".temp-schemas");
	}

	async generateAll(): Promise<void> {
		console.log("🚀 Generating TypeScript types by schema structure...");
		// Ensure temp directory exists
		if (!existsSync(this.tempDir)) {
			mkdirSync(this.tempDir, { recursive: true });
		}
		await this.processDirectory(this.schemasPath);
		console.log("🎉 All typescript types generated successfully!");
	}

	private async processDirectory(dirPath: string): Promise<void> {
		const entries = readdirSync(dirPath);

		for (const entry of entries) {
			const fullPath = join(dirPath, entry);
			const stat = statSync(fullPath);

			if (stat.isDirectory()) {
				// Recursively process subdirectories
				await this.processDirectory(fullPath);
			} else if (entry.endsWith(".json")) {
				// Generate types for JSON files
				await this.generateFromFile(fullPath);
			}
		}
	}

	private async generateFromFile(schemaFile: string): Promise<void> {
		// Calculate relative path from schemas directory
		const relativePath = relative(this.schemasPath, schemaFile);
		const fileNameWithoutExt = basename(schemaFile, ".json");
		const dirFromSchema = relative(this.schemasPath, join(schemaFile, ".."));

		// Create output path mirroring schema structure: ts-types/{dirFromSchema}/{fileName}.ts
		const outputDir = join(mobileGenDir, dirFromSchema);
		const tsOutputPath = join(outputDir, `${fileNameWithoutExt}.ts`);

		// Resolve schema references
		const resolvedSchema = this.schemaResolver.resolveSchema(schemaFile);
		const tempSchemaPath = join(this.tempDir, `${basename(schemaFile)}`);
		writeFileSync(tempSchemaPath, JSON.stringify(resolvedSchema, null, 2));

		console.log(`\n📝 Processing: ${relativePath}`);

		if (!existsSync(schemaFile)) {
			console.warn(`⚠️ Schema file not found: ${schemaFile}`);
			return;
		}

		this.ensureDirectories(outputDir);

		const command = [
			"quicktype",
			tempSchemaPath,
			"--src-lang",
			"schema",
			"--lang",
			"typescript",
			"--out",
			tsOutputPath,
			"--just-types",
			"--acronym-style",
			"camel",
		].join(" ");

		try {
			execSync(command, {
				stdio: "inherit",
				cwd: import.meta.dirname,
			});
			console.info(`✅ Generated: ${tsOutputPath}`);

			// Post-process for definition extraction
			this.definitionExtractor.processFile(tsOutputPath);

			// Post-process for inheritance
			this.inheritanceProcessor.processFile(tsOutputPath);
		} catch (error) {
			console.error(
				`❌ Failed to generate TS types for ${relativePath}:`,
				error,
			);
			throw error;
		}
	}

	private ensureDirectories(outputDir: string): void {
		if (!existsSync(outputDir)) {
			mkdirSync(outputDir, { recursive: true });
			console.log(`📁 Created directory: ${outputDir}`);
		}
	}
}

export { TSTypeGenerator };

#!/usr/bin/env bun

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs';
import { serviceGenDir, schemasDir } from '../constants.ts';
import { join, relative, basename, dirname } from 'path';
import SchemaResolver from './schema-resolver.ts';
import GoPackageProcessor from './go-package-processor.ts';
import GoDefinitionExtractor from './go-definition-extractor.ts';

export default class GoTypeGenerator {
  private schemasPath: string;
  private schemaResolver: SchemaResolver;
  private packageProcessor: GoPackageProcessor;
  private definitionExtractor: GoDefinitionExtractor;
  private tempDir: string;

  constructor() {
    this.schemasPath = schemasDir;
    this.schemaResolver = new SchemaResolver(schemasDir);
    this.packageProcessor = new GoPackageProcessor();
    this.definitionExtractor = new GoDefinitionExtractor();
    this.tempDir = join(import.meta.dirname, '.temp-schemas');
  }

  public async generateAll(): Promise<void> {
    console.log('🚀 Generating Go types with quicktype by schema structure...');
    // Ensure temp directory exists
    if (!existsSync(this.tempDir)) {
      mkdirSync(this.tempDir, { recursive: true });
    }
    await this.processDirectory(this.schemasPath);
    console.log('🎉 All Go types generated successfully!');
  }

  private async processDirectory(dirPath: string): Promise<void> {
    const entries = readdirSync(dirPath);

    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively process subdirectories
        await this.processDirectory(fullPath);
      } else if (entry.endsWith('.json')) {
        // Generate types for JSON files
        await this.generateFromFile(fullPath);
      }
    }
  }

  private async generateFromFile(schemaFile: string): Promise<void> {
    // Calculate relative path from schemas directory
    const relativePath = relative(this.schemasPath, schemaFile);
    const fileNameWithoutExt = basename(schemaFile, '.json');
    const dirFromSchema = relative(
      this.schemasPath,
      join(schemaFile, '..')
    );

    // Create output path mirroring schema structure: go-types/{dirFromSchema}/{fileName}.go
    const outputDir = join(serviceGenDir, dirFromSchema);
    const goOutputPath = join(outputDir, `${fileNameWithoutExt}.go`);
    // Use the immediate parent directory name as package name
    const packageName = basename(dirname(goOutputPath));

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
      'quicktype',
      tempSchemaPath,
      '--src-lang', 'schema',
      '--lang', 'go',
      '--out', goOutputPath,
      '--just-types',
      '--package', packageName
    ].join(' ');

    try {
      execSync(command, {
        stdio: 'inherit',
        cwd: import.meta.dirname
      });
      console.log(`✅ Generated: ${goOutputPath}`);

      // Post-process for definition extraction
      this.definitionExtractor.processFile(goOutputPath);
      
      // Post-process for package declaration
      this.packageProcessor.processFile(goOutputPath);
    } catch (error) {
      console.error(
        `❌ Failed to generate Go types for ${relativePath}:`,
        error
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

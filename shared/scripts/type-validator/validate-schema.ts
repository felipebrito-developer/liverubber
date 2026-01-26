#!/usr/bin/env bun

import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

class SchemaValidator {
  private schemasDir: string;

  constructor(schemasDir: string) {
    this.schemasDir = schemasDir;
  }

  validateAll(): SchemaValidationResult {
    const result: SchemaValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    const schemaFiles = this.findSchemaFiles();
    
    if (schemaFiles.length === 0) {
      result.errors.push('No schema files found');
      result.valid = false;
      return result;
    }

    for (const file of schemaFiles) {
      const fileResult = this.validateSchemaFile(file);
      
      if (!fileResult.valid) {
        result.valid = false;
        result.errors.push(...fileResult.errors.map(err => `${file}: ${err}`));
      }
      
      result.warnings.push(...fileResult.warnings.map(warn => `${file}: ${warn}`));
    }

    return result;
  }

  private findSchemaFiles(): string[] {
    const files: string[] = [];

    const walk = (dir: string) => {
      const items = readdirSync(dir);
      
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (item.endsWith('.json')) {
          files.push(fullPath);
        }
      }
    };

    walk(this.schemasDir);
    return files;
  }

  private validateSchemaFile(filePath: string): SchemaValidationResult {
    const result: SchemaValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    try {
      const content = readFileSync(filePath, 'utf8');
      const schema = JSON.parse(content);

      if (!schema.definitions && !schema.properties) {
        result.warnings.push('No definitions or properties found');
      }

      if (!schema.$schema) {
        result.warnings.push('Missing $schema property');
      }

    } catch (error) {
      result.valid = false;
      result.errors.push(`Invalid JSON: ${error}`);
    }

    return result;
  }
}

// Uso
if (import.meta.main) {
  const validator = new SchemaValidator(join(import.meta.dirname, '../schemas'));
  const result = validator.validateAll();

  if (!result.valid) {
    console.error('❌ Schema validation failed:');
    result.errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️ Schema warnings:');
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  console.log('✅ All schemas are valid!');
}

export { SchemaValidator };
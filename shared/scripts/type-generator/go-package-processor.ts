#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs';
import { basename } from 'path';

/**
 * Post-processes generated Go types to add package declaration and organize imports
 */
export class GoPackageProcessor {
  /**
   * Process Go file to add package declaration and move imports after it
   */
  processFile(filePath: string): void {
    let content = readFileSync(filePath, 'utf-8');

    // Extract the filename without extension as package name
    const fileName = basename(filePath, '.go');
    const packageName = this.toCamelCase(fileName);

    // Extract all import statements
    const importRegex = /^import\s+"[^"]+"\s*$/gm;
    const imports: string[] = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[0]);
    }

    // Remove all import statements from the content
    content = content.replace(importRegex, '').trim();

    // Remove leading package declaration if it exists
    content = content.replace(/^package\s+\w+\n\n?/, '');

    // Build the file with proper order: package, imports, then code
    let result = `package ${packageName}\n`;

    if (imports.length > 0) {
      result += '\n' + imports.join('\n') + '\n';
    }

    result += '\n' + content;

    // Clean up multiple blank lines
    result = result.replace(/\n\n\n+/g, '\n\n');

    writeFileSync(filePath, result, 'utf-8');
  }

  /**
   * Convert kebab-case or snake_case to camelCase
   */
  private toCamelCase(str: string): string {
    return str
      .split(/[-_]/)
      .map((word, index) => {
        if (index === 0) {
          // First word is lowercase
          return word.toLowerCase();
        }
        // Subsequent words: capitalize first letter
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }
}

export default GoPackageProcessor;

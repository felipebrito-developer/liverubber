#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs';

/**
 * Post-processes generated TypeScript types to remove wrapper types
 * Keeps only the actual types defined in the schema definitions section
 */
export class TSDefinitionExtractor {
  /**
   * Process TypeScript file to remove wrapper type and keep only definitions
   */
  processFile(filePath: string): void {
    let content = readFileSync(filePath, 'utf-8');

    // List of wrapper types to remove (CommonData, CommonApi, etc.)
    const wrappersToRemove = ['CommonData', 'CommonApi'];

    for (const wrapper of wrappersToRemove) {
      // Remove the wrapper interface/type and its content
      const wrapperRegex = new RegExp(
        `export (?:interface|type) ${wrapper} \\{[^}]*\\}\\s*\\n\\n?`,
        'g'
      );
      content = content.replace(wrapperRegex, '');
    }

    // Clean up any orphaned [property: string]: any lines
    content = content.replace(/\s*\[property: string\]: any;\s*/g, '');

    writeFileSync(filePath, content, 'utf-8');
  }
}

export default TSDefinitionExtractor;

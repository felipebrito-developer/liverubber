#!/usr/bin/env bun

import { readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';

/**
 * Resolves $ref references in JSON schemas by merging allOf with referenced schemas
 */
export class SchemaResolver {
  private cache: Map<string, any> = new Map();
  private schemasDir: string;

  constructor(schemasDir: string) {
    this.schemasDir = resolve(schemasDir);
  }

  /**
   * Resolves all $ref in a schema and returns the merged result
   */
  resolveSchema(schemaPath: string): any {
    const absolutePath = resolve(schemaPath);
    const schema = this.loadSchema(absolutePath);
    const merged = this.mergeAllOf(schema, dirname(absolutePath), schema);
    // Recursively resolve all remaining $ref in the merged schema
    return this.resolveAllRefs(merged, dirname(absolutePath), schema);
  }

  /**
   * Load schema from file with caching
   */
  private loadSchema(filePath: string): any {
    const absolutePath = resolve(filePath);
    if (this.cache.has(absolutePath)) {
      return this.cache.get(absolutePath);
    }

    const content = readFileSync(absolutePath, 'utf-8');
    const schema = JSON.parse(content);
    this.cache.set(absolutePath, schema);
    return schema;
  }

  /**
   * Merge allOf by resolving $ref and combining properties
   */
  private mergeAllOf(schema: any, currentDir: string, rootSchema?: any): any {
    if (!schema.allOf || !Array.isArray(schema.allOf)) {
      return schema;
    }

    const merged: any = {
      ...schema
    };

    // Remove allOf from merged schema
    delete merged.allOf;

    // Merge all items in allOf
    for (const item of schema.allOf) {
      if (item.$ref) {
        const refSchema = this.resolveRef(item.$ref, currentDir, rootSchema);
        // Merge properties and required fields
        if (refSchema.properties) {
          merged.properties = {
            ...refSchema.properties,
            ...merged.properties
          };
        }
        if (refSchema.required) {
          merged.required = [
            ...new Set([...(refSchema.required || []), ...(merged.required || [])])
          ];
        }
      } else {
        // Direct schema in allOf
        if (item.properties) {
          merged.properties = {
            ...item.properties,
            ...merged.properties
          };
        }
        if (item.required) {
          merged.required = [
            ...new Set([...(item.required || []), ...(merged.required || [])])
          ];
        }
      }
    }

    // Recursively resolve any remaining references in properties
    if (merged.properties) {
      for (const key in merged.properties) {
        merged.properties[key] = this.mergeAllOf(
          merged.properties[key],
          currentDir,
          rootSchema
        );
      }
    }

    // Handle definitions with $ref
    if (merged.definitions) {
      for (const key in merged.definitions) {
        merged.definitions[key] = this.mergeAllOf(
          merged.definitions[key],
          currentDir,
          rootSchema
        );
      }
    }

    return merged;
  }

  /**
   * Resolve a $ref pointer to actual schema
   */
  private resolveRef(ref: string, currentDir: string, rootSchema?: any): any {
    const [filePath, jsonPointer] = ref.split('#/');

    // If no file path (internal reference like "#/definitions/Entity"), use the root schema
    if (!filePath && rootSchema) {
      if (!jsonPointer) {
        return rootSchema;
      }
      
      const parts = jsonPointer.split('/').filter(p => p);
      let current = rootSchema;

      for (const part of parts) {
        current = current[part];
        if (!current) {
          console.warn(`⚠️ Could not resolve pointer #/${jsonPointer}`);
          return {};
        }
      }

      return current;
    }

    // Resolve file path relative to current schema directory
    const fullPath = resolve(currentDir, filePath);

    const schema = this.loadSchema(fullPath);

    if (!jsonPointer) {
      return schema;
    }

    // Navigate to the pointer path (e.g., "definitions/Entity")
    const parts = jsonPointer.split('/').filter(p => p);
    let current = schema;

    for (const part of parts) {
      current = current[part];
      if (!current) {
        console.warn(`⚠️ Could not resolve pointer ${jsonPointer} in ${filePath}`);
        return {};
      }
    }

    return current;
  }

  /**
   * Recursively resolve all $ref in the entire schema tree
   */
  private resolveAllRefs(schema: any, currentDir: string, rootSchema?: any): any {
    if (typeof schema !== 'object' || schema === null) {
      return schema;
    }

    // Handle arrays
    if (Array.isArray(schema)) {
      return schema.map(item => this.resolveAllRefs(item, currentDir, rootSchema));
    }

    // Handle $ref - resolve and inline it
    if (schema.$ref && typeof schema.$ref === 'string') {
      const resolved = this.resolveRef(schema.$ref, currentDir, rootSchema);
      const refFilePath = schema.$ref.split('#/')[0];
      const refDir = refFilePath.startsWith('../') || refFilePath.startsWith('./')
        ? dirname(resolve(currentDir, refFilePath))
        : dirname(resolve(this.schemasDir, refFilePath));
      // Recursively resolve refs in the resolved schema
      return this.resolveAllRefs(resolved, refDir, rootSchema);
    }

    // Handle objects - recursively resolve all properties
    const resolved: any = {};
    for (const key in schema) {
      resolved[key] = this.resolveAllRefs(schema[key], currentDir, rootSchema);
    }
    return resolved;
  }
}

export default SchemaResolver;

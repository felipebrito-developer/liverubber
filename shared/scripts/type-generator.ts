#!/usr/bin/env bun

import { join, dirname } from 'path';
import TSTypeGenerator from './type-generator/generate-ts';
import GoTypeGenerator from './type-generator/generate-go';

function validateSchemas(schemasDir: string): boolean {
  // TODO: Implement schema validation logic
  return true;
}

async function main() {
  try {
    const isValidSchemas =  validateSchemas(join(dirname(import.meta.url), '../schemas'));


    if (!isValidSchemas) { 
      console.error('💥 Schema validation failed. Aborting type generation.');
      process.exit(1);
    }


    const tsGenerator = new TSTypeGenerator();
    const goGenerator = new GoTypeGenerator();
    await tsGenerator.generateAll();
    await goGenerator.generateAll();
     process.exit(0);
  } catch (error) {
    console.error('💥 Generation failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.main) {
  main();
}

export { main };
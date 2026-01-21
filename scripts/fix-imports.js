#!/usr/bin/env node

/**
 * Post-build script to add .js extensions to relative imports in compiled JavaScript files
 * This is required for ESM modules in Node.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, '..', 'dist', 'server');

function fixImportsInFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    let modified = false;

    // Match relative imports: from './something' or from '../something'
    // But exclude node_modules and already have .js extension
    const importRegex = /from\s+['"](\.\.?\/[^'"]+)(?<!\.js)['"]/g;
    
    content = content.replace(importRegex, (match, importPath) => {
      // Skip if already has extension or is a directory import
      if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
        return match;
      }
      
      // Add .js extension
      modified = true;
      return match.replace(importPath, importPath + '.js');
    });

    if (modified) {
      writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed imports in: ${filePath.replace(DIST_DIR, 'dist/server')}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.endsWith('.js') && !entry.endsWith('.d.ts')) {
      fixImportsInFile(fullPath);
    }
  }
}

console.log('🔧 Fixing import extensions in compiled files...');
console.log(`📁 Processing directory: ${DIST_DIR}`);

if (!statSync(DIST_DIR).isDirectory()) {
  console.error(`❌ Directory not found: ${DIST_DIR}`);
  process.exit(1);
}

processDirectory(DIST_DIR);
console.log('✅ Import fixing complete!');

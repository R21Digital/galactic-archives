// Load exported JSON files from a directory and copy them into
// `data/raw/galactic_beholder/` for further processing.

import fs from 'fs';
import path from 'path';

const inputDir = process.argv[2];

if (!inputDir) {
  console.error('Usage: node scripts/import_beholder_data.js <export_directory>');
  process.exit(1);
}

const outputDir = path.join('data', 'raw', 'galactic_beholder');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir);

for (const file of files) {
  if (!file.endsWith('.json')) continue;
  const src = path.join(inputDir, file);
  const dest = path.join(outputDir, file);
  const contents = fs.readFileSync(src, 'utf8');

  // Validate JSON before copying
  JSON.parse(contents);

  fs.writeFileSync(dest, contents);
  console.log(`Imported ${file}`);
}

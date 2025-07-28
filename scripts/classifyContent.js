import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths used when running the script directly
const INPUT_PATH = path.join(__dirname, '../data/sample-hint.md');
const OUTPUT_PATH = path.join(__dirname, '../classified/sample-hint.json');

// Rule-based categories
const rules = [
  { keyword: 'kill', category: 'Quests', tags: ['Combat'] },
  { keyword: 'trainer', category: 'Professions', tags: ['Training'] },
  { keyword: 'buff', category: 'Support', tags: ['Buff', 'Entertainer'] },
  { keyword: 'craft', category: 'Crafting', tags: ['Artisan'] },
  { keyword: 'space', category: 'Space', tags: ['Ship', 'Pilot'] }
];

function ruleBasedClassifier(text) {
  for (const rule of rules) {
    if (text.toLowerCase().includes(rule.keyword)) {
      return {
        source: 'rules',
        category: rule.category,
        tags: rule.tags,
        ms11_priority: 'Medium'
      };
    }
  }
  return null;
}

function fallbackAIMockClassifier(text) {
  // This simulates GPT fallback logic.
  // Replace this with actual OpenAI/GPT logic if desired.
  return {
    source: 'ai-fallback',
    category: 'Exploration',
    tags: ['Planet', 'Navigation'],
    ms11_priority: 'Low'
  };
}

export function classifyContent(text) {
  let classification = ruleBasedClassifier(text);
  if (!classification) {
    classification = fallbackAIMockClassifier(text);
  }
  return classification;
}

export { ruleBasedClassifier, fallbackAIMockClassifier };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const raw = fs.readFileSync(INPUT_PATH, 'utf8');
  const classification = classifyContent(raw);

  const metadata = {
    title: 'Sample Hint',
    classified_at: new Date().toISOString(),
    ...classification
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(metadata, null, 2));

  console.log('✅ Classified:', metadata);
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced rule-based categories with fuzzy matching
const rules = [
  // Combat & Quests
  { keywords: ['kill', 'bounty', 'hunt', 'mission', 'quest'], category: 'Quests', tags: ['Combat'], priority: 'High' },
  { keywords: ['pvp', 'duel', 'arena', 'combat'], category: 'Combat', tags: ['PvP'], priority: 'High' },
  
  // Professions & Training
  { keywords: ['trainer', 'profession', 'skill', 'master', 'apprentice'], category: 'Professions', tags: ['Training'], priority: 'High' },
  { keywords: ['buff', 'entertainer', 'dancer', 'musician', 'doctor'], category: 'Support', tags: ['Buff', 'Entertainer'], priority: 'Medium' },
  
  // Crafting & Economy
  { keywords: ['craft', 'artisan', 'factory', 'harvest', 'resource'], category: 'Crafting', tags: ['Artisan'], priority: 'High' },
  { keywords: ['vendor', 'shop', 'market', 'trade', 'auction'], category: 'Economy', tags: ['Trade'], priority: 'Medium' },
  
  // Space & Vehicles
  { keywords: ['space', 'ship', 'pilot', 'vehicle', 'speed'], category: 'Space', tags: ['Ship', 'Pilot'], priority: 'Medium' },
  
  // Planets & Locations
  { keywords: ['planet', 'city', 'outpost', 'location', 'zone'], category: 'Planets', tags: ['Navigation'], priority: 'Medium' },
  
  // Factions & Politics
  { keywords: ['faction', 'imperial', 'rebel', 'neutral', 'reputation'], category: 'Factions', tags: ['Politics'], priority: 'Medium' },
  
  // Systems & Mechanics
  { keywords: ['system', 'mechanic', 'feature', 'update', 'patch'], category: 'Systems', tags: ['Gameplay'], priority: 'Low' }
];

// Fuzzy matching function
function fuzzyMatch(text, keywords) {
  const textLower = text.toLowerCase();
  let matchScore = 0;
  let totalKeywords = 0;
  
  for (const keyword of keywords) {
    totalKeywords++;
    if (textLower.includes(keyword.toLowerCase())) {
      matchScore++;
    }
  }
  
  return matchScore / totalKeywords;
}

// Enhanced rule-based classifier with fuzzy logic
function ruleBasedClassifier(text) {
  let bestMatch = null;
  let bestScore = 0;
  
  for (const rule of rules) {
    const score = fuzzyMatch(text, rule.keywords);
    if (score > bestScore && score > 0.3) { // Minimum 30% match threshold
      bestScore = score;
      bestMatch = {
        source: 'rules',
        category: rule.category,
        tags: rule.tags,
        confidence: score,
        ms11_priority: rule.priority
      };
    }
  }
  
  return bestMatch;
}

// GPT fallback classifier (mock implementation)
function gptFallbackClassifier(text) {
  // This would integrate with OpenAI API in production
  // For now, using a simple heuristic based on text length and content
  const wordCount = text.split(' ').length;
  const hasNumbers = /\d/.test(text);
  const hasCoordinates = /[NS]\d+[EW]\d+/.test(text);
  
  if (hasCoordinates) {
    return {
      source: 'ai-fallback',
      category: 'Planets',
      tags: ['Location', 'Coordinates'],
      confidence: 0.7,
      ms11_priority: 'Medium'
    };
  }
  
  if (hasNumbers && wordCount > 50) {
    return {
      source: 'ai-fallback',
      category: 'Systems',
      tags: ['Mechanics', 'Data'],
      confidence: 0.6,
      ms11_priority: 'Medium'
    };
  }
  
  return {
    source: 'ai-fallback',
    category: 'Exploration',
    tags: ['General'],
    confidence: 0.4,
    ms11_priority: 'Low'
  };
}

// Main classification function
export function classifyContent(text) {
  // Try rule-based classification first
  let classification = ruleBasedClassifier(text);
  
  // If no good match found, use AI fallback
  if (!classification || classification.confidence < 0.5) {
    classification = gptFallbackClassifier(text);
  }
  
  return classification;
}

// Process incoming folder
export function processIncomingFolder() {
  const incomingPath = path.join(__dirname, '../incoming');
  const processedPath = path.join(__dirname, '../data/processed');
  
  if (!fs.existsSync(incomingPath)) {
    console.log('📁 Creating incoming folder...');
    fs.mkdirSync(incomingPath, { recursive: true });
    return;
  }
  
  const files = fs.readdirSync(incomingPath).filter(file => 
    file.endsWith('.md') || file.endsWith('.txt')
  );
  
  if (files.length === 0) {
    console.log('📁 No files found in incoming folder');
    return;
  }
  
  console.log(`🔍 Processing ${files.length} files from incoming folder...`);
  
  for (const file of files) {
    const filePath = path.join(incomingPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const classification = classifyContent(content);
    
    // Generate metadata
    const metadata = {
      title: file.replace(/\.(md|txt)$/, ''),
      filename: file,
      classified_at: new Date().toISOString(),
      word_count: content.split(' ').length,
      ...classification
    };
  
    // Create processed directory structure
    const categoryDir = path.join(processedPath, classification.category.toLowerCase());
    fs.mkdirSync(categoryDir, { recursive: true });
    
    // Save metadata
    const metadataPath = path.join(categoryDir, `${file}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    // Move file to processed
    const processedFilePath = path.join(categoryDir, file);
    fs.renameSync(filePath, processedFilePath);
    
    console.log(`✅ Processed: ${file} → ${classification.category} (${Math.round(classification.confidence * 100)}% confidence)`);
  }
}

// CLI interface
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  
  if (args.includes('--incoming')) {
    processIncomingFolder();
  } else {
    const getArg = (flag, defaultVal) => {
      const idx = args.indexOf(flag);
      return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultVal;
    };

    const inputPath = getArg('--input', path.join(__dirname, '../data/sample-hint.md'));
    const outputPath = getArg('--output', path.join(__dirname, '../classified/sample-hint.json'));

    if (!fs.existsSync(inputPath)) {
      console.log('❌ Input file not found:', inputPath);
      process.exit(1);
    }

    const raw = fs.readFileSync(inputPath, 'utf8');
    const classification = classifyContent(raw);

    const metadata = {
      title: path.basename(inputPath, path.extname(inputPath)),
      classified_at: new Date().toISOString(),
      ...classification
    };

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

    console.log('✅ Classified:', metadata);
  }
}

export { ruleBasedClassifier, gptFallbackClassifier }; 
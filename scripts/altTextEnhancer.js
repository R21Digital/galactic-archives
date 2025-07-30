import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple alt-text generation based on filename and context
function generateAltText(filename, context = '') {
  const name = path.basename(filename, path.extname(filename));
  
  // Common SWG-related patterns
  const patterns = {
    'screenshot': 'Screenshot of SWG gameplay',
    'map': 'Map of SWG location',
    'character': 'SWG character portrait',
    'item': 'SWG item or equipment',
    'location': 'SWG location or landmark',
    'ui': 'SWG user interface',
    'combat': 'SWG combat scene',
    'crafting': 'SWG crafting interface',
    'space': 'SWG space combat',
    'planet': 'SWG planet view',
    'faction': 'SWG faction symbol or location',
    'quest': 'SWG quest interface or location',
    'profession': 'SWG profession trainer or skill',
    'vehicle': 'SWG vehicle or mount',
    'building': 'SWG building or structure',
    'npc': 'SWG non-player character',
    'mob': 'SWG creature or enemy',
    'loot': 'SWG loot or rewards',
    'trade': 'SWG trading interface',
    'social': 'SWG social interaction'
  };
  
  // Try to match patterns
  for (const [pattern, altText] of Object.entries(patterns)) {
    if (name.toLowerCase().includes(pattern)) {
      return altText;
    }
  }
  
  // Fallback based on file extension and context
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
    if (context.includes('combat') || context.includes('fight')) {
      return 'SWG combat scene';
    } else if (context.includes('craft') || context.includes('artisan')) {
      return 'SWG crafting scene';
    } else if (context.includes('space') || context.includes('ship')) {
      return 'SWG space scene';
    } else if (context.includes('planet') || context.includes('location')) {
      return 'SWG location view';
    } else {
      return `SWG screenshot: ${name.replace(/[-_]/g, ' ')}`;
    }
  }
  
  return `SWG image: ${name.replace(/[-_]/g, ' ')}`;
}

// Process HTML files to add alt text to images
function processHtmlFiles() {
  const srcPath = path.join(__dirname, '../src');
  const files = [];
  
  // Find all HTML/MD files
  function findFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findFiles(fullPath);
      } else if (item.endsWith('.html') || item.endsWith('.md') || item.endsWith('.njk')) {
        files.push(fullPath);
      }
    }
  }
  
  findFiles(srcPath);
  
  console.log(`🔍 Processing ${files.length} files for alt-text enhancement...`);
  
  let processedCount = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      // Find images without alt text
      const imgRegex = /<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
      let newContent = content.replace(imgRegex, (match, before, src, after) => {
        // Check if alt text already exists
        if (before.includes('alt=') || after.includes('alt=')) {
          return match; // Already has alt text
        }
        
        // Generate alt text
        const altText = generateAltText(src, content);
        modified = true;
        
        // Add alt text
        if (after.trim()) {
          return `<img${before}src="${src}" alt="${altText}"${after}>`;
        } else {
          return `<img${before}src="${src}" alt="${altText}">`;
        }
      });
      
      if (modified) {
        fs.writeFileSync(file, newContent);
        processedCount++;
        console.log(`✅ Enhanced: ${path.relative(srcPath, file)}`);
      }
      
    } catch (error) {
      console.log(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`🎉 Enhanced ${processedCount} files with alt text`);
}

// Process a single file
function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('❌ File not found:', filePath);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const imgRegex = /<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;
  
  let newContent = content.replace(imgRegex, (match, before, src, after) => {
    if (before.includes('alt=') || after.includes('alt=')) {
      return match;
    }
    
    const altText = generateAltText(src, content);
    console.log(`📝 Generated alt text for ${src}: "${altText}"`);
    
    if (after.trim()) {
      return `<img${before}src="${src}" alt="${altText}"${after}>`;
    } else {
      return `<img${before}src="${src}" alt="${altText}">`;
    }
  });
  
  fs.writeFileSync(filePath, newContent);
  console.log(`✅ Enhanced: ${filePath}`);
}

// CLI interface
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  
  if (args.includes('--all')) {
    processHtmlFiles();
  } else if (args[0]) {
    processFile(args[0]);
  } else {
    console.log('Usage:');
    console.log('  node scripts/altTextEnhancer.js --all          # Process all files');
    console.log('  node scripts/altTextEnhancer.js <file>         # Process single file');
  }
}

export { generateAltText, processHtmlFiles, processFile }; 
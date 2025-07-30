import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const EXPORT_DIR = path.join(__dirname, '../data/ms11-export');
const SRC_DIR = path.join(__dirname, '../src');

// MS11 export structure
const MS11_EXPORT_SCHEMA = {
  version: '1.0',
  export_date: new Date().toISOString(),
  source: 'SWGDB',
  content: {
    pages: [],
    categories: [],
    metadata: {}
  }
};

// Extract content from markdown files
function extractContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let frontmatter = {};
  let body = [];
  let inFrontmatter = false;
  let frontmatterEnded = false;
  
  for (const line of lines) {
    if (line.trim() === '---' && !inFrontmatter) {
      inFrontmatter = true;
      continue;
    }
    
    if (line.trim() === '---' && inFrontmatter) {
      frontmatterEnded = true;
      continue;
    }
    
    if (inFrontmatter && !frontmatterEnded) {
      // Parse YAML frontmatter
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        frontmatter[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
      }
    } else if (frontmatterEnded) {
      body.push(line);
    }
  }
  
  return {
    frontmatter,
    content: body.join('\n').trim(),
    wordCount: body.join(' ').split(/\s+/).length
  };
}

// Process a single file
function processFile(filePath, relativePath) {
  try {
    const { frontmatter, content, wordCount } = extractContent(filePath);
    
    return {
      path: relativePath,
      title: frontmatter.title || path.basename(filePath, path.extname(filePath)),
      category: frontmatter.category || 'Uncategorized',
      tags: frontmatter.tags ? 
        (Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags]) : 
        [],
      description: frontmatter.description || '',
      author: frontmatter.author || 'SWGDB Community',
      date: frontmatter.date || frontmatter.submitted_at || new Date().toISOString(),
      last_updated: frontmatter.last_updated || new Date().toISOString(),
      content: content,
      word_count: wordCount,
      metadata: {
        layout: frontmatter.layout,
        eleventyExcludeFromCollections: frontmatter.eleventyExcludeFromCollections,
        source_url: frontmatter.source_url
      }
    };
  } catch (error) {
    console.log(`❌ Error processing ${filePath}:`, error.message);
    return null;
  }
}

// Find all markdown files recursively
function findMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip certain directories
        if (item.startsWith('_') || item === 'node_modules' || item === '.git') {
          continue;
        }
        files.push(...findMarkdownFiles(fullPath, baseDir));
      } else if (item.endsWith('.md')) {
        const relativePath = path.relative(baseDir, fullPath);
        files.push({ fullPath, relativePath });
      }
    }
  } catch (error) {
    console.log(`⚠️ Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

// Group content by category
function groupByCategory(pages) {
  const categories = {};
  
  for (const page of pages) {
    const category = page.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(page);
  }
  
  return categories;
}

// Generate category summaries
function generateCategorySummaries(categories) {
  const summaries = [];
  
  for (const [category, pages] of Object.entries(categories)) {
    const totalPages = pages.length;
    const totalWords = pages.reduce((sum, page) => sum + page.word_count, 0);
    const avgWords = Math.round(totalWords / totalPages);
    
    const tags = new Set();
    pages.forEach(page => {
      page.tags.forEach(tag => tags.add(tag));
    });
    
    summaries.push({
      name: category,
      page_count: totalPages,
      total_words: totalWords,
      average_words: avgWords,
      tags: Array.from(tags),
      last_updated: pages.reduce((latest, page) => 
        new Date(page.last_updated) > new Date(latest) ? page.last_updated : latest
      , pages[0].last_updated)
    });
  }
  
  return summaries;
}

// Main export function
export function exportForMS11() {
  console.log('🚀 Exporting content for MS11 ingestion...');
  
  // Find all markdown files
  const files = findMarkdownFiles(SRC_DIR);
  console.log(`📁 Found ${files.length} markdown files`);
  
  // Process files
  const pages = [];
  for (const { fullPath, relativePath } of files) {
    const page = processFile(fullPath, relativePath);
    if (page) {
      pages.push(page);
    }
  }
  
  console.log(`✅ Processed ${pages.length} pages`);
  
  // Group by category
  const categories = groupByCategory(pages);
  const categorySummaries = generateCategorySummaries(categories);
  
  // Create export structure
  const exportData = {
    ...MS11_EXPORT_SCHEMA,
    content: {
      pages: pages,
      categories: categorySummaries,
      metadata: {
        total_pages: pages.length,
        total_categories: Object.keys(categories).length,
        total_words: pages.reduce((sum, page) => sum + page.word_count, 0),
        export_timestamp: new Date().toISOString()
      }
    }
  };
  
  // Create export directory
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  
  // Export main file
  const mainExportPath = path.join(EXPORT_DIR, 'swgdb-content.json');
  fs.writeFileSync(mainExportPath, JSON.stringify(exportData, null, 2));
  
  // Export by category
  for (const [category, categoryPages] of Object.entries(categories)) {
    const categoryExportPath = path.join(EXPORT_DIR, `${category.toLowerCase()}.json`);
    const categoryData = {
      ...MS11_EXPORT_SCHEMA,
      content: {
        category: category,
        pages: categoryPages,
        summary: categorySummaries.find(s => s.name === category)
      }
    };
    fs.writeFileSync(categoryExportPath, JSON.stringify(categoryData, null, 2));
  }
  
  // Export metadata only
  const metadataPath = path.join(EXPORT_DIR, 'metadata.json');
  const metadataData = {
    ...MS11_EXPORT_SCHEMA,
    content: {
      categories: categorySummaries,
      metadata: exportData.content.metadata
    }
  };
  fs.writeFileSync(metadataPath, JSON.stringify(metadataData, null, 2));
  
  console.log(`📊 Export complete:`);
  console.log(`   📄 Main export: ${mainExportPath}`);
  console.log(`   📁 Category exports: ${Object.keys(categories).length} files`);
  console.log(`   📋 Metadata: ${metadataPath}`);
  console.log(`   📈 Total pages: ${pages.length}`);
  console.log(`   📈 Total words: ${exportData.content.metadata.total_words}`);
  
  return exportData;
}

// Generate MS11-readable summary
export function generateMS11Summary() {
  const exportData = exportForMS11();
  
  const summary = {
    source: 'SWGDB',
    export_date: new Date().toISOString(),
    overview: {
      total_pages: exportData.content.metadata.total_pages,
      total_categories: exportData.content.metadata.total_categories,
      total_words: exportData.content.metadata.total_words,
      categories: exportData.content.categories.map(cat => ({
        name: cat.name,
        page_count: cat.page_count,
        average_words: cat.average_words
      }))
    },
    recent_content: exportData.content.pages
      .sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))
      .slice(0, 10)
      .map(page => ({
        title: page.title,
        category: page.category,
        word_count: page.word_count,
        last_updated: page.last_updated
      }))
  };
  
  const summaryPath = path.join(EXPORT_DIR, 'ms11-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  console.log(`📋 MS11 Summary: ${summaryPath}`);
  return summary;
}

// CLI interface
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  
  if (args.includes('--export')) {
    exportForMS11();
  } else if (args.includes('--summary')) {
    generateMS11Summary();
  } else if (args.includes('--full')) {
    exportForMS11();
    generateMS11Summary();
  } else {
    console.log('Usage:');
    console.log('  node scripts/ms11Export.js --export    # Export all content');
    console.log('  node scripts/ms11Export.js --summary   # Generate MS11 summary');
    console.log('  node scripts/ms11Export.js --full      # Export + summary');
  }
}

export { processFile, findMarkdownFiles, groupByCategory }; 
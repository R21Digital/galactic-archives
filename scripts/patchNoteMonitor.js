import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SWGR_NEWS_URL = 'https://swgr.org/node/news/';
const PATCH_NOTES_DIR = path.join(__dirname, '../src/patch-notes');
const LAST_CHECK_FILE = path.join(__dirname, '../data/last-patch-check.json');

// Patch note detection patterns
const PATCH_PATTERNS = [
  /patch\s+notes?/i,
  /update\s+\d+\.\d+/i,
  /version\s+\d+\.\d+/i,
  /maintenance\s+update/i,
  /server\s+update/i,
  /game\s+update/i
];

// Extract date from various formats
function extractDate(text) {
  const datePatterns = [
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{4})-(\d{1,2})-(\d{1,2})/,
    /(\d{1,2})-(\d{1,2})-(\d{4})/
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const [_, month, day, year] = match;
      return new Date(year, month - 1, day);
    }
  }
  
  return new Date();
}

// Generate patch note filename
function generateFilename(title, date) {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const dateStr = date.toISOString().split('T')[0];
  return `patch-${dateStr}-${cleanTitle}.md`;
}

// Create patch note content
function createPatchNote(post) {
  const date = extractDate(post.date || new Date());
  const filename = generateFilename(post.title, date);
  
  const content = `---
title: "${post.title}"
layout: patch-note.njk
description: "${post.description || 'SWGR patch notes and updates'}"
date: ${date.toISOString().split('T')[0]}
category: Patch Notes
tags: [patch, update, swgr]
source_url: "${post.url}"
---

# ${post.title}

${post.content || 'Patch notes content will be updated soon.'}

---

*Source: [SWGR News](${post.url})*

*Last updated: ${new Date().toISOString().split('T')[0]}*
`;

  return { filename, content };
}

// Mock function to fetch SWGR news (would use real HTTP client)
function fetchSWGRNews() {
  // This would normally fetch from SWGR_NEWS_URL
  // For now, returning mock data
  return [
    {
      title: 'Patch Notes - Version 1.0.5',
      url: 'https://swgr.org/node/news/patch-notes-version-1-0-5',
      date: '2025-01-27',
      description: 'Latest SWGR patch notes with bug fixes and improvements',
      content: 'This update includes various bug fixes and performance improvements...'
    },
    {
      title: 'Server Maintenance - January 27, 2025',
      url: 'https://swgr.org/node/news/server-maintenance-january-27-2025',
      date: '2025-01-27',
      description: 'Scheduled server maintenance and updates',
      content: 'The server will be down for maintenance on January 27th...'
    }
  ];
}

// Check if post is a patch note
function isPatchNote(post) {
  const title = post.title.toLowerCase();
  const content = (post.content || '').toLowerCase();
  
  return PATCH_PATTERNS.some(pattern => 
    pattern.test(title) || pattern.test(content)
  );
}

// Load last check time
function loadLastCheck() {
  try {
    if (fs.existsSync(LAST_CHECK_FILE)) {
      const data = JSON.parse(fs.readFileSync(LAST_CHECK_FILE, 'utf8'));
      return new Date(data.lastCheck);
    }
  } catch (error) {
    console.log('⚠️ Error loading last check time:', error.message);
  }
  return new Date(0);
}

// Save last check time
function saveLastCheck() {
  const data = { lastCheck: new Date().toISOString() };
  fs.writeFileSync(LAST_CHECK_FILE, JSON.stringify(data, null, 2));
}

// Main monitoring function
export function monitorPatchNotes() {
  console.log('🔍 Monitoring SWGR patch notes...');
  
  const lastCheck = loadLastCheck();
  const now = new Date();
  
  console.log(`📅 Last check: ${lastCheck.toISOString()}`);
  console.log(`📅 Current time: ${now.toISOString()}`);
  
  // Fetch news posts
  const posts = fetchSWGRNews();
  console.log(`📰 Found ${posts.length} news posts`);
  
  let newPatchNotes = 0;
  
  for (const post of posts) {
    const postDate = new Date(post.date);
    
    // Check if it's a patch note and newer than last check
    if (isPatchNote(post) && postDate > lastCheck) {
      console.log(`✅ Found new patch note: ${post.title}`);
      
      const { filename, content } = createPatchNote(post);
      const filePath = path.join(PATCH_NOTES_DIR, filename);
      
      // Create directory if it doesn't exist
      fs.mkdirSync(PATCH_NOTES_DIR, { recursive: true });
      
      // Check if file already exists
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
        console.log(`📝 Created: ${filename}`);
        newPatchNotes++;
      } else {
        console.log(`⚠️ File already exists: ${filename}`);
      }
    }
  }
  
  // Save check time
  saveLastCheck();
  
  console.log(`🎉 Processed ${newPatchNotes} new patch notes`);
  return newPatchNotes;
}

// CLI interface
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  
  if (args.includes('--monitor')) {
    monitorPatchNotes();
  } else if (args.includes('--test')) {
    // Test with mock data
    console.log('🧪 Testing patch note detection...');
    const testPosts = [
      { title: 'Patch Notes 1.0.5', content: 'Bug fixes and updates' },
      { title: 'Server Maintenance', content: 'Scheduled downtime' },
      { title: 'Regular News', content: 'Community updates' }
    ];
    
    for (const post of testPosts) {
      const isPatch = isPatchNote(post);
      console.log(`${isPatch ? '✅' : '❌'} "${post.title}" - ${isPatch ? 'Patch Note' : 'Regular News'}`);
    }
  } else {
    console.log('Usage:');
    console.log('  node scripts/patchNoteMonitor.js --monitor    # Monitor for new patch notes');
    console.log('  node scripts/patchNoteMonitor.js --test       # Test detection patterns');
  }
}

export { isPatchNote, createPatchNote }; 
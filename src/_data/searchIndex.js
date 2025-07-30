import { globSync } from 'glob';
import fs from 'fs';
import matter from 'gray-matter';

export default function () {
  const files = globSync('src/**/*.md', {
    ignore: [
      'src/_includes/**',
      'src/layouts/**',
      'src/styles/**',
      'src/scripts/**',
      'src/internal/**'
    ]
  });

  const index = [];
  for (const file of files) {
    const fileContents = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(fileContents);
    if (data.eleventyExcludeFromCollections) continue;

    const relative = file
      .replace(/^src\//, '')
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '');
    const url = data.permalink || `/${relative}/`;

    index.push({
      title: data.title || '',
      category: data.category,
      tags: data.tags,
      url,
      last_updated: data.last_updated,
      content
    });
  }

  return index;
}

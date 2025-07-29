import { jest } from '@jest/globals';
import nunjucks from 'nunjucks';
import fs from 'fs';
import matter from 'gray-matter';
import eleventyConfigFn, { slugifyCategory } from '../.eleventy.js';


function renderTemplate(templatePath, context) {
  const tpl = fs.readFileSync(templatePath, 'utf8');
  const content = tpl.split('---').slice(2).join('---').trim();
  const loader = new nunjucks.FileSystemLoader('src/_includes');
  const env = new nunjucks.Environment(loader);
  if (context.jsonFilter) {
    env.addFilter('json', context.jsonFilter);
  }
  return env.renderString(content, context);
}

test('professions and quests API templates render valid JSON arrays', () => {
  const collections = {};
  let jsonFilter;
  const mockConfig = {
    addPassthroughCopy: jest.fn(),
    addFilter: (name, fn) => {
      if (name === 'json') jsonFilter = fn;
    },
    addCollection: (name, fn) => {
      collections[name] = fn;
    },
  };

  eleventyConfigFn(mockConfig);

  const items = [
    {
      data: {
        title: 'Ranger',
        category: 'Professions',
        tags: ['Ranged'],
        last_updated: '2025-07-26',
      },
      url: '/ranger/',
    },
    {
      data: {
        title: 'Legacy Quest',
        category: 'Quests',
        tags: ['Story'],
        last_updated: '2025-07-26',
      },
      url: '/legacy-quest/',
    },
  ];

  const collectionApi = { getAll: () => items };
  const professions = collections[slugifyCategory('Professions')](collectionApi);
  const quests = collections[slugifyCategory('Quests')](collectionApi);

  const profRendered = renderTemplate('src/api/professions.json.njk', {
    collections: { professions },
    jsonFilter,
  });
  const questRendered = renderTemplate('src/api/quests.json.njk', {
    collections: { quests },
    jsonFilter,
  });

  const profParsed = JSON.parse(profRendered);
  const questParsed = JSON.parse(questRendered);

  expect(Array.isArray(profParsed)).toBe(true);
  expect(Array.isArray(questParsed)).toBe(true);

  profParsed.forEach((obj) => {
    expect(obj).toHaveProperty('title');
    expect(obj).toHaveProperty('category');
    expect(obj).toHaveProperty('tags');
    expect(obj).toHaveProperty('url');
    expect(obj).toHaveProperty('last_updated');
  });

  questParsed.forEach((obj) => {
    expect(obj).toHaveProperty('title');
    expect(obj).toHaveProperty('category');
    expect(obj).toHaveProperty('tags');
    expect(obj).toHaveProperty('url');
    expect(obj).toHaveProperty('last_updated');
  });
});

test('API templates exclude themselves from collections via front matter', () => {
  const profMatter = matter(fs.readFileSync('src/api/professions.json.njk', 'utf8'));
  const questMatter = matter(fs.readFileSync('src/api/quests.json.njk', 'utf8'));

  expect(profMatter.data.eleventyExcludeFromCollections).toBe(true);
  expect(questMatter.data.eleventyExcludeFromCollections).toBe(true);
});

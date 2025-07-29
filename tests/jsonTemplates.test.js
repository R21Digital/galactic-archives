import { jest } from '@jest/globals';
import nunjucks from 'nunjucks';
import fs from 'fs';
import eleventyConfigFn from '../.eleventy.js';


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

test('search-index template renders valid JSON array', () => {
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

  // Register collections and filters
  eleventyConfigFn(mockConfig);

  const items = [
    {
      data: {
        title: 'Page One',
        category: 'Guides',
        tags: ['intro'],
        last_updated: '2025-07-27',
      },
      url: '/page-one/',
    },
    {
      data: {
        title: 'Page Two',
        category: 'Planets',
        tags: ['outdoor'],
        last_updated: '2025-07-26',
      },
      url: '/page-two/',
    },
  ];

  const collectionApi = { getAll: () => items };
  const searchIndex = collections['searchIndex'](collectionApi);

  const rendered = renderTemplate('src/search-index.json.njk', {
    collections: { searchIndex },
    jsonFilter,
  });

  const parsed = JSON.parse(rendered);
  expect(Array.isArray(parsed)).toBe(true);
  parsed.forEach((obj) => {
    expect(obj).toHaveProperty('title');
    expect(obj).toHaveProperty('category');
    expect(obj).toHaveProperty('tags');
    expect(obj).toHaveProperty('url');
    expect(obj).toHaveProperty('last_updated');
  });
});

test('quests and professions templates render valid JSON arrays', () => {
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

  // Register collections and filters
  eleventyConfigFn(mockConfig);

  const items = [
    {
      data: {
        title: 'Legacy Quest',
        category: 'Quests',
        tags: ['Story'],
        last_updated: '2025-07-26',
      },
      url: '/legacy-quest/',
    },
    {
      data: {
        title: 'Ranger',
        category: 'Professions',
        tags: ['Ranged'],
        last_updated: '2025-07-26',
      },
      url: '/ranger/',
    },
  ];

  const collectionApi = { getAll: () => items };
  const quests = collections['quests'](collectionApi);
  const professions = collections['professions'](collectionApi);

  const questsRendered = renderTemplate('src/api/quests.json.njk', {
    collections: { quests },
    jsonFilter,
  });
  const professionsRendered = renderTemplate('src/api/professions.json.njk', {
    collections: { professions },
    jsonFilter,
  });

  const questsParsed = JSON.parse(questsRendered);
  const professionsParsed = JSON.parse(professionsRendered);

  expect(Array.isArray(questsParsed)).toBe(true);
  expect(Array.isArray(professionsParsed)).toBe(true);

  questsParsed.forEach((obj) => {
    expect(obj).toHaveProperty('title');
    expect(obj).toHaveProperty('category');
    expect(obj).toHaveProperty('tags');
    expect(obj).toHaveProperty('url');
    expect(obj).toHaveProperty('last_updated');
  });

  professionsParsed.forEach((obj) => {
    expect(obj).toHaveProperty('title');
    expect(obj).toHaveProperty('category');
    expect(obj).toHaveProperty('tags');
    expect(obj).toHaveProperty('url');
    expect(obj).toHaveProperty('last_updated');
  });
});

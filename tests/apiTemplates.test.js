import { jest } from '@jest/globals';
import nunjucks from 'nunjucks';
import fs from 'fs';
import eleventyConfigFn, { slugifyCategory } from '../.eleventy.js';

class NullLoader extends nunjucks.Loader {
  getSource(name) {
    return { src: '', path: name, noCache: true };
  }
}

function renderTemplate(templatePath, context) {
  const tpl = fs.readFileSync(templatePath, 'utf8');
  const content = tpl.split('---').slice(2).join('---').trim();
  const env = new nunjucks.Environment(new NullLoader());
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

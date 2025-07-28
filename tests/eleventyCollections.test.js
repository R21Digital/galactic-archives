import { jest } from '@jest/globals';
import eleventyConfigFn, { slugifyCategory } from '../.eleventy.js';

test('professions and quests collections filter items by category', () => {
  const collections = {};
  const mockConfig = {
    addPassthroughCopy: jest.fn(),
    addFilter: jest.fn(),
    addCollection: (name, fn) => {
      collections[name] = fn;
    }
  };

  // Load Eleventy configuration which registers collections
  eleventyConfigFn(mockConfig);

  expect(collections).toHaveProperty(slugifyCategory('Professions'));
  expect(collections).toHaveProperty(slugifyCategory('Quests'));

  const items = [
    { data: { category: 'Professions', title: 'Ranger' } },
    { data: { category: 'Quests', title: 'Legacy Quest' } },
    { data: { category: 'Professions', title: 'Medic' } }
  ];
  const collectionApi = {
    getAll: () => items
  };

  const professions = collections[slugifyCategory('Professions')](collectionApi);
  const quests = collections[slugifyCategory('Quests')](collectionApi);

  expect(professions.map(i => i.data.title)).toEqual(['Ranger', 'Medic']);
  expect(quests.map(i => i.data.title)).toEqual(['Legacy Quest']);

  // Punctuation is removed when slugifying categories
  expect(slugifyCategory('Lore & Legends!')).toBe('lore-legends');
});

test('category collections exclude items flagged eleventyExcludeFromCollections', () => {
  const collections = {};
  const mockConfig = {
    addPassthroughCopy: jest.fn(),
    addFilter: jest.fn(),
    addCollection: (name, fn) => {
      collections[name] = fn;
    }
  };

  eleventyConfigFn(mockConfig);

  const items = [
    { data: { category: 'Professions', title: 'Smuggler' } },
    { data: { category: 'Professions', title: 'Hidden', eleventyExcludeFromCollections: true } }
  ];
  const collectionApi = {
    getAll: () => items
  };

  const professions = collections[slugifyCategory('Professions')](collectionApi);
  expect(professions.map(i => i.data.title)).toEqual(['Smuggler']);
});

test('categories from excluded files are not added to collections', () => {
  const collections = {};
  const mockConfig = {
    addPassthroughCopy: jest.fn(),
    addFilter: jest.fn(),
    addCollection: (name, fn) => {
      collections[name] = fn;
    }
  };

  eleventyConfigFn(mockConfig);

  expect(collections).not.toHaveProperty(slugifyCategory('Home'));
  expect(collections).not.toHaveProperty(slugifyCategory('Internal'));
});

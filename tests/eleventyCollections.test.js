import { jest } from '@jest/globals';
import eleventyConfigFn from '../.eleventy.js';

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

  const slugify = (cat) => cat.toLowerCase().replace(/\s+/g, '-');

  expect(collections).toHaveProperty(slugify('Professions'));
  expect(collections).toHaveProperty(slugify('Quests'));

  const items = [
    { data: { category: 'Professions', title: 'Ranger' } },
    { data: { category: 'Quests', title: 'Legacy Quest' } },
    { data: { category: 'Professions', title: 'Medic' } }
  ];
  const collectionApi = {
    getAll: () => items
  };

  const professions = collections[slugify('Professions')](collectionApi);
  const quests = collections[slugify('Quests')](collectionApi);

  expect(professions.map(i => i.data.title)).toEqual(['Ranger', 'Medic']);
  expect(quests.map(i => i.data.title)).toEqual(['Legacy Quest']);
});

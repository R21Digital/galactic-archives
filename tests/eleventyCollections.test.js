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

  expect(collections).toHaveProperty('professions');
  expect(collections).toHaveProperty('quests');

  const items = [
    { data: { category: 'Professions', title: 'Ranger' } },
    { data: { category: 'Quests', title: 'Legacy Quest' } },
    { data: { category: 'Professions', title: 'Medic' } }
  ];
  const collectionApi = {
    getAll: () => items
  };

  const professions = collections.professions(collectionApi);
  const quests = collections.quests(collectionApi);

  expect(professions.map(i => i.data.title)).toEqual(['Ranger', 'Medic']);
  expect(quests.map(i => i.data.title)).toEqual(['Legacy Quest']);
});

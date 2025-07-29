import { jest } from '@jest/globals';
import eleventyConfigFn from '../.eleventy.js';

test('date filter is registered', () => {
  const mockConfig = {
    addPassthroughCopy: jest.fn(),
    addFilter: jest.fn(),
    addCollection: jest.fn(),
  };

  eleventyConfigFn(mockConfig);
  expect(mockConfig.addFilter).toHaveBeenCalledWith('date', expect.any(Function));
});

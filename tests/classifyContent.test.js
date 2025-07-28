import { jest } from '@jest/globals';

// Mock fs to ensure no real file operations occur when importing the module
jest.unstable_mockModule('fs', () => ({
  default: {
    readFileSync: jest.fn(() => ''),
    writeFileSync: jest.fn(),
    mkdirSync: jest.fn(),
  }
}));

let classifyContent, ruleBasedClassifier, fallbackAIMockClassifier;

beforeAll(async () => {
  const mod = await import('../scripts/classifyContent.js');
  classifyContent = mod.classifyContent;
  ruleBasedClassifier = mod.ruleBasedClassifier;
  fallbackAIMockClassifier = mod.fallbackAIMockClassifier;
});

describe('classifyContent', () => {
  test('rule-based match returns Quests category', () => {
    const result = classifyContent('You must kill the beast');
    expect(result).toEqual({
      source: 'rules',
      category: 'Quests',
      tags: ['Combat'],
      ms11_priority: 'Medium'
    });
  });

  test('fallback classification used when no rules match', () => {
    const result = classifyContent('Just explore the world');
    expect(result).toEqual({
      source: 'ai-fallback',
      category: 'Exploration',
      tags: ['Planet', 'Navigation'],
      ms11_priority: 'Low'
    });
  });

  test('ruleBasedClassifier returns null when no rule matches', () => {
    expect(ruleBasedClassifier('random text')).toBeNull();
  });

  test('fallbackAIMockClassifier returns exploration classification', () => {
    expect(fallbackAIMockClassifier('anything')).toEqual({
      source: 'ai-fallback',
      category: 'Exploration',
      tags: ['Planet', 'Navigation'],
      ms11_priority: 'Low'
    });
  });
});

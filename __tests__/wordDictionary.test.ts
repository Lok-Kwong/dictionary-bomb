import { WORD_DICTIONARY, WordEntry, getRandomWord } from '../lib/wordDictionary';

describe('WORD_DICTIONARY', () => {
  it('contains at least one entry', () => {
    expect(WORD_DICTIONARY.length).toBeGreaterThan(0);
  });

  it('every entry has a non-empty word and definition string', () => {
    for (const entry of WORD_DICTIONARY) {
      expect(typeof entry.word).toBe('string');
      expect(entry.word.length).toBeGreaterThan(0);
      expect(typeof entry.definition).toBe('string');
      expect(entry.definition.length).toBeGreaterThan(0);
    }
  });

  it('has no duplicate words', () => {
    const words = WORD_DICTIONARY.map((e) => e.word);
    const uniqueWords = new Set(words);
    expect(uniqueWords.size).toBe(words.length);
  });
});

describe('getRandomWord', () => {
  it('returns a WordEntry with word and definition', () => {
    const entry = getRandomWord();
    expect(typeof entry.word).toBe('string');
    expect(entry.word.length).toBeGreaterThan(0);
    expect(typeof entry.definition).toBe('string');
    expect(entry.definition.length).toBeGreaterThan(0);
  });

  it('returns an entry that exists in WORD_DICTIONARY', () => {
    const entry = getRandomWord();
    const found = WORD_DICTIONARY.find((e) => e.word === entry.word);
    expect(found).toBeDefined();
  });

  it('produces varied results across many calls', () => {
    const words = new Set(Array.from({ length: 30 }, () => getRandomWord().word));
    expect(words.size).toBeGreaterThan(1);
  });
});

describe('getRandomWordExcluding', () => {
  // getRandomWordExcluding mutates WORD_DICTIONARY, so reset the module for each test.
  let getRandomWordExcludingFresh: (exclude: string) => WordEntry;
  let getDictionaryFresh: () => WordEntry[];

  beforeEach(() => {
    jest.resetModules();
    const mod = require('../lib/wordDictionary');
    getRandomWordExcludingFresh = mod.getRandomWordExcluding;
    getDictionaryFresh = () => mod.WORD_DICTIONARY;
  });

  it('does not return the excluded word', () => {
    const excluded = 'lighthouse';
    const entry = getRandomWordExcludingFresh(excluded);
    expect(entry.word).not.toBe(excluded);
  });

  it('removes the excluded word from WORD_DICTIONARY', () => {
    const excluded = 'volcano';
    getRandomWordExcludingFresh(excluded);
    const remaining = getDictionaryFresh().find((e: WordEntry) => e.word === excluded);
    expect(remaining).toBeUndefined();
  });

  it('still returns a valid WordEntry with word and definition', () => {
    const entry = getRandomWordExcludingFresh('glacier');
    expect(typeof entry.word).toBe('string');
    expect(entry.word.length).toBeGreaterThan(0);
    expect(typeof entry.definition).toBe('string');
    expect(entry.definition.length).toBeGreaterThan(0);
  });

  it('can be called multiple times to progressively shrink the dictionary', () => {
    const initialSize = getDictionaryFresh().length;
    getRandomWordExcludingFresh('tornado');
    getRandomWordExcludingFresh('tsunami');
    expect(getDictionaryFresh().length).toBe(initialSize - 2);
  });
});

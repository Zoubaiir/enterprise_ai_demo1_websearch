/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';

// Import the functions to test by requiring the module file so we can call the helpers
import { tryExtractFromLdJson, tryExtractFromMeta, tryExtractFromDom } from '../src/presentation/content/facebook.extractor';

describe('facebook.extractor parsing', () => {
  const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'facebook_sample.html'), 'utf8');

  beforeEach(() => {
    document.documentElement.innerHTML = fixture;
  });

  test('extracts from ld+json', () => {
    const out = tryExtractFromLdJson();
    expect(out).toBeTruthy();
    expect(out!.title).toContain('2015 Honda Civic');
    expect(out!.price).toBe(9500);
  });

  test('extracts from meta tags', () => {
    const out = tryExtractFromMeta();
    expect(out).toBeTruthy();
    expect(out!.title).toContain('2015 Honda Civic');
    expect(out!.price).toBe(9500);
  });

  test('extracts from DOM heuristics', () => {
    const out = tryExtractFromDom();
    expect(out).toBeTruthy();
    expect(out!.title).toContain('2015 Honda Civic');
    expect(out!.price).toBe(9500);
  });
});
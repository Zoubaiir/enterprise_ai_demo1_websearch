/**
 * @jest-environment jsdom
 */
/// <reference types="jest" />

import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { tryExtractFromDom, tryExtractFromLdJson, tryExtractFromMeta } from '../src/presentation/content/facebook.extractor';

const loadHtml = (html: string) => {
  document.documentElement.innerHTML = html;
};

describe('facebook.extractor parsing', () => {
  const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'facebook_sample.html'), 'utf8');

  beforeEach(() => {
    document.documentElement.innerHTML = fixture;
  });

  test('extracts from ld+json', () => {
    loadHtml(`
      <html>
        <head>
          <script type="application/ld+json">
            {
              "@context": "http://schema.org",
              "@type": "Product",
              "name": "2015 Honda Civic LX",
              "offers": { "price": 9500 },
              "image": ["https://scontent.sample/image1.jpg"]
            }
          </script>
        </head>
        <body></body>
      </html>
    `);

    const out = tryExtractFromLdJson();
    expect(out).toBeTruthy();
    expect(out!.title).toBe('2015 Honda Civic LX');
    expect(out!.price).toBe(9500);
    expect(out!.images).toEqual(['https://scontent.sample/image1.jpg']);
  });

  test('extracts from meta tags', () => {
    loadHtml(`
      <html>
        <head>
          <meta property="og:title" content="2015 Honda Civic LX - $9,500" />
          <meta property="og:image" content="https://scontent.sample/image1.jpg" />
          <meta property="product:price:amount" content="9500" />
          <meta property="product:price:currency" content="USD" />
        </head>
        <body></body>
      </html>
    `);

    const out = tryExtractFromMeta();
    expect(out).toBeTruthy();
    expect(out!.title).toContain('2015 Honda Civic');
    expect(out!.price).toBe(9500);
    expect(out!.images).toEqual(['https://scontent.sample/image1.jpg']);
  });

  test('extracts from DOM heuristics', () => {
    loadHtml(`
      <html>
        <body>
          <h1>2015 Honda Civic LX</h1>
          <div>$9,500</div>
          <div>60,000 miles</div>
          <img src="https://scontent.sample/image1.jpg" width="200" height="150" />
        </body>
      </html>
    `);

    const out = tryExtractFromDom();
    expect(out).toBeTruthy();
    expect(out!.title).toBe('2015 Honda Civic LX');
    expect(out!.price).toBe(9500);
    expect(out!.mileage).toBe(60000);
    expect(out!.images).toEqual(['https://scontent.sample/image1.jpg']);
  });
});

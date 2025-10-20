import { sendEvaluateListingCommand } from "./messaging";

type ListingPayload = {
  url: string;
  title?: string;
  price?: number;
  images?: string[];
  year?: number;
  mileage?: number;
  vin?: string;
  sellerType?: string;
};

function parsePrice(text: string | null): number | undefined {
  if (!text) return undefined;
  const cleaned = text.replace(/[,$\s]/g, "").match(/\d+/);
  return cleaned ? Number(cleaned[0]) : undefined;
}

export function tryExtractFromLdJson(): Partial<ListingPayload> | null {
  try {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const s of scripts) {
      const txt = s.textContent || "";
      if (txt.includes("Product") || txt.includes("Vehicle")) {
        const obj = JSON.parse(txt);
        const title = obj.name || obj.title || obj.headline;
        const price = obj.offers?.price ? Number(obj.offers.price) : undefined;
        const images = obj.image ? (Array.isArray(obj.image) ? obj.image : [obj.image]) : undefined;
        return { title, price, images };
      }
    }
  } catch (e) {
    // ignore parse errors
  }

  return null;
}

export function tryExtractFromMeta(): Partial<ListingPayload> | null {
  const title = document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
    document.querySelector('meta[name="title"]')?.getAttribute('content');
  const image = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const priceText = Array.from(document.querySelectorAll('[content], [data-testid], span, div'))
    .map((el) => (el.textContent || "").trim())
    .find((t) => /\$\s?\d{1,3}(?:[\,\.]\d{3})*/.test(t));

  const price = parsePrice(priceText || null);

  return { title: title || undefined, price, images: image ? [image] : undefined };
}

export function tryExtractFromDom(): Partial<ListingPayload> | null {
  // Best-effort DOM queries for Marketplace item pages
  const titleEl = document.querySelector('[data-testid="marketplace_pane_title"]') ||
    document.querySelector('h1') || document.querySelector('h2');
  const priceEl = Array.from(document.querySelectorAll('span, div')).find((el) => /\$\s?\d{1,3}(?:[\,\.]\d{3})*/.test((el.textContent || '').trim()));

  // image selection: prefer data-src or src, filter out tiny icons and avatars
  const imgEls = Array.from(document.querySelectorAll('img'))
    .filter(img => {
      const src = (img.getAttribute('src') || img.getAttribute('data-src') || '') as string;
      if (!src) return false;
      if (/facebook.com\/rsrc/.test(src)) return false;
      const width = Number(img.getAttribute('width')) || 0;
      const height = Number(img.getAttribute('height')) || 0;
      if (width && height && Math.min(width, height) < 60) return false;
      return true;
    });

  const title = titleEl?.textContent?.trim() || undefined;
  const price = parsePrice(priceEl?.textContent || null);
  const images = imgEls.length ? imgEls.slice(0, 6).map(i => (i.getAttribute('src') || i.getAttribute('data-src') || '') as string) : undefined;

  // Simple heuristic for mileage/year inside text nodes
  const bodyText = document.body.innerText || "";
  const yearMatch = bodyText.match(/\b(19|20)\d{2}\b/);
  const mileageMatch = bodyText.match(/(\d{1,3}(?:[\,\.]\d{3})+)\s*(miles|mi)\b/i);

  const year = yearMatch ? Number(yearMatch[0]) : undefined;
  const mileage = mileageMatch ? parseInt(mileageMatch[1].replace(/[\,\.]/g, ''), 10) : undefined;

  // VIN detection (17-char alphanumeric excluding I,O,Q) or labeled VIN
  let vin: string | undefined;
  const vinLabel = bodyText.match(/VIN\s*[:#]?\s*([A-HJ-NPR-Z0-9]{17})/i);
  if (vinLabel) vin = vinLabel[1];
  else {
    const vinCandidate = bodyText.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
    if (vinCandidate) vin = vinCandidate[1];
  }

  // Seller type heuristics
  let sellerType: string | undefined;
  if (/dealer|auto dealer|dealer inventory/i.test(bodyText)) sellerType = 'dealer';
  else if (/private seller|owner selling|for sale by owner/i.test(bodyText)) sellerType = 'private';

  return { title, price, images, year, mileage, vin, sellerType };
}

function extractIdFromUrl(url: string): string | undefined {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const possible = parts.slice(-1)[0] || parts.slice(-2)[0];
    return possible;
  } catch (e) {
    return undefined;
  }
}

function normalize(payload: Partial<ListingPayload>, url: string): ListingPayload {
  return {
    url,
    title: payload.title,
    price: payload.price,
    images: payload.images,
    year: payload.year,
    mileage: payload.mileage,
    vin: payload.vin,
    sellerType: payload.sellerType
  };
}

function isMarketplaceItemUrl(url: string): boolean {
  return /facebook\.com\/.+marketplace|facebook\.com\/.+\/items\//.test(url);
}

export function initFacebookExtractor() {
  const url = window.location.href;
  if (!isMarketplaceItemUrl(url)) return;

  let lastSentUrl = '';

  async function extractAndSend() {
    const urlNow = window.location.href;
    if (urlNow === lastSentUrl) return;

    // Try strategies
    let payload: Partial<ListingPayload> | null = tryExtractFromLdJson();
    if (!payload) payload = tryExtractFromMeta();
    if (!payload) payload = tryExtractFromDom();

    if (!payload || (!payload.title && !payload.price)) {
      // nothing meaningful extracted
      return;
    }

    const listing = normalize(payload, urlNow);

    try {
      // Persist pre-extracted listing in chrome.storage.local so background scraper can use it if needed
      const key = `preextracted_listings`;
      const toStore: Record<string, any> = {};
      toStore[urlNow] = listing;
      chrome.storage.local.get([key], (existing: Record<string, any> = {}) => {
        const aggregated = existing[key] || {};
        aggregated[urlNow] = listing;
        const payload: Record<string, any> = {};
        payload[key] = aggregated;
        chrome.storage.local.set(payload, () => {
          // fire evaluation using only the url (existing pipeline expects only url)
          sendEvaluateListingCommand({ url: listing.url })
            .then(() => {
              lastSentUrl = urlNow;
              console.info('Facebook extractor: sent listing for evaluation', listing.url);
            })
            .catch((e) => console.error('Facebook extractor: failed to send listing', e));
        });
      });
    } catch (e) {
      console.error('Facebook extractor: failed to send listing', e);
    }
  }

  // Run once after load
  setTimeout(extractAndSend, 800);

  // Observe navigation changes in SPA and DOM mutations
  let timer: number | undefined;
  const observer = new MutationObserver(() => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => void extractAndSend(), 600);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Cleanup when page unloads
  window.addEventListener('beforeunload', () => observer.disconnect());
}

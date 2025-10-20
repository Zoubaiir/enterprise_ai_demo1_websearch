import { Observable, Subject } from "rxjs";
import type { ListingCriteria, ListingSource } from "@domain/ports/listing-source";
import type { CarListing } from "@domain/models/car-listing";

export class ListingScraperService {
  private readonly sources: ListingSource[];
  private readonly listing$ = new Subject<CarListing>();

  constructor(sources: ListingSource[]) {
    this.sources = sources;
  }

  stream(criteria: ListingCriteria): Observable<CarListing> {
    void Promise.all(
      this.sources.map((source) =>
        source.streamListings(criteria, (listing) => this.listing$.next(listing))
      )
    ).catch((error) => {
      console.error("Listing stream error", error);
    });

    return this.listing$.asObservable();
  }

  fetch(url: string): Promise<CarListing> {
    const source = this.sources.find((s) => s.supportsUrl(url));
    if (!source) {
      return Promise.reject(new Error(`No scraper found for url: ${url}`));
    }

    // Check for a pre-extracted listing stored by the content script
    return new Promise((resolve, reject) => {
      try {
        const key = 'preextracted_listings';
        chrome.storage.local.get([key], (result: Record<string, any>) => {
          const bucket = (result && result[key]) || {};
          const pre = bucket[url];
          if (pre) {
            try {
              // Normalize minimal preextracted payload to CarListing shape
              const listing: CarListing = {
                id: pre.id || `${source?.id ?? 'unknown'}:${url}`,
                source: pre.source || source?.id || 'unknown',
                url,
                title: pre.title || pre.name || '',
                description: pre.description || '',
                price: typeof pre.price === 'number' ? pre.price : Number(pre.price) || 0,
                mileage: pre.mileage,
                year: pre.year,
                make: pre.make,
                model: pre.model,
                trim: pre.trim,
                location: pre.location,
                postedAt: pre.postedAt,
                images: (pre.images || []).map((src: string, idx: number) => ({ url: src, altText: `image-${idx}` })),
                metadata: pre.metadata || {},
              } as CarListing;

              resolve(listing);
              return;
            } catch (e) {
              console.warn('Failed to use preextracted listing, falling back to scraper', e);
            }
          }

          // Fallback to the registered source scraper
          source.fetchListing(url).then(resolve).catch(reject);
        });
      } catch (e) {
        // If anything goes wrong with storage, fallback to scraper
        source.fetchListing(url).then(resolve).catch(reject);
      }
    });
  }
}

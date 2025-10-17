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
    return source.fetchListing(url);
  }
}

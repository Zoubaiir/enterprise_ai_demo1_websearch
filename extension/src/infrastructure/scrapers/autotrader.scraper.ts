import type { ListingSource, ListingCriteria } from "@domain/ports/listing-source";
import type { CarListing } from "@domain/models/car-listing";
import { nanoid } from "nanoid/non-secure";

export class AutoTraderScraper implements ListingSource {
  readonly id: string;
  
  constructor(id: string, private readonly domains: string[]) {
    this.id = id;
  }

  get idValue(): string {
    return this.id;
  }

  supportsUrl(url: string): boolean {
    return this.domains.some((domain) => url.includes(domain));
  }

  async fetchListing(url: string): Promise<CarListing> {
    // In a real implementation this would fetch the DOM/content via background script.
    return {
      id: nanoid(),
      source: this.id,
      url,
      title: "Placeholder AutoTrader Listing",
      description: "Sample description for prototype workflow.",
      price: 25000,
      images: [],
      metadata: {}
    };
  }

  async streamListings(criteria: ListingCriteria, onListing: (listing: CarListing) => void): Promise<void> {
    // Prototype emits a fake listing to validate observer wiring.
    onListing({
      id: nanoid(),
      source: this.id,
      url: "https://www.autotrader.com/cars-for-sale/sample",
      title: `Mock ${criteria.make ?? "Vehicle"}`,
      description: "Generated listing for testing.",
      price: criteria.maxPrice ?? 20000,
      images: [],
      metadata: { criteria }
    });
  }
}

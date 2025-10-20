import type { ListingSource, ListingCriteria } from "@domain/ports/listing-source";
import type { CarListing } from "@domain/models/car-listing";
import { nanoid } from "nanoid/non-secure";

export class FacebookMarketplaceScraper implements ListingSource {
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
    // Placeholder implementation for Facebook Marketplace.
    return {
      id: nanoid(),
      source: this.id,
      url,
      title: "Placeholder Facebook Marketplace Listing",
      description: "Sample description for Facebook Marketplace.",
      price: 15000,
      images: [],
      metadata: {}
    };
  }

  async streamListings(criteria: ListingCriteria, onListing: (listing: CarListing) => void): Promise<void> {
    // Emit a mock facebook listing for prototype/testing.
    onListing({
      id: nanoid(),
      source: this.id,
      url: "https://www.facebook.com/marketplace/item/sample",
      title: `FB Mock ${criteria.make ?? "Vehicle"}`,
      description: "Generated listing for testing.",
      price: criteria.maxPrice ?? 12000,
      images: [],
      metadata: { criteria }
    });
  }
}

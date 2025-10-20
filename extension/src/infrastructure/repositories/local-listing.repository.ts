import type { ListingRepository } from "@domain/ports/listing-repository";
import type { CarListing } from "@domain/models/car-listing";

export class LocalListingRepository implements ListingRepository {
  private readonly storageKey = "listings";

  async upsertListing(listing: CarListing): Promise<void> {
    const listings = await this.listTrackedListings();
    const index = listings.findIndex((item) => item.id === listing.id);
    if (index >= 0) {
      listings[index] = listing;
    } else {
      listings.push(listing);
    }
    return this.save(listings);
  }

  async getListingById(id: string): Promise<CarListing | undefined> {
    const listings = await this.listTrackedListings();
    return listings.find((listing) => listing.id === id);
  }

  async listTrackedListings(): Promise<CarListing[]> {
    const data = await this.getStorageValue<CarListing[]>(this.storageKey);
    return data ?? [];
  }

  private async save(listings: CarListing[]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.storageKey]: listings }, () => resolve());
    });
  }

  private async getStorageValue<T>(key: string): Promise<T | undefined> {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result: any) => resolve(result[key] as T | undefined));
    });
  }
}

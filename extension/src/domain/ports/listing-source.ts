import { CarListing } from "../models/car-listing";

export interface ListingSource {
  id: string;
  supportsUrl(url: string): boolean;
  fetchListing(url: string): Promise<CarListing>;
  streamListings(criteria: ListingCriteria, onListing: (listing: CarListing) => void): Promise<void>;
}

export interface ListingCriteria {
  make?: string;
  model?: string;
  maxPrice?: number;
  minYear?: number;
  maxMileage?: number;
  locations?: string[];
  keywords?: string[];
}

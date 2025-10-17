import { CarListing } from "../models/car-listing";
import { DealAssessment } from "../models/deal-assessment";

export interface ListingRepository {
  upsertListing(listing: CarListing): Promise<void>;
  getListingById(id: string): Promise<CarListing | undefined>;
  listTrackedListings(): Promise<CarListing[]>;
}

export interface AssessmentRepository {
  saveAssessment(assessment: DealAssessment): Promise<void>;
  getAssessment(listingId: string): Promise<DealAssessment | undefined>;
}

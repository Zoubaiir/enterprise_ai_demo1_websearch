import type { CarListing } from "@domain/models/car-listing";
import type { DealAssessment } from "@domain/models/deal-assessment";
import type { AssessmentRepository, ListingRepository } from "@domain/ports/listing-repository";

export class DataPersistenceManager {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly assessmentRepository: AssessmentRepository
  ) {}

  saveListing(listing: CarListing): Promise<void> {
    return this.listingRepository.upsertListing(listing);
  }

  saveAssessment(assessment: DealAssessment): Promise<void> {
    return this.assessmentRepository.saveAssessment(assessment);
  }

  async getListingWithAssessment(
    listingId: string
  ): Promise<{ listing?: CarListing; assessment?: DealAssessment }> {
    const [listing, assessment] = await Promise.all([
      this.listingRepository.getListingById(listingId),
      this.assessmentRepository.getAssessment(listingId)
    ]);
    return { listing, assessment };
  }
}

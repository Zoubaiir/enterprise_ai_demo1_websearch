import { CarListing } from "../models/car-listing";
import { DealAssessment } from "../models/deal-assessment";

export interface DealEvaluator {
  evaluate(listing: CarListing, assessment: Partial<DealAssessment>): DealAssessment;
}

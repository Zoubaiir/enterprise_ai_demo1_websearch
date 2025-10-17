import type { CarListing } from "@domain/models/car-listing";
import type { DealAssessment } from "@domain/models/deal-assessment";
import type { DealEvaluator } from "@domain/ports/deal-evaluator";

export class DealEvaluatorService {
  constructor(private readonly evaluator: DealEvaluator) {}

  evaluate(listing: CarListing, assessment: Partial<DealAssessment>): DealAssessment {
    return this.evaluator.evaluate(listing, assessment);
  }
}

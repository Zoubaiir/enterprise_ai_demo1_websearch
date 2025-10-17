import type { DealEvaluator } from "@domain/ports/deal-evaluator";
import type { CarListing } from "@domain/models/car-listing";
import type { DealAssessment } from "@domain/models/deal-assessment";

export class BasicDealEvaluator implements DealEvaluator {
  evaluate(listing: CarListing, assessment: Partial<DealAssessment>): DealAssessment {
    const predictedPrice = assessment.pricing?.predictedMarketPrice ?? listing.price;
    const delta = predictedPrice - listing.price;
    const flags = assessment.flags ?? [];

    const score = Math.max(
      0,
      Math.min(
        100,
        50 + delta / 100 - flags.filter((flag) => flag.severity === "high" || flag.severity === "critical").length * 10
      )
    );

    const verdict =
      score >= 80 ? "great" : score >= 65 ? "good" : score >= 50 ? "fair" : "poor";

    return {
      listingId: listing.id,
      overallScore: score,
      verdict,
      pricing: {
        predictedMarketPrice: predictedPrice,
        percentile: assessment.pricing?.percentile ?? 0.5,
        comparableListings: assessment.pricing?.comparableListings ?? []
      },
      maintenance: assessment.maintenance ?? {
        annualCost: 0,
        reliabilityScore: 0,
        commonIssues: []
      },
      flags,
      rationale: assessment.rationale ?? [],
      modelVersion: "basic-1.0"
    };
  }
}

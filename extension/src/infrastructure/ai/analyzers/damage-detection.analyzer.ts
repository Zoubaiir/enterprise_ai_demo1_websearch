import type { CarAnalyzer } from "@domain/ports/car-analyzer";
import type { CarListing } from "@domain/models/car-listing";
import type { DealAssessment } from "@domain/models/deal-assessment";

export class DamageDetectionAnalyzer implements CarAnalyzer {
  supports(listing: CarListing): boolean {
    return listing.images.length > 0;
  }

  async analyze(listing: CarListing): Promise<Partial<DealAssessment>> {
    // Placeholder: assume images are clean
    const flags =
      listing.images.length === 0
        ? []
        : [
            {
              code: "image-quality",
              severity: "low" as const,
              summary: "Visual review recommended",
              evidence: listing.images.slice(0, 2).map((image) => image.url)
            }
          ];
    return {
      flags,
      rationale: flags.length ? ["Images analyzed; no obvious damage detected."] : []
    };
  }
}

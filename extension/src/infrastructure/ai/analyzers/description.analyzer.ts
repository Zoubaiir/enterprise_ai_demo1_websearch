import type { CarAnalyzer } from "@domain/ports/car-analyzer";
import type { CarListing } from "@domain/models/car-listing";
import type { DealAssessment } from "@domain/models/deal-assessment";

const RED_FLAG_KEYWORDS = ["salvage", "as-is", "rebuilt", "flood", "frame damage"];

export class DescriptionAnalyzer implements CarAnalyzer {
  supports(listing: CarListing): boolean {
    return listing.description.length > 0;
  }

  async analyze(listing: CarListing): Promise<Partial<DealAssessment>> {
    const lower = listing.description.toLowerCase();
    const matchedKeywords = RED_FLAG_KEYWORDS.filter((keyword) => lower.includes(keyword));

    if (matchedKeywords.length === 0) {
      return { rationale: ["Description review: no red flag keywords found."] };
    }

    return {
      flags: matchedKeywords.map((keyword) => ({
        code: `keyword:${keyword}`,
        severity: "medium" as const,
        summary: `Listing mentions ${keyword}`,
        evidence: [listing.description]
      })),
      rationale: [`Listing description contains: ${matchedKeywords.join(", ")}`]
    };
  }
}

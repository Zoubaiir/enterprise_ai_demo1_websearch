import type { CarAnalyzer } from "@domain/ports/car-analyzer";
import type { CarListing } from "@domain/models/car-listing";
import type { DealAssessment, RiskFlag } from "@domain/models/deal-assessment";
import { DamageDetectionAnalyzer } from "./analyzers/damage-detection.analyzer";
import { DescriptionAnalyzer } from "./analyzers/description.analyzer";
import { PricingAnalyzer } from "./analyzers/pricing.analyzer";

export class CompositeAnalyzer implements CarAnalyzer {
  private readonly analyzers: CarAnalyzer[];

  constructor() {
    this.analyzers = [
      new PricingAnalyzer(),
      new DamageDetectionAnalyzer(),
      new DescriptionAnalyzer()
    ];
  }

  supports(_listing: CarListing): boolean {
    return true;
  }

  async analyze(listing: CarListing): Promise<Partial<DealAssessment>> {
    const partials = await Promise.all(
      this.analyzers.filter((analyzer) => analyzer.supports(listing)).map((analyzer) => analyzer.analyze(listing))
    );

    const flags: RiskFlag[] = [];
    const rationale: string[] = [];

    const merged = partials.reduce<Partial<DealAssessment>>((acc, partial) => {
      if (partial.flags) {
        flags.push(...partial.flags);
      }
      if (partial.rationale) {
        rationale.push(...partial.rationale);
      }
      return { ...acc, ...partial };
    }, {});

    return { ...merged, flags, rationale };
  }
}

import type { CarListing } from "@domain/models/car-listing";
import type { DealAssessment } from "@domain/models/deal-assessment";
import type { CarAnalyzer } from "@domain/ports/car-analyzer";

export class CarAnalyzerService {
  private readonly analyzers: CarAnalyzer[];

  constructor(analyzers: CarAnalyzer[]) {
    this.analyzers = analyzers;
  }

  async analyze(listing: CarListing): Promise<Partial<DealAssessment>> {
    const results = await Promise.all(
      this.analyzers
        .filter((analyzer) => analyzer.supports(listing))
        .map((analyzer) => analyzer.analyze(listing))
    );

    return results.reduce<Partial<DealAssessment>>(
      (acc, partial) => ({
        ...acc,
        ...partial,
        flags: [...(acc.flags ?? []), ...(partial.flags ?? [])],
        rationale: [...(acc.rationale ?? []), ...(partial.rationale ?? [])]
      }),
      { flags: [], rationale: [] }
    );
  }
}

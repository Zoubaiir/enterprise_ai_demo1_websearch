import { Command } from "./command";
import type { CarListing } from "@domain/models/car-listing";
import type { DealAssessment } from "@domain/models/deal-assessment";
import { ListingScraperService } from "../services/listing-scraper.service";
import { CarAnalyzerService } from "../services/car-analyzer.service";
import { DealEvaluatorService } from "../services/deal-evaluator.service";
import { DataPersistenceManager } from "../services/data-persistence-manager";
import { NotificationManager } from "../services/notification-manager";

export interface EvaluateListingPayload {
  url: string;
}

export class EvaluateListingCommand implements Command<EvaluateListingPayload, DealAssessment> {
  constructor(
    private readonly scraper: ListingScraperService,
    private readonly analyzer: CarAnalyzerService,
    private readonly evaluator: DealEvaluatorService,
    private readonly persistence: DataPersistenceManager,
    private readonly notification: NotificationManager
  ) {}

  async execute(input: EvaluateListingPayload): Promise<DealAssessment> {
    const listing = await this.scraper.fetch(input.url);
    await this.persistence.saveListing(listing);

    const assessment = await this.runAnalysis(listing);
    await this.persistence.saveAssessment(assessment);
    this.notification.notifyAssessment(assessment);

    return assessment;
  }

  private async runAnalysis(listing: CarListing): Promise<DealAssessment> {
    const partial = await this.analyzer.analyze(listing);
    return this.evaluator.evaluate(listing, partial);
  }
}

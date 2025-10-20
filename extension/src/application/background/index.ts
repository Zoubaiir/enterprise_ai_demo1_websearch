import { EvaluateListingCommand } from "../commands/evaluate-listing.command";
import { ListingScraperService } from "../services/listing-scraper.service";
import { CarAnalyzerService } from "../services/car-analyzer.service";
import { DealEvaluatorService } from "../services/deal-evaluator.service";
import { DataPersistenceManager } from "../services/data-persistence-manager";
import { NotificationManager } from "../services/notification-manager";
import { ListingSourceFactory } from "@infrastructure/factories/listing-source.factory";
import { LocalListingRepository } from "@infrastructure/repositories/local-listing.repository";
import { LocalAssessmentRepository } from "@infrastructure/repositories/local-assessment.repository";
import { BasicDealEvaluator } from "@infrastructure/ai/basic-deal-evaluator";
import { CompositeAnalyzer } from "@infrastructure/ai/composite-analyzer";
import { ListingEventBus } from "../events/listing-event-bus";

const listingSources = ListingSourceFactory.create([
  { id: "autotrader", domains: ["autotrader.com"], type: "autotrader" },
  { id: "facebook", domains: ["facebook.com", "facebookmarketplace.com"], type: "facebook" }
]);

const scraperService = new ListingScraperService(listingSources);
const analyzerService = new CarAnalyzerService([new CompositeAnalyzer()]);
const evaluatorService = new DealEvaluatorService(new BasicDealEvaluator());
const persistenceManager = new DataPersistenceManager(
  new LocalListingRepository(),
  new LocalAssessmentRepository()
);
const notificationManager = new NotificationManager([]);
const listingEventBus = new ListingEventBus();

const evaluateListingCommand = new EvaluateListingCommand(
  scraperService,
  analyzerService,
  evaluatorService,
  persistenceManager,
  notificationManager
);

scraperService.stream({ make: "Prototype", maxPrice: 22000 }).subscribe((listing) => {
  console.info("Prototype stream listing", listing);
  listingEventBus.publish({ type: "listing-discovered", listing });
});

listingEventBus.asObservable().subscribe((event) => {
  console.info("Listing event", event);
});

notificationManager.publish({
  type: "deal-update",
  payload: {
    listingId: "bootstrap",
    overallScore: 0,
    verdict: "fair",
    pricing: { predictedMarketPrice: 0, percentile: 0, comparableListings: [] },
    maintenance: { annualCost: 0, reliabilityScore: 0, commonIssues: [] },
    flags: [],
    rationale: ["Notification manager initialized."],
    modelVersion: "bootstrap"
  }
});

chrome.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: (resp?: any) => void) => {
  if (message?.type !== "evaluate-listing") {
    return;
  }

  evaluateListingCommand
    .execute(message.payload)
    .then((assessment) => sendResponse({ assessment }))
    .catch((error: unknown) => {
      console.error("Evaluation failed", error);
      sendResponse({ error: (error as Error).message });
    });

  return true; // keep the channel open for async response
});

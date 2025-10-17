import { CarListing } from "../models/car-listing";
import { DealAssessment } from "../models/deal-assessment";

export interface CarAnalyzer {
  analyze(listing: CarListing): Promise<Partial<DealAssessment>>;
  supports(listing: CarListing): boolean;
}

export interface AnalyzerContext {
  priceHistoryProvider: PriceHistoryProvider;
  imageAnalyzer: ImageAnalyzer;
  descriptionAnalyzer: DescriptionAnalyzer;
  maintenancePredictor: MaintenancePredictor;
}

export interface PriceHistoryProvider {
  getSuggestedPrice(listing: CarListing): Promise<number>;
  getComparableListingUrls(listing: CarListing): Promise<string[]>;
}

export interface ImageAnalyzer {
  detectDamage(images: CarListing["images"]): Promise<string[]>;
}

export interface DescriptionAnalyzer {
  findRedFlags(description: string): Promise<string[]>;
  extractMetadata(description: string): Promise<Record<string, unknown>>;
}

export interface MaintenancePredictor {
  estimateAnnualCost(listing: CarListing): Promise<number>;
  getReliabilityScore(listing: CarListing): Promise<number>;
  listCommonIssues(listing: CarListing): Promise<string[]>;
}

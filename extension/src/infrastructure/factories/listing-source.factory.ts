import type { ListingSource } from "@domain/ports/listing-source";
import { AutoTraderScraper } from "../scrapers/autotrader.scraper";
import { FacebookMarketplaceScraper } from "../scrapers/facebook.scraper";

export type ListingSourceConfig = {
  id: string;
  domains: string[];
  type: "autotrader" | "facebook";
};

export class ListingSourceFactory {
  static create(configs: ListingSourceConfig[]): ListingSource[] {
    return configs.map((config) => {
      switch (config.type) {
        case "autotrader":
          return new AutoTraderScraper(config.id, config.domains);
        case "facebook":
          return new FacebookMarketplaceScraper(config.id, config.domains);
        default:
          throw new Error(`Unsupported scraper type: ${config.type}`);
      }
    });
  }
}

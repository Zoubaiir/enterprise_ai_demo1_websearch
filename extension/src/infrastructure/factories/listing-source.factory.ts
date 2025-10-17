import type { ListingSource } from "@domain/ports/listing-source";
import { AutoTraderScraper } from "../scrapers/autotrader.scraper";

export type ListingSourceConfig = {
  id: string;
  domains: string[];
  type: "autotrader";
};

export class ListingSourceFactory {
  static create(configs: ListingSourceConfig[]): ListingSource[] {
    return configs.map((config) => {
      switch (config.type) {
        case "autotrader":
          return new AutoTraderScraper(config.id, config.domains);
        default:
          throw new Error(`Unsupported scraper type: ${config.type}`);
      }
    });
  }
}

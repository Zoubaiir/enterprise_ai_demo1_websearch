# Prototype Workflow

1. **Content Script** (`src/presentation/content/index.ts`) captures the active listing URL and sends an `evaluate-listing` message to the background service worker.
2. **Background Command** (`src/application/background/index.ts`) resolves the `EvaluateListingCommand`, which:
   - Invokes `ListingScraperService.fetch` to retrieve listing data via the `AutoTraderScraper`.
   - Persists the listing and runs `CarAnalyzerService` with the `CompositeAnalyzer`.
   - Passes the aggregated insights to `BasicDealEvaluator` to generate a `DealAssessment`.
   - Stores the final assessment and triggers `NotificationManager` to broadcast the update.
3. **Observer Stream**: `ListingScraperService.stream` emits prototype listings; the `ListingEventBus` logs `listing-discovered` events to verify the Observer pattern wiring.

Run `npm install` then `npm run dev` inside the `extension/` directory to bundle the service worker, content script, and popup while iterating on the prototype.

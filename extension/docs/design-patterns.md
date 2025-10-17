# Pattern Mapping

- **Strategy**: `CarAnalyzer` implementations, `DealEvaluator`, and per-site `ListingSource` scrapers.
- **Factory**: `ListingSourceFactory` (see `src/infrastructure/factories/listing-source.factory.ts`) chooses concrete scraper based on domain.
- **Observer**: `ListingEventBus` (application layer) and `NotificationManager` combine `rxjs` streams to broadcast updates.
- **Repository**: `ListingRepository` and `AssessmentRepository` ports abstract persistence details.
- **Command**: `EvaluateListingCommand` encapsulates the workflow triggered from UI actions.

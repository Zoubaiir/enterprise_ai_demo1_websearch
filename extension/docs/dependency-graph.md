# Dependency Overview

```
┌────────────────────┐        ┌────────────────────────┐
│ Presentation Layer │◀──────▶│ Application Layer      │
│ (content, popup)   │        │ (commands, observers)  │
└────────▲───────────┘        └────────▲──────────────┘
         │                             │
         │ events/messages             │ ports
         │                             │
┌────────┴───────────┐        ┌────────┴──────────────┐
│ Infrastructure      │──────▶│ Domain Layer          │
│ (scrapers, adapters)│ ports │ (entities, strategies)│
└─────────────────────┘        └──────────────────────┘
```

## Layer Responsibilities

- **Presentation**: Content and popup scripts subscribe to application events and render overlays. Communicates via message bus abstractions.
- **Application**: Orchestrates workflows using command handlers and observers. Depends on domain interfaces only.
- **Domain**: Core entities (`CarListing`, `DealAssessment`), strategy contracts, and policy logic. Infrastructure implements these interfaces.
- **Infrastructure**: Concrete scrapers, AI adapters, persistence repositories. Provides implementations for domain/application ports.

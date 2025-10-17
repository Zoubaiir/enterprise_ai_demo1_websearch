## AI Car Shopping Extension Scaffold

This directory contains a TypeScript scaffold for the AI-assisted car shopping browser extension. The project embraces a layered (Clean Architecture) approach with SOLID-friendly boundaries.

### Structure

- `src/domain`: Entities and ports (interfaces) that describe core business logic.
- `src/application`: Services, commands, and event buses orchestrating workflows.
- `src/infrastructure`: Concrete adapters (scrapers, AI clients, repositories).
- `src/presentation`: Browser-extension UI (content overlay, popup, options).

### Tooling

- `typescript`, `webpack`, and `ts-loader` compile the extension bundles.
- `rxjs` powers observer streams for listings and notifications.
- `jest` and `ts-jest` provide unit testing.

Run `npm install` inside this folder to install dependencies before building.

export interface VehicleImage {
  url: string;
  capturedAt?: string;
  altText?: string;
}

export interface VehicleHistorySummary {
  hasAccidents: boolean;
  ownersCount?: number;
  reportedIssues: string[];
}

export interface CarListing {
  id: string;
  source: string;
  url: string;
  title: string;
  description: string;
  price: number;
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  location?: string;
  postedAt?: string;
  images: VehicleImage[];
  metadata: Record<string, unknown>;
  history?: VehicleHistorySummary;
}

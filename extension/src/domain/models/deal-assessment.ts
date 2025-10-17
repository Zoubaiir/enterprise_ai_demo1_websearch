export interface PricingInsight {
  predictedMarketPrice: number;
  percentile: number;
  comparableListings: string[];
}

export interface RiskFlag {
  code: string;
  severity: "low" | "medium" | "high" | "critical";
  summary: string;
  evidence: string[];
}

export interface MaintenanceEstimate {
  annualCost: number;
  reliabilityScore: number;
  commonIssues: string[];
}

export interface DealAssessment {
  listingId: string;
  overallScore: number;
  verdict: "great" | "good" | "fair" | "poor";
  pricing: PricingInsight;
  maintenance: MaintenanceEstimate;
  flags: RiskFlag[];
  rationale: string[];
  modelVersion: string;
}

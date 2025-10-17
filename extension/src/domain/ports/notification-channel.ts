import { DealAssessment } from "../models/deal-assessment";

export interface NotificationChannel {
  id: string;
  notify(event: NotificationEvent): Promise<void>;
  supportsSubscriptions(): boolean;
  subscribe?(criteria: SubscriptionCriteria): Promise<void>;
}

export interface NotificationEvent {
  type: "new-listing" | "price-drop" | "deal-update";
  payload: DealAssessment;
}

export interface SubscriptionCriteria {
  userId: string;
  filters: Record<string, unknown>;
}

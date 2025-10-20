import type { AssessmentRepository } from "@domain/ports/listing-repository";
import type { DealAssessment } from "@domain/models/deal-assessment";

export class LocalAssessmentRepository implements AssessmentRepository {
  private readonly storageKey = "assessments";

  async saveAssessment(assessment: DealAssessment): Promise<void> {
    const assessments = await this.getAll();
    assessments[assessment.listingId] = assessment;
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.storageKey]: assessments }, () => resolve());
    });
  }

  async getAssessment(listingId: string): Promise<DealAssessment | undefined> {
    const assessments = await this.getAll();
    return assessments[listingId];
  }

  private async getAll(): Promise<Record<string, DealAssessment>> {
    return new Promise((resolve) => {
      chrome.storage.local.get(this.storageKey, (result: any) => {
        resolve((result[this.storageKey] as Record<string, DealAssessment>) ?? {});
      });
    });
  }
}

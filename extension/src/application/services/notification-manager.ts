import type { DealAssessment } from "@domain/models/deal-assessment";
import type { NotificationChannel, NotificationEvent } from "@domain/ports/notification-channel";
import { Subject } from "rxjs";

export class NotificationManager {
  private readonly channels = new Map<string, NotificationChannel>();
  private readonly events$ = new Subject<NotificationEvent>();

  constructor(channels: NotificationChannel[]) {
    channels.forEach((channel) => this.channels.set(channel.id, channel));
    this.events$.subscribe((event) => {
      void Promise.all(
        Array.from(this.channels.values()).map((channel) => channel.notify(event))
      ).catch((error) => console.error("Notification error", error));
    });
  }

  publish(event: NotificationEvent): void {
    this.events$.next(event);
  }

  notifyAssessment(assessment: DealAssessment): void {
    this.publish({
      type: "deal-update",
      payload: assessment
    });
  }
}

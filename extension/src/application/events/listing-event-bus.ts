import { Subject } from "rxjs";
import type { CarListing } from "@domain/models/car-listing";

export interface ListingEvent {
  type: "listing-discovered" | "price-updated";
  listing: CarListing;
}

export class ListingEventBus {
  private readonly subject = new Subject<ListingEvent>();

  asObservable() {
    return this.subject.asObservable();
  }

  publish(event: ListingEvent): void {
    this.subject.next(event);
  }
}

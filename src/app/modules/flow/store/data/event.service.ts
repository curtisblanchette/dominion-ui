import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Event } from '@4iiz/corev2';

@Injectable({ providedIn: 'root' })
export class EventService extends EntityCollectionServiceBase<Event> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Event', serviceElementsFactory);
  }
}

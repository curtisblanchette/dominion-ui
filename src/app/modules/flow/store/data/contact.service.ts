import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Contact } from '@4iiz/corev2';

@Injectable({ providedIn: 'root' })
export class ContactService extends EntityCollectionServiceBase<Contact> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Contact', serviceElementsFactory);
  }
}

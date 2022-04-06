import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Lead } from '@4iiz/corev2';

@Injectable({ providedIn: 'root' })
export class LeadCollection extends EntityCollectionServiceBase<Lead> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('lead', serviceElementsFactory);
  }
}

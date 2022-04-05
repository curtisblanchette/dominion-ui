import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Lead } from '@4iiz/corev2';

@Injectable({ providedIn: 'root' })
export class LeadService extends EntityCollectionServiceBase<Lead> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Lead', serviceElementsFactory);
  }
}
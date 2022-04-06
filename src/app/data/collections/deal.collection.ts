import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Deal } from '@4iiz/corev2';

@Injectable({ providedIn: 'root' })
export class ContactService extends EntityCollectionServiceBase<Deal> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('deal', serviceElementsFactory);
  }
}

import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Lead } from '@4iiz/corev2';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeadCollection extends EntityCollectionServiceBase<Lead> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('lead', serviceElementsFactory);
  }

  public override update(entity: Partial<Lead>): Observable<Lead> {

    const update = {
      ...entity,
      firstName: 'Coolest',
      lastName: 'Beaners'
    };

    // @ts-ignore
    Object.keys(update).forEach((k) => update[k] == null && delete update[k]);
    delete update.createdAt;
    delete update.updatedAt;

    return super.update(update);
  }
}

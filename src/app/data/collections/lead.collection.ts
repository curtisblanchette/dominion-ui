import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Lead } from '@4iiz/corev2';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeadCollection extends EntityCollectionServiceBase<Lead> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('leads', serviceElementsFactory);
  }

  // override add(lead: Lead): Observable<any> {
  //   return super.add(lead);
  // }
  //
  // override delete(id: any): Observable<any> {
  //   return super.delete(id);
  // }
  //
  // override getByKey(id: any): Observable<any> {
  //   return super.getByKey(id);
  // }
  //
  // override getAll(): Observable<any> {
  //   return super.getAll();
  // }
  //
  // override update(lead: Lead): Observable<any> {
  //   return super.update(lead);
  // }
}

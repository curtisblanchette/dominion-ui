import { Router } from '@angular/router';
import { Directive, Input } from '@angular/core';
import { EntityCollectionComponentBase } from '../data/entity-collection.component.base';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';

@Directive()
export class ComponentStateBase extends EntityCollectionComponentBase {



  constructor(
    router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory)


  }
}

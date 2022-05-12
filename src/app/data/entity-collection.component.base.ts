import { ModuleType } from '../modules/flow/_core';
import { Router } from '@angular/router';
import { EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { Observable } from 'rxjs';
import { DominionType, types } from '../common/models';

export class EntityCollectionComponentBase {
  public _dynamicService: EntityCollectionService<DominionType>;
  public module: ModuleType;
  public type: any;
  public state: any;

  public loaded$: Observable<boolean>;
  public loading$: Observable<boolean>;
  public data$: Observable<DominionType[]>;
  public count$: Observable<number>;

  constructor(
    router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory
  ) {
    this.state = router.getCurrentNavigation()!.extras.state;
    this.module = this.state?.module;
    this.type = types[this.module];
    if (this.module) {
      // TODO this type "Lead" should be dynamic
      this._dynamicService = this.createService(this.type, entityCollectionServiceFactory);
      this.data$ = this._dynamicService.filteredEntities$;
      this.loading$ = this._dynamicService.loading$;
      this.loaded$ = this._dynamicService.loaded$;
      this.count$ = this._dynamicService.count$;
    }
  }

  /** return a service that has a dynamic type defined */
  createService<T>(module: T, factory: EntityCollectionServiceFactory): EntityCollectionService<T> {
    return factory.create<T>(this.module);
  }


}
